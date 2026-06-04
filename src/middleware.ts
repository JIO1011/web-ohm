import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the admin area needs session refresh + protection. Public participant
  // and results pages reach Supabase server-side via the service role instead.
  matcher: ["/consensus/admin/:path*"],
};
