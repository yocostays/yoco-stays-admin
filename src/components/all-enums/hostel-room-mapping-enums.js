export const bedTypeLabels = {
  1: 'Single',
  2: 'Double',
  3: 'Triplet',
  4: 'Quadrille',
  5: 'Quintuple',
  6: 'Sixtupple'
};

export const bedTypeLimits = {
  1: 1, // Single: only 1 bed
  2: 2, // Double: up to 2 beds
  3: 3, // Triplet: up to 3 beds
  4: 4, // Quadrille: up to 4 beds
  5: 5,
  6: 6
};

export const roomTypes = [
  { label: 'AC', value: 'ac' },
  { label: 'Non AC', value: 'non ac' },
];

export const washroomType = [
  { label: 'Attached', value: 'attached' },
  { label: 'Common', value: 'common' },
];

export const maintenanceStatuses = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Not Required', value: 'not required' },
];

export const occupancyTypeOption = [
  { label: 'Regular', value: 'regular' },
  { label: 'Temporary', value: 'temporary' },
  { label: 'Guest Rooms', value: 'guest' },
];
