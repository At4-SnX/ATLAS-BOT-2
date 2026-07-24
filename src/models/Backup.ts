import { store, type StoredBackup } from '../database/store.js';
export type IBackup = StoredBackup;
export const Backup = { async create(backup: Omit<StoredBackup, 'createdAt'>) { return store.mutate(db => { const item = { ...backup, createdAt: new Date().toISOString() }; db.backups.push(item); return item; }); }, async latest(guildId: string) { const db = await store.read(); return db.backups.filter(b => b.guildId === guildId).sort((a,b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null; } };
