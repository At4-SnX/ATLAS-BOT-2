import { store, type StoredWarn } from '../database/store.js';
export type IWarn = StoredWarn;
export const Warn = {
  async create(warn: Omit<StoredWarn, 'createdAt' | 'guildId'> & { guildId: string | null }) { return store.mutate(db => { const item = { ...warn, guildId: warn.guildId!, createdAt: new Date().toISOString() }; db.warns.push(item); return item; }); },
  async find(filter: Omit<Partial<StoredWarn>, 'guildId'> & { guildId?: string | null }) { const db = await store.read(); return db.warns.filter(w => Object.entries(filter).every(([key, value]) => w[key as keyof StoredWarn] === value)); },
  async findOneAndDelete(filter: Omit<Partial<StoredWarn>, 'guildId'> & { guildId?: string | null }) { return store.mutate(db => { const index = db.warns.findIndex(w => Object.entries(filter).every(([key, value]) => w[key as keyof StoredWarn] === value)); return index < 0 ? null : db.warns.splice(index, 1)[0]; }); }
};
