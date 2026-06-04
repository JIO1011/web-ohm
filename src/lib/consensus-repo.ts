/* ──────────────────────────────────────────────────────────
 *  Consensus MVP — JSON file-based persistence
 *  Same pattern as leads-repo.ts: single JSON file + mutex.
 *  Single-process only — swap for a real DB on multi-instance deploys.
 * ────────────────────────────────────────────────────────── */

import path from "node:path";
import fs from "node:fs/promises";
import { randomInt } from "node:crypto";
import { cache } from "react";
import type { ConsensusSession, Need, SubmitNeedPayload } from "@/features/consensus/types";
import { calculateScore, clampLevel, getPriority } from "@/features/consensus/scoring";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_FILE = path.join(DATA_DIR, "consensus.json");

/* ── Write mutex (prevents read/write race under concurrent POSTs) ── */
let writeLock: Promise<void> = Promise.resolve();

interface Store {
  sessions: ConsensusSession[];
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(STORE_FILE);
  } catch {
    await fs.writeFile(STORE_FILE, JSON.stringify({ sessions: [] }, null, 2), "utf-8");
  }
}

async function readStore(): Promise<Store> {
  await ensureFile();
  const raw = await fs.readFile(STORE_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw) as Store;
    return parsed?.sessions ? parsed : { sessions: [] };
  } catch {
    return { sessions: [] };
  }
}

async function writeStore(store: Store): Promise<void> {
  await ensureFile();
  // Atomic write: serialize to a temp file then rename, so a crash mid-write
  // never corrupts the live store (rename is atomic on the same filesystem).
  const tmp = `${STORE_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf-8");
  await fs.rename(tmp, STORE_FILE);
}

/* ── Code generation ── */

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[randomInt(chars.length)]; // crypto-grade, unbiased
  }
  return code;
}

/* ── Public API ── */

export async function createSession(name: string): Promise<ConsensusSession> {
  const release = writeLock;
  let resolveNext!: () => void;
  writeLock = new Promise<void>((resolve) => {
    resolveNext = resolve;
  });

  try {
    await release;
    const store = await readStore();

    // Generate unique code (retry if collision, extremely unlikely with 6 chars)
    let code = generateCode();
    let retries = 0;
    while (store.sessions.some((s) => s.code === code) && retries < 10) {
      code = generateCode();
      retries++;
    }

    const session: ConsensusSession = {
      code,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      needs: [],
    };

    store.sessions.push(session);
    await writeStore(store);
    return session;
  } finally {
    resolveNext();
  }
}

/**
 * Look up a session by code. Wrapped in React `cache()` so a single request
 * (e.g. generateMetadata + the page body) reads the JSON file only once.
 * The cache is per-request, so mutations from other requests are never stale.
 */
export const getSession = cache(async (code: string): Promise<ConsensusSession | null> => {
  const store = await readStore();
  return store.sessions.find((s) => s.code === code.toUpperCase()) ?? null;
});

export async function addNeed(code: string, input: SubmitNeedPayload): Promise<Need | null> {
  const release = writeLock;
  let resolveNext!: () => void;
  writeLock = new Promise<void>((resolve) => {
    resolveNext = resolve;
  });

  try {
    await release;
    const store = await readStore();
    const session = store.sessions.find((s) => s.code === code.toUpperCase());
    if (!session) return null;

    const impact = clampLevel(input.impact);
    const urgency = clampLevel(input.urgency);
    const scope = clampLevel(input.scope);
    const score = calculateScore(impact, urgency, scope);

    const need: Need = {
      id: `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      name: input.name.trim(),
      area: input.area.trim(),
      category: input.category,
      description: input.description.trim(),
      justification: input.justification.trim(),
      impact,
      urgency,
      scope,
      score,
      priority: getPriority(score),
      submittedAt: new Date().toISOString(),
    };

    session.needs.push(need);
    await writeStore(store);
    return need;
  } finally {
    resolveNext();
  }
}
