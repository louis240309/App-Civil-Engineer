import type { GeoCoordinates, Hospital } from '../types/domain'

export function distanceInKilometers(from: GeoCoordinates, to: GeoCoordinates): number {
  const radians = (degrees: number) => degrees * Math.PI / 180
  const earthRadiusKm = 6371
  const latDelta = radians(to.lat - from.lat)
  const lngDelta = radians(to.lng - from.lng)
  const fromLat = radians(from.lat)
  const toLat = radians(to.lat)
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getHospitalsForCoordinates(
  hospitals: Hospital[],
  coordinates: GeoCoordinates | null,
): Hospital[] {
  if (!coordinates) return hospitals
  return hospitals.map((hospital) => ({
    ...hospital,
    distanceKm: hospital.coordinates
      ? distanceInKilometers(coordinates, hospital.coordinates)
      : hospital.distanceKm,
  }))
}
