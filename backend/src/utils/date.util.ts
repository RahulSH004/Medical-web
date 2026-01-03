/**
 * Validates if a date string is in YYYY-MM-DD format
 */
export function isValidDateString(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

/**
 * Validates if a time string is in HH:MM format
 */
export function isValidTimeString(timeString: string): boolean {
    const regex = /^\d{2}:\d{2}$/;
    return regex.test(timeString);
}

/**
 * Calculates hours between two dates
 */
export function getHoursBetween(date1: Date, date2: Date): number {
    return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
}

/**
 * Adds days to a date
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Formats date to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

