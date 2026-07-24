import { Schema, model } from 'mongoose';
export interface IBackup { guildId: string; createdBy: string; data: Record<string, unknown>; createdAt: Date; }
const schema = new Schema<IBackup>({ guildId: { type: String, index: true }, createdBy: String, data: Schema.Types.Mixed, createdAt: { type: Date, default: Date.now } });
export const Backup = model<IBackup>('Backup', schema);
