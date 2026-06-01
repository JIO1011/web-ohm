import path from "node:path";
import fs from "node:fs/promises";
import type { LeadRecord } from "@/types";

/**
 * File-based leads repo with a per-process mutex to avoid the read/write race
 * that plagues the original implementation. Swap for Postgres in production.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

let writeLock: Promise<void> = Promise.resolve();

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<LeadRecord[]> {
  await ensureFile();
  const raw = await fs.readFile(LEADS_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeadRecord[]) : [];
  } catch {
    return [];
  }
}

export async function listLeads(): Promise<LeadRecord[]> {
  return readAll();
}

export async function createLead(
  input: Omit<LeadRecord, "id" | "status" | "createdAt">
): Promise<LeadRecord> {
  const release = writeLock;
  let resolveNext!: () => void;
  writeLock = new Promise<void>((resolve) => {
    resolveNext = resolve;
  });

  try {
    await release;
    const all = await readAll();
    const lead: LeadRecord = {
      ...input,
      id: `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      status: "Nuevo",
      createdAt: new Date().toISOString(),
    };
    all.push(lead);
    await fs.writeFile(LEADS_FILE, JSON.stringify(all, null, 2), "utf-8");
    return lead;
  } finally {
    resolveNext();
  }
}
