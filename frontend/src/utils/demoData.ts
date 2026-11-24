import type { DemoLocation, Hospital } from '../types/domain'

export const demoLocations: DemoLocation[] = [
  { id: 'jubilee-hills', area: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.4309, lng: 78.407 } },
  { id: 'banjara-hills', area: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.4126, lng: 78.4482 } },
  { id: 'gachibowli', area: 'Gachibowli', city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.4401, lng: 78.3489 } },
  { id: 'secunderabad', area: 'Secunderabad', city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.4399, lng: 78.4983 } },
]

export const demoHospitals: Hospital[] = [
  {
    id: 'apollo-jubilee-hills',
    name: 'Apollo Hospitals',
    shortName: 'Apollo',
    type: 'Private',
    area: 'Jubilee Hills',
    address: 'Road No. 72, Jubilee Hills, Hyderabad',
    distanceKm: 1.2,
    availability: 'available',
    availableBeds: 42,
    totalBeds: 300,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    specialties: ['Cardiology', 'Emergency medicine', 'Orthopaedics'],
    mapPosition: { x: 22, y: 56 },
    coordinates: { lat: 17.4313, lng: 78.407 },
  },
  {
    id: 'care-banjara-hills',
    name: 'Care Hospitals',
    shortName: 'Care',
    type: 'Private',
    area: 'Banjara Hills',
    address: 'Road No. 1, Banjara Hills, Hyderabad',
    distanceKm: 2.8,
    availability: 'limited',
    availableBeds: 8,
    totalBeds: 120,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    specialties: ['Cardiology', 'Critical care', 'General medicine'],
    mapPosition: { x: 64, y: 30 },
    coordinates: { lat: 17.4135, lng: 78.4482 },
  },
  {
    id: 'rainbow-banjara-hills',
    name: "Rainbow Children's Hospital",
    shortName: 'Rainbow',
    type: 'Private',
    area: 'Banjara Hills',
    address: 'Road No. 2, Banjara Hills, Hyderabad',
    distanceKm: 3.4,
    availability: 'limited',
    availableBeds: 6,
    totalBeds: 90,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    specialties: ['Paediatrics', 'Neonatology', 'Emergency medicine'],
    mapPosition: { x: 47, y: 46 },
    coordinates: { lat: 17.4149, lng: 78.4497 },
  },
  {
    id: 'osmania-afzal-gunj',
    name: 'Osmania General Hospital',
    shortName: 'Osmania',
    type: 'Government',
    area: 'Afzal Gunj',
    address: 'Afzal Gunj, Hyderabad',
    distanceKm: 6.4,
    availability: 'full',
    availableBeds: 0,
    totalBeds: 400,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    specialties: ['General medicine', 'Trauma', 'Emergency medicine'],
    mapPosition: { x: 77, y: 72 },
    coordinates: { lat: 17.3745, lng: 78.474 },
  },
  {
    id: 'continental-gachibowli',
    name: 'Continental Hospitals',
    shortName: 'Continental',
    type: 'Private',
    area: 'Gachibowli',
    address: 'Nanakramguda Road, Gachibowli, Hyderabad',
    distanceKm: 8.1,
    availability: 'available',
    availableBeds: 18,
    totalBeds: 250,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy'],
    specialties: ['Orthopaedics', 'Neurology', 'Cardiology'],
    mapPosition: { x: 16, y: 40 },
    coordinates: { lat: 17.4167, lng: 78.343 },
  },
  {
    id: 'kims-secunderabad',
    name: 'KIMS Hospitals',
    shortName: 'KIMS',
    type: 'Private',
    area: 'Secunderabad',
    address: 'Minister Road, Secunderabad, Hyderabad',
    distanceKm: 9.3,
    availability: 'available',
    availableBeds: 26,
    totalBeds: 200,
    emergency: true,
    facilities: ['icu', 'ambulance', 'diagnostics', 'pharmacy', 'bloodBank'],
    specialties: ['Neurology', 'Cardiology', 'Emergency medicine'],
    mapPosition: { x: 86, y: 52 },
    coordinates: { lat: 17.439, lng: 78.498 },
  },
]

/**
 * Approximate simulated driving distance (km) from each demo area to each hospital.
 * Areas are not geo-accurate; values only make the demo feel location-aware.
 */
const hospitalDistanceKmByLocation: Record<string, Record<string, number>> = {
  'jubilee-hills': {
    'apollo-jubilee-hills': 1.2,
    'care-banjara-hills': 2.8,
    'rainbow-banjara-hills': 3.4,
    'osmania-afzal-gunj': 6.4,
    'continental-gachibowli': 8.1,
    'kims-secunderabad': 9.3,
  },
  'banjara-hills': {
    'apollo-jubilee-hills': 2.1,
    'care-banjara-hills': 0.9,
    'rainbow-banjara-hills': 1.6,
    'osmania-afzal-gunj': 5.8,
    'continental-gachibowli': 7.2,
    'kims-secunderabad': 8.6,
  },
  gachibowli: {
    'apollo-jubilee-hills': 9.4,
    'care-banjara-hills': 7.8,
    'rainbow-banjara-hills': 8.3,
    'osmania-afzal-gunj': 11.2,
    'continental-gachibowli': 1.1,
    'kims-secunderabad': 10.4,
  },
  secunderabad: {
    'apollo-jubilee-hills': 8.9,
    'care-banjara-hills': 7.4,
    'rainbow-banjara-hills': 8.8,
    'osmania-afzal-gunj': 4.6,
    'continental-gachibowli': 12.3,
    'kims-secunderabad': 3.7,
  },
}

/** Hospitals ordered by simulated distance from the selected demo location. */
export function getHospitalsForLocationFrom(
  hospitals: Hospital[],
  locationId: string,
): Hospital[] {
  const distances = hospitalDistanceKmByLocation[locationId] ?? {}

  return hospitals
    .map((hospital) => ({
      ...hospital,
      distanceKm: distances[hospital.id] ?? hospital.distanceKm,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

export function getHospitalsForLocation(locationId: string): Hospital[] {
  return getHospitalsForLocationFrom(demoHospitals, locationId)
}

