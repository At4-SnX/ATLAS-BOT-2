import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export interface StoredWarn { guildId: string; userId: string; moderatorId: string; reason: string; warnId: string; createdAt: string; }
export interface StoredBackup { guildId: string; createdBy: string; data: Record<string, unknown>; createdAt: string; }
export interface StoredConfig { antiNuke: boolean; antiBot: boolean; raidMode: boolean; }
interface Database { warns: StoredWarn[]; backups: StoredBackup[]; configs: Record<string, StoredConfig>; }
const file = join(process.cwd(), 'data', 'atlas.json');
const empty = (): Database => ({ warns: [], backups: [], configs: {} });
let queue = Promise.resolve();

async function read(): Promise<Database> { try { return JSON.parse(await readFile(file, 'utf8')) as Database; } catch { return empty(); } }
async function mutate<T>(operation: (db: Database) => T | Promise<T>): Promise<T> { let result!: T; queue = queue.then(async () => { const db = await read(); result = await operation(db); await mkdir(dirname(file), { recursive: true }); await writeFile(file, JSON.stringify(db), 'utf8'); }); await queue; return result; }
export const store = { read, mutate };
