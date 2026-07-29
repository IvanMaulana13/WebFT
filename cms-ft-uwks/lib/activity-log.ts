import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

interface LogActivityParams {
  userId?: number | null;
  action: string; // 'login_success' | 'login_failed' | 'create' | 'update' | 'delete'
  module: string; // 'auth' | 'users' | 'berita' | ...
  recordId?: number | null;
  detail?: string | null; // JSON string atau deskripsi bebas
}

/**
 * Catat aktivitas ke tabel activity_logs.
 * Error logging tidak akan menghentikan flow utama.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await db.insert(activityLogs).values({
      userId: params.userId ?? null,
      action: params.action,
      module: params.module,
      recordId: params.recordId ?? null,
      detail: params.detail ?? null,
    });
  } catch (error) {
    // Jangan biarkan error logging mengganggu flow utama
    console.error("[activity-log] Failed to log activity:", error);
  }
}
