import type { AdminCatalogSnapshot, DemoPatientAccount } from '../types/admin'
import type {
  AvailabilityStatus,
  FacilityKey,
  Hospital,
  Specialist,
  SpecialistAvailabilityDay,
} from '../types/domain'
import type { InsuranceProvider } from '../types/insurance'
import { createDemoActivityEntries, demoInsuranceProviders, demoPatientAccounts } from './adminData'
import { addDaysISO, differenceInCalendarDays, formatRelativeDate, formatTimeSlot, getTodayISO } from './dateTime'
import { demoSpecialists } from './demoDoctors'
import { demoHospitals } from './demoData'

export const AVAILABILITY_SLOT_OPTIONS = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:30',
  '14:00',
  '15:00',
  '15:30',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
] as const

export const availabilityStatuses: AvailabilityStatus[] = ['available', 'limited', 'full']

export const facilityOptions: FacilityKey[] = [
  'icu',
  'ambulance',
  'diagnostics',
  'pharmacy',
  'bloodBank',
]

const newDoctorPatterns: string[][] = [
  ['09:00', '10:30', '12:00', '15:00', '17:30'],
  ['08:30', '11:00', '14:00', '16:30'],
  [],
  ['10:00', '12:30', '15:30', '18:00'],
  ['09:30', '11:30', '13:30', '17:00'],
]

export const MAX_AVAILABILITY_DAYS = 5

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/^dr\.?\s+/, 'dr-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createEntityId(name: string, fallbackPrefix: string): string {
  const base = slugify(name).slice(0, 34) || fallbackPrefix
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${base}-${suffix}`
}

export function createDefaultAvailability(
  startISO = getTodayISO(),
): SpecialistAvailabilityDay[] {
  return newDoctorPatterns.map((slots, index) => ({
    date: addDaysISO(startISO, index),
    slots: [...slots],
  }))
}

export function clampBeds(
  totalBeds: number,
  availableBeds: number,
): { totalBeds: number; availableBeds: number } {
  const safeTotal = Math.max(
    0,
    Math.trunc(Number.isFinite(totalBeds) ? totalBeds : 0),
  )
  const safeAvailable = Math.min(
    safeTotal,
    Math.max(0, Math.trunc(Number.isFinite(availableBeds) ? availableBeds : 0)),
  )

  return { totalBeds: safeTotal, availableBeds: safeAvailable }
}

function sanitizeSlots(slots: string[]): string[] {
  return [...new Set(slots)]
    .filter((slot) => /^\d{2}:\d{2}$/.test(slot))
    .sort()
}

function freshenAvailability(
  availability: SpecialistAvailabilityDay[],
): SpecialistAvailabilityDay[] {
  const today = getTodayISO()
  const days = [...availability]
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({ date: day.date, slots: sanitizeSlots(day.slots) }))
    .slice(0, MAX_AVAILABILITY_DAYS)

  if (days.length > 0) {
    const shift = differenceInCalendarDays(days[0].date, today)

    if (shift > 0) {
      for (const day of days) {
        day.date = addDaysISO(day.date, shift)
      }
    }

    while (days.length < MAX_AVAILABILITY_DAYS) {
      const last = days[days.length - 1]
      days.push({ date: addDaysISO(last.date, 1), slots: [] })
    }
  }

  if (days.length === 0) {
    for (let index = 0; index < MAX_AVAILABILITY_DAYS; index += 1) {
      days.push({ date: addDaysISO(today, index), slots: [] })
    }
  }

  return days
}

function getNextAvailableLabel(availability: SpecialistAvailabilityDay[]): string {
  const firstDay = availability.find((day) => day.slots.length > 0)
  if (!firstDay) return 'No demo slots in the next 5 days'

  return `${formatRelativeDate(firstDay.date)} · ${formatTimeSlot(firstDay.slots[0])}`
}

export function syncSpecialistsWithHospitals(
  specialists: Specialist[],
  hospitals: Hospital[],
): Specialist[] {
  return specialists.map((specialist) => {
    const hospitalIds = specialist.hospitalIds.filter((hospitalId) =>
      hospitals.some((hospital) => hospital.id === hospitalId),
    )
    const primary =
      hospitals.find((hospital) => hospital.id === hospitalIds[0]) ?? null
    const availability = freshenAvailability(specialist.availability)

    return {
      ...specialist,
      hospitalIds,
      hospital: primary?.name ?? 'No demo hospital',
      area: primary?.area ?? 'Unassigned',
      distanceKm: primary?.distanceKm ?? 0,
      availability,
      availableToday: availability[0]?.slots.length > 0,
      nextAvailable: getNextAvailableLabel(availability),
      active: hospitalIds.length === 0 ? false : specialist.active,
    }
  })
}

export function normalizeInsuranceProviders(
  providers: InsuranceProvider[],
  hospitals: Hospital[],
): InsuranceProvider[] {
  const hospitalIds = new Set(hospitals.map((hospital) => hospital.id))

  return providers.map((provider) => ({
    ...provider,
    coverage: [...new Set(provider.coverage)],
    rules: provider.rules ?? {},
    hospitalIds: provider.hospitalIds.filter((id) => hospitalIds.has(id)),
  }))
}

export function normalizePatientAccounts(
  accounts: DemoPatientAccount[],
  providers: InsuranceProvider[],
): DemoPatientAccount[] {
  const providerIds = new Set(providers.map((provider) => provider.id))

  return accounts.map((account) => ({
    ...account,
    members: account.members.map((member) => ({
      ...member,
      insuranceProviderId:
        member.insuranceProviderId && providerIds.has(member.insuranceProviderId)
          ? member.insuranceProviderId
          : null,
    })),
  }))
}

export function normalizeCatalogSnapshot(
  snapshot: AdminCatalogSnapshot,
): AdminCatalogSnapshot {
  const hospitals = snapshot.hospitals.map((hospital) => {
    const beds = clampBeds(hospital.totalBeds, hospital.availableBeds)
    return {
      ...hospital,
      ...beds,
      coordinates:
        hospital.coordinates ??
        demoHospitals.find((demoHospital) => demoHospital.id === hospital.id)?.coordinates,
      facilities: facilityOptions.filter((facility) =>
        hospital.facilities.includes(facility),
      ),
      specialties: [...new Set(hospital.specialties.filter(Boolean))],
    }
  })

  const doctors = syncSpecialistsWithHospitals(snapshot.specialists, hospitals)
  const insuranceProviders = normalizeInsuranceProviders(
    snapshot.insuranceProviders,
    hospitals,
  )
  const patientAccounts = normalizePatientAccounts(
    snapshot.patientAccounts,
    insuranceProviders,
  )

  return {
    version: 1,
    hospitals,
    specialists: doctors,
    insuranceProviders,
    patientAccounts,
    activity: snapshot.activity,
  }
}

function cloneHospitals(): Hospital[] {
  return demoHospitals.map((hospital) => ({
    ...hospital,
    facilities: [...hospital.facilities],
    specialties: [...hospital.specialties],
    mapPosition: hospital.mapPosition ? { ...hospital.mapPosition } : undefined,
    coordinates: hospital.coordinates ? { ...hospital.coordinates } : undefined,
  }))
}

function cloneSpecialists(): Specialist[] {
  return demoSpecialists.map((specialist) => ({
    ...specialist,
    qualifications: [...specialist.qualifications],
    languages: [...specialist.languages],
    consultationTypes: [...specialist.consultationTypes],
    hospitalIds: [...specialist.hospitalIds],
    availability: specialist.availability.map((day) => ({
      date: day.date,
      slots: [...day.slots],
    })),
  }))
}

function cloneInsuranceProviders(): InsuranceProvider[] {
  return demoInsuranceProviders.map((provider) => ({
    ...provider,
    coverage: [...provider.coverage],
    rules: Object.fromEntries(
      Object.entries(provider.rules).map(([category, rule]) => [
        category,
        { ...rule },
      ]),
    ) as InsuranceProvider['rules'],
    hospitalIds: [...provider.hospitalIds],
  }))
}

function clonePatientAccounts(): DemoPatientAccount[] {
  return demoPatientAccounts.map((account) => ({
    ...account,
    members: account.members.map((member) => ({ ...member })),
  }))
}

/** Fresh defaults sourced from the existing Prompt 1–6 demo data. */
export function createInitialCatalogSnapshot(): AdminCatalogSnapshot {
  return normalizeCatalogSnapshot({
    version: 1,
    hospitals: cloneHospitals(),
    specialists: cloneSpecialists(),
    insuranceProviders: cloneInsuranceProviders(),
    patientAccounts: clonePatientAccounts(),
    activity: createDemoActivityEntries(),
  })
}
