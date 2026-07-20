import { createClient } from '@/utils/supabase/client'

type RecordData = Record<string, unknown>

function queueBackup(table: string, rows: RecordData[]) {
  void fetch('/api/data-backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'client', table, rows }),
    keepalive: true,
  }).catch((error) => console.warn(`[data-backup] Could not back up ${table}`, error))
}

/**
 * Creates a Supabase row and asynchronously stores the returned row locally.
 * Supabase remains authoritative: backup failures never change the result.
 */
export async function createRecord(table: string, data: RecordData | RecordData[]) {
  const result = await createClient().from(table).insert(data).select()

  if (!result.error && result.data) {
    queueBackup(table, (Array.isArray(result.data) ? result.data : [result.data]) as RecordData[])
  }

  return result
}
