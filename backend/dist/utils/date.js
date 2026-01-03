"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDateString = isValidDateString;
exports.isValidTimeString = isValidTimeString;
exports.getHoursBetween = getHoursBetween;
exports.addDays = addDays;
/**
 * Validates if a date string is in YYYY-MM-DD format
 */
function isValidDateString(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}
/**
 * Validates if a time string is in HH:MM format
 */
function isValidTimeString(timeString) {
    const regex = /^\d{2}:\d{2}$/;
    return regex.test(timeString);
}
/**
 * Calculates hours between two dates
 */
function getHoursBetween(date1, date2) {
    return (date2.getTime() - date1.getTime()) / (1000 * 60 * 60);
}
/**
 * Adds days to a date
 */
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
//# sourceMappingURL=date.js.map