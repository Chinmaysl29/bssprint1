import 'server-only'

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type BackupSource = 'client' | 'admin'

export type BackupEnvelope = {
  id: unknown
  table: string
  data: Record<string, unknown>
  created_at: string
  synced_to_db: true
}

const locks = new Map<string, Promise<void>>()
const memoryRetryQueue = new Map<string, BackupEnvelope[]>()
const sensitiveKey = /password|passwd|secret|token|service[_-]?role|authorization|cookie|card[_-]?(number|cvv|cvc)|cvv|cvc/i

function backupDirectory(source: BackupSource) {
  return path.join(process.cwd(), source === 'admin' ? 'homiepg-admin' : '', 'data-backup')
}

function safeTableName(table: string) {
  if (!/^[a-z][a-z0-9_-]*$/i.test(table)) throw new Error(`Invalid table name: ${table}`)
  return table
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact)
  if (!value || typeof value !== 'object') return value

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, child]) => [
      key,
      sensitiveKey.test(key) ? '[REDACTED]' : redact(child),
    ]),
  )
}

function serialize(file: string, operation: () => Promise<void>) {
  const previous = locks.get(file) ?? Promise.resolve()
  const current = previous.catch(() => undefined).then(operation)
  locks.set(file, current)
  return current.finally(() => {
    if (locks.get(file) === current) locks.delete(file)
  })
}

async function readArray<T>(file: string): Promise<T[]> {
  try {
    const content = await readFile(file, 'utf8')
    const parsed: unknown = JSON.parse(content)
    if (!Array.isArray(parsed)) throw new Error(`${file} does not contain a JSON array`)
    return parsed as T[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw error
  }
}

async function atomicWrite(file: string, value: unknown) {
  await mkdir(path.dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  await rename(temporary, file)
}

async function appendEnvelope(file: string, envelope: BackupEnvelope) {
  await serialize(file, async () => {
    const records = await readArray<BackupEnvelope>(file)
    if (!records.some((record) => record.id === envelope.id && record.table === envelope.table)) {
      records.push(envelope)
      await atomicWrite(file, records)
    }
  })
}

async function queueFailedWrite(source: BackupSource, envelope: BackupEnvelope) {
  const directory = backupDirectory(source)
  const queueFile = path.join(directory, '_failed-writes.json')
  try {
    await appendEnvelope(queueFile, envelope)
  } catch (error) {
    const key = `${source}:${envelope.table}`
    memoryRetryQueue.set(key, [...(memoryRetryQueue.get(key) ?? []), envelope])
    console.warn(`[data-backup] Could not persist retry queue for ${String(envelope.id)}`, error)
  }
}

export async function flushFailedWrites(source: BackupSource) {
  const directory = backupDirectory(source)
  const queueFile = path.join(directory, '_failed-writes.json')
  const queued = await readArray<BackupEnvelope>(queueFile).catch(() => [])
  const inMemory = [...memoryRetryQueue.entries()]
    .filter(([key]) => key.startsWith(`${source}:`))
    .flatMap(([, records]) => records)
  const pending = [...queued, ...inMemory]
  if (!pending.length) return

  const failed: BackupEnvelope[] = []
  for (const envelope of pending) {
    try {
      await appendEnvelope(path.join(directory, `${safeTableName(envelope.table)}.json`), envelope)
    } catch {
      failed.push(envelope)
    }
  }

  await serialize(queueFile, () => atomicWrite(queueFile, failed)).catch(() => undefined)
  for (const key of memoryRetryQueue.keys()) {
    if (key.startsWith(`${source}:`)) memoryRetryQueue.delete(key)
  }
  for (const envelope of failed) {
    const key = `${source}:${envelope.table}`
    memoryRetryQueue.set(key, [...(memoryRetryQueue.get(key) ?? []), envelope])
  }
}

export async function appendToJsonBackup(
  source: BackupSource,
  table: string,
  insertedRow: Record<string, unknown>,
) {
  const validTable = safeTableName(table)
  const safeData = redact(insertedRow) as Record<string, unknown>
  const envelope: BackupEnvelope = {
    id: safeData.id ?? crypto.randomUUID(),
    table: validTable,
    data: safeData,
    created_at: typeof safeData.created_at === 'string' ? safeData.created_at : new Date().toISOString(),
    synced_to_db: true,
  }

  try {
    await appendEnvelope(path.join(backupDirectory(source), `${validTable}.json`), envelope)
  } catch (error) {
    console.warn(`[data-backup] JSON write failed for ${String(envelope.id)}; queued for retry`, error)
    await queueFailedWrite(source, envelope)
  }
}
