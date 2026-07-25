import 'dotenv/config';

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variable d'environnement manquante: ${key}`);
  return value;
}
const csv = (key: string) => (process.env[key] ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);

export const env = {
  token: required('DISCORD_TOKEN'), clientId: required('CLIENT_ID'),
  logChannelId: process.env.LOG_CHANNEL_ID, guildId: process.env.GUILD_ID,
  badWords: csv('BAD_WORDS'), badWordsShort: csv('BAD_WORDS_SHORT'), phishingWords: csv('PHISHING_WORDS'),
  automodAction: (process.env.AUTOMOD_ACTION ?? 'warn') as 'warn' | 'timeout',
  automodTimeoutMinutes: Number(process.env.AUTOMOD_TIMEOUT_MINUTES ?? 10),
  antinukeThreshold: Number(process.env.ANTINUKE_THRESHOLD ?? 3), cooldownSeconds: Number(process.env.COMMAND_COOLDOWN_SECONDS ?? 3),
  staffRoleIds: csv('STAFF_ROLE_IDS'), safeRoleIds: csv('SAFE_ROLE_IDS'), trustedOwnerIds: csv('TRUSTED_OWNER_IDS'),
  allowedBotIds: csv('ALLOWED_BOT_IDS')
};
