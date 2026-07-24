import { store } from '../database/store.js';
export interface IGuildConfig { guildId: string; antiNuke: boolean; antiBot: boolean; raidMode: boolean; save(): Promise<void>; }
export async function guildConfig(guildId: string): Promise<IGuildConfig> {
  const db = await store.read();
  const current = db.configs[guildId] ?? { antiNuke: false, antiBot: false, raidMode: false };
  const config: IGuildConfig = { guildId, ...current, save: async () => { await store.mutate(data => { data.configs[guildId] = { antiNuke: config.antiNuke, antiBot: config.antiBot, raidMode: config.raidMode }; }); } };
  return config;
}
