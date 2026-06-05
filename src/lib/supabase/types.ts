/* ──────────────────────────────────────────────────────────
 *  Supabase — Database schema types (hand-written to match the
 *  SQL migration in supabase/migrations). Keep in sync with the SQL.
 * ────────────────────────────────────────────────────────── */

import type { Priority } from "@/features/consensus/types";

export type SessionStatus = "open" | "closed";

// NOTE: these are `type` aliases (not `interface`) on purpose — Supabase's
// GenericTable requires Row/Insert/Update to be assignable to
// `Record<string, unknown>`, which interfaces are not. As `type` they satisfy
// it, so the typed client resolves columns instead of falling back to `never`.
export type SessionRow = {
  id: string;
  code: string;
  name: string;
  owner_id: string;
  status: SessionStatus;
  categories: string[];
  closes_at: string | null;
  created_at: string;
};

export type NeedRow = {
  id: string;
  session_id: string;
  name: string;
  area: string;
  category: string;
  description: string;
  justification: string | null;
  impact: number;
  urgency: number;
  scope: number;
  score: number;
  priority: Priority;
  group_id: string | null;
  submitted_at: string;
};

export type GroupRow = {
  id: string;
  session_id: string;
  name: string;
  created_at: string;
};

export type VoteRow = {
  id: string;
  session_id: string;
  target_kind: "need" | "group";
  target_id: string;
  voter_key: string;
  value: -1 | 1;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      consensus_sessions: {
        Row: SessionRow;
        Insert: Omit<SessionRow, "id" | "created_at" | "status" | "categories" | "closes_at"> & {
          id?: string;
          created_at?: string;
          status?: SessionStatus;
          categories?: string[];
          closes_at?: string | null;
        };
        Update: Partial<Omit<SessionRow, "id" | "owner_id">>;
        Relationships: [];
      };
      consensus_needs: {
        Row: NeedRow;
        Insert: Omit<NeedRow, "id" | "submitted_at" | "group_id"> & {
          id?: string;
          submitted_at?: string;
          group_id?: string | null;
        };
        Update: Partial<Omit<NeedRow, "id" | "session_id">>;
        Relationships: [];
      };
      consensus_groups: {
        Row: GroupRow;
        Insert: Omit<GroupRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GroupRow, "id" | "session_id">>;
        Relationships: [];
      };
      consensus_votes: {
        Row: VoteRow;
        Insert: Omit<VoteRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<VoteRow, "id" | "session_id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
