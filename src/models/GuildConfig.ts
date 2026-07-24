import { Schema, model } from 'mongoose';
export interface IGuildConfig { guildId: string; antiNuke: boolean; antiBot: boolean; raidMode: boolean; }
const schema = new Schema<IGuildConfig>({ guildId: { type: String, unique: true }, antiNuke: { type: Boolean, default: false }, antiBot: { type: Boolean, default: false }, raidMode: { type: Boolean, default: false } });
export const GuildConfig = model<IGuildConfig>('GuildConfig', schema);
export async function guildConfig(guildId: string) { return GuildConfig.findOneAndUpdate({ guildId }, { $setOnInsert: { guildId } }, { new: true, upsert: true }); }
