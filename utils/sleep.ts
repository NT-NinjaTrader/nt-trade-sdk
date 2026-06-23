/**
 * Utility function to pause execution for a specified duration.
 * @param ms - milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
