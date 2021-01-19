import { FimReccurance } from "../model";

/**
 * month is 0-indexed (0 = Jan)
 * date is 1-indexed (1 = 1st)
 * @param options
 */
export const createMontlyReccurance = (
  dayOfTheMonth: number
): FimReccurance => ({
  occursOn: (date: Date) => date.getDate() === dayOfTheMonth,
});
