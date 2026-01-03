export * from "./booking-status";
export * from "./time-slots";

export const BOOKING_CONSTANTS = {
    LAB_CAPACITY_PER_SLOT: 20,
    MAX_ADVANCE_BOOKING_DAYS: 30,
    MIN_HOURS_BEFORE_BOOKING: 2,
} as const;

