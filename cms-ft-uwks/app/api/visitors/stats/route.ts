import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { visitorLogs } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * GET /api/visitors/stats
 *
 * Mengembalikan statistik total pengunjung unik dari tabel visitor_logs.
 * Menggunakan aggregation langsung di database - tidak menarik semua data ke memory.
 *
 * Response:
 * {
 *   totalVisitors: number,       // COUNT(DISTINCT visitor_id)
 *   totalPageViews: number,      // COUNT(*) semua baris
 *   todayVisitors: number,       // unique visitor hari ini
 *   yesterdayVisitors: number,   // unique visitor kemarin
 *   last7DaysVisitors: number,   // unique visitor 7 hari terakhir
 *   last30DaysVisitors: number,  // unique visitor 30 hari terakhir
 * }
 */
export async function GET() {
  try {
    const [totalResult, todayResult, yesterdayResult, last7Result, last30Result] =
      await Promise.all([
        // Total all-time unique visitors dan total page views
        db
          .select({
            totalVisitors: sql<number>`COUNT(DISTINCT visitor_id)`,
            totalPageViews: sql<number>`COUNT(*)`,
          })
          .from(visitorLogs),

        // Unique visitors hari ini (UTC)
        db
          .select({
            count: sql<number>`COUNT(DISTINCT visitor_id)`,
          })
          .from(visitorLogs)
          .where(sql`DATE(created_at) = CURDATE()`),

        // Unique visitors kemarin
        db
          .select({
            count: sql<number>`COUNT(DISTINCT visitor_id)`,
          })
          .from(visitorLogs)
          .where(sql`DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`),

        // Unique visitors 7 hari terakhir
        db
          .select({
            count: sql<number>`COUNT(DISTINCT visitor_id)`,
          })
          .from(visitorLogs)
          .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),

        // Unique visitors 30 hari terakhir
        db
          .select({
            count: sql<number>`COUNT(DISTINCT visitor_id)`,
          })
          .from(visitorLogs)
          .where(sql`created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`),
      ]);

    return NextResponse.json({
      totalVisitors: Number(totalResult[0]?.totalVisitors ?? 0),
      totalPageViews: Number(totalResult[0]?.totalPageViews ?? 0),
      todayVisitors: Number(todayResult[0]?.count ?? 0),
      yesterdayVisitors: Number(yesterdayResult[0]?.count ?? 0),
      last7DaysVisitors: Number(last7Result[0]?.count ?? 0),
      last30DaysVisitors: Number(last30Result[0]?.count ?? 0),
    });
  } catch (error) {
    console.error("[GET /api/visitors/stats]", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik pengunjung" },
      { status: 500 }
    );
  }
}
