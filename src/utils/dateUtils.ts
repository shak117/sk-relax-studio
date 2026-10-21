/**
 * Safe Date Parsing and Formatting Utilities for SK Relax Batches & Events
 */

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Safely parse a date string in YYYY-MM-DD, DD-MM-YYYY, or ISO format.
 */
export function parseEventDate(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  if (!clean) return null;

  // Pattern: DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Pattern: YYYY-MM-DD or YYYY/MM/DD
  const ymdMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }

  // Standard fallback
  const fallback = new Date(clean);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Check if a date string is in the past (before end of that day)
 */
export function isDateInPast(dateStr?: string | null): boolean {
  const d = parseEventDate(dateStr);
  if (!d) return false;
  // End of that date in local time
  const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return endOfDay.getTime() < Date.now();
}

/**
 * Formats a date or range cleanly.
 * If start === end or end is omitted, displays single date: "22 Oct 2026"
 * If multi-day: "23 – 25 Oct 2026"
 */
export function formatEventDateRange(
  startDateStr?: string | null,
  endDateStr?: string | null,
  fullMonth: boolean = false
): string {
  const start = parseEventDate(startDateStr);
  const end = parseEventDate(endDateStr);

  const months = fullMonth ? MONTH_NAMES_FULL : MONTH_NAMES_SHORT;

  if (!start && !end) return startDateStr || '';
  if (start && (!end || start.getTime() === end.getTime())) {
    return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
  }
  if (!start && end) {
    return `${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  }

  if (start && end) {
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    if (sameMonth) {
      return `${start.getDate()} – ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    }
    if (sameYear) {
      return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  }

  return startDateStr || '';
}

/**
 * Converts date to YYYY-MM-DD for HTML date input
 */
export function toInputDateFormat(dateStr?: string | null): string {
  const d = parseEventDate(dateStr);
  if (!d) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
