export type TestSearchCriteria = {
  destination?: string;
  checkIn??: string; // iso date or app-specific string
  checkOut??: string;
  guests?: number;
  rooms?: number;
};

export function getTestSearchCriteria(): TestSearchCriteria {
  // Keep this simple and config-driven. The app still determines what it needs on the UI.
  // We only pass the values into the Search page if the controls exist.
  return {
    destination: process.env.E2E_DESTINATION || '',
    checkIn: process.env.E2E_CHECK_IN || '',
    checkOut: process.env.E2E_CHECK_OUT || '',
    guests: process.env.E2E_GUESTS ? Number(process.env.E2E_GUESTS) : undefined,
    rooms: process.env.E2E_ROOMS ? Number(process.env.E2E_ROOMS) : undefined,
  };
}
