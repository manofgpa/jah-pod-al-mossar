/** Returns the current date (or given date) as a YYYY-MM-DD string in BRT (America/Sao_Paulo, UTC-3). */
export function getBRTDateStr(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(date);
}
