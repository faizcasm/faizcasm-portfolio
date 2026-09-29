import { NextRequest, NextResponse } from "next/server";
import { getTrendingSnapshot } from "@/lib/github";

/**
 * Internal JSON endpoint behind the Trending widget, so the client component
 * paginates without ever talking to GitHub directly (token stays server-only,
 * and responses reuse the hour-long GitHub cache).
 */
export async function GET(request: NextRequest) {
  const rawPage = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const page = Number.isFinite(rawPage)
    ? Math.min(5, Math.max(1, Math.trunc(rawPage)))
    : 1;

  const snapshot = await getTrendingSnapshot(page);
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
