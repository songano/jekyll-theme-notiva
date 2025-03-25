/**
 * Date Utility Functions
 * Handles date formatting using dayjs
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// Format types
export type DateFormatType = 'relative' | 'full' | 'date' | 'time' | 'iso' | 'custom';

// Date format options
interface DateFormatOptions {
  locale?: string;
  timezone?: string;
  customFormat?: string;
}

/**
 * Format a date string or timestamp
 * @param dateInput Date string, timestamp, or Date object
 * @param formatType Type of formatting to apply
 * @param options Additional formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateInput: string | number | Date,
  formatType: DateFormatType = 'full',
  options: DateFormatOptions = {}
): string {
  // Set locale if provided
  if (options.locale) {
    import(`dayjs/locale/${options.locale}.js`)
      .then(() => {
        dayjs.locale(options.locale);
      })
      .catch(() => {
        console.warn(`Locale ${options.locale} not available for dayjs`);
      });
  }

  // Create dayjs instance
  let date = dayjs(dateInput);

  // Apply timezone if provided
  if (options.timezone) {
    date = date.tz(options.timezone);
  }

  // Format based on type
  switch (formatType) {
    case 'relative':
      return date.fromNow();

    case 'full':
      return date.format('LL LT'); // e.g. March 25, 2023 2:30 PM

    case 'date':
      return date.format('LL'); // e.g. March 25, 2023

    case 'time':
      return date.format('LT'); // e.g. 2:30 PM

    case 'iso':
      return date.toISOString();

    case 'custom':
      return date.format(options.customFormat || 'YYYY-MM-DD');

    default:
      return date.format('LL');
  }
}

/**
 * Get the current time in a specific timezone
 * @param timezone Timezone identifier (e.g., 'America/New_York')
 * @param format Date format string
 * @returns Formatted current time
 */
export function getCurrentTime(timezone?: string, format = 'h:mm A'): string {
  let date = dayjs();

  if (timezone) {
    date = date.tz(timezone);
  }

  return date.format(format);
}

/**
 * Check if a date is today
 * @param dateInput Date to check
 * @returns True if date is today
 */
export function isToday(dateInput: string | number | Date): boolean {
  const date = dayjs(dateInput);
  const today = dayjs();

  return date.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
}

/**
 * Get the difference between two dates in a specific unit
 * @param date1 First date
 * @param date2 Second date (defaults to now)
 * @param unit Unit for the difference
 * @returns Difference in the specified unit
 */
export function dateDiff(
  date1: string | number | Date,
  date2: string | number | Date = new Date(),
  unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' = 'day'
): number {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);

  return d2.diff(d1, unit);
}

/**
 * Format a timespan in a human-readable format
 * @param seconds Number of seconds
 * @returns Formatted timespan
 */
export function formatTimespan(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    return `${hours} hour${hours === 1 ? '' : 's'} ${remainingMinutes} minute${remainingMinutes === 1 ? '' : 's'}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  return `${days} day${days === 1 ? '' : 's'} ${remainingHours} hour${remainingHours === 1 ? '' : 's'}`;
}

/**
 * Format a date for the post header
 * @param dateString Date string from post frontmatter
 * @param locale Locale string
 * @returns Formatted date
 */
export function formatPostDate(dateString: string, locale?: string): string {
  if (!dateString) return '';

  // Create options object
  const options: DateFormatOptions = {};
  if (locale) {
    options.locale = locale;
  }

  // Get site configuration timezone if available
  // if (window.siteConfig?.timezone) {
  //   options.timezone = 'Asia/Seoul';
  // }

  return formatDate(dateString, 'date', options);
}

// Export all date utilities
export default {
  formatDate,
  getCurrentTime,
  isToday,
  dateDiff,
  formatTimespan,
  formatPostDate,
};
