import { createClient } from './supabase'

type RecordData = Record<string, unknown>

function queueBackup(table: string, rows: RecordData[]) {
  const backupUrl = import.meta.env.VITE_BACKUP_API_URL ?? 'http://localhost:3000/api/data-backup'
  void fetch(backupUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'admin', table, rows }),
    keepalive: true,
  }).catch((error) => console.warn(`[data-backup] Could not back up ${table}`, error))
}

/** Supabase is authoritative; the local backup request is intentionally non-blocking. */
export async function createRecord(table: string, data: RecordData | RecordData[]) {
  const result = await createClient().from(table).insert(data).select()

  if (!result.error && result.data) {
    queueBackup(table, (Array.isArray(result.data) ? result.data : [result.data]) as RecordData[])
  }

  return result
}
