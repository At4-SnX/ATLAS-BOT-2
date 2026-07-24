import { Schema, model } from 'mongoose';
export interface IWarn { guildId: string; userId: string; moderatorId: string; reason: string; warnId: string; createdAt: Date; }
const schema = new Schema<IWarn>({ guildId: { type: String, index: true }, userId: { type: String, index: true }, moderatorId: String, reason: String, warnId: { type: String, unique: true }, createdAt: { type: Date, default: Date.now } });
export const Warn = model<IWarn>('Warn', schema);
