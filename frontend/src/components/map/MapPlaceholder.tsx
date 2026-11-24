import { ArrowRight, BedDouble, Info, LocateFixed, MapPin, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AvailabilityStatus, Hospital } from '../../types/domain'
import {
  availabilityDotClasses,
  availabilityMeta,
} from '../../utils/availability'
import { cn } from '../../utils/cn'
import { AvailabilityBadge } from '../ui/AvailabilityBadge'
import { HospitalMarker } from './HospitalMarker'

const MIN_ZOOM = 1
const MAX_ZOOM = 1.3
const ZOOM_STEP = 0.15
const legendStatuses: AvailabilityStatus[] = ['available', 'limited', 'full']

interface MapPlaceholderProps {
  hospitals: Hospital[]
  locationLabel: string
  initialSelectedId?: string | null
}

export function MapPlaceholder({
  hospitals,
  locationLabel,
  initialSelectedId = null,
}: MapPlaceholderProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId)

  const markers = hospitals.flatMap((hospital) =>
    hospital.mapPosition ? [{ hospital, position: hospital.mapPosition }] : [],
  )
  const selected = markers.find(({ hospital }) => hospital.id === selectedId)?.hospital ?? null

  const zoomIn = () =>
    setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2))))
  const zoomOut = () =>
    setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2))))

  const recenter = () => {
    setZoom(MIN_ZOOM)
    setSelectedId(null)
  }

  return (
    <div
      role="region"
      aria-label={`Simulated hospital map for ${locationLabel}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setSelectedId(null)
      }}
      className="relative isolate h-[clamp(320px,48vh,430px)] w-full overflow-hidden rounded-3xl border border-brand-line bg-[#e8efea] shadow-sm lg:h-[520px]"
    >
      <div
        className="absolute inset-0 origin-center transition-transform duration-200 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="map-grid absolute inset-0" />

          <div className="absolute -left-10 top-[6%] h-40 w-44 rounded-[40%] bg-[#d9e8d4]" />
          <div className="absolute right-[4%] bottom-[4%] h-28 w-40 rounded-[42%] bg-[#d9e8d4]" />
          <div className="absolute top-[58%] left-[48%] h-12 w-16 rounded-lg bg-[#dfe7e2]" />
          <div className="absolute top-[12%] left-[58%] h-10 w-12 rounded-md bg-[#dfe7e2]" />
          <div className="absolute bottom-[10%] left-[12%] h-11 w-20 rounded-md bg-[#dfe7e2]" />

          <div className="absolute inset-x-[-25%] top-[32%] h-8 -rotate-6 border-y-2 border-[#d5dfda] bg-white" />
          <div className="absolute inset-x-[-25%] top-[35%] h-px -rotate-6 bg-[#e6ece8]" />
          <div className="absolute inset-y-[-25%] left-[36%] w-7 rotate-6 border-x-2 border-[#d5dfda] bg-white" />
          <div className="absolute inset-y-[-25%] left-[55%] w-5 -rotate-12 border-x border-[#dbe3df] bg-white/90" />
          <div className="absolute inset-x-[-25%] top-[68%] h-6 rotate-2 border-y border-[#e3dbc0] bg-[#fdf9ea]" />

          <span className="absolute top-[20%] left-[8%] text-[10px] font-semibold tracking-[0.14em] text-[#8a9c93] uppercase">
            Road No. 36
          </span>
          <span className="absolute top-[62%] right-[8%] text-[10px] font-semibold tracking-[0.14em] text-[#8a9c93] uppercase">
            Jubilee Hills
          </span>
          <span className="absolute bottom-[14%] left-[40%] text-[10px] font-semibold tracking-[0.14em] text-[#8a9c93] uppercase">
            Banjara Hills
          </span>
        </div>

        {markers.map(({ hospital, position }) => (
          <HospitalMarker
            key={hospital.id}
            hospital={hospital}
            position={position}
            selected={hospital.id === selectedId}
            onSelect={() =>
              setSelectedId((current) => (current === hospital.id ? null : hospital.id))
            }
          />
        ))}
      </div>

      <div className="absolute top-3 left-3 max-w-[60%] rounded-xl bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-navy">
          <Info className="size-3.5 text-brand-blue" aria-hidden="true" />
          Simulated map
        </p>
        <p className="mt-0.5 truncate text-[10px] text-brand-navy-soft">{locationLabel}</p>
      </div>

      <div className="absolute top-3 right-3 z-20 flex flex-col overflow-hidden rounded-xl border border-brand-line bg-white shadow-md">
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
          className="flex size-9 items-center justify-center text-brand-navy-soft transition-colors hover:bg-brand-surface hover:text-brand-navy active:bg-brand-blue-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <span className="h-px bg-brand-line" aria-hidden="true" />
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
          className="flex size-9 items-center justify-center text-brand-navy-soft transition-colors hover:bg-brand-surface hover:text-brand-navy active:bg-brand-blue-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="h-px bg-brand-line" aria-hidden="true" />
        <button
          type="button"
          onClick={recenter}
          aria-label="Recenter map"
          className="flex size-9 items-center justify-center text-brand-blue transition-colors hover:bg-brand-surface active:bg-brand-blue-soft"
        >
          <LocateFixed className="size-4" aria-hidden="true" />
        </button>
      </div>

      {markers.length === 0 ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <p className="rounded-xl bg-white/95 px-4 py-3 text-xs font-medium text-brand-navy-soft shadow-sm ring-1 ring-black/5">
            No simulated hospitals in this area yet.
          </p>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {selected
          ? `${selected.name} selected. ${selected.availableBeds} beds free, ${selected.distanceKm.toFixed(1)} kilometers away.`
          : ''}
      </p>

      {selected ? (
        <div
          role="group"
          aria-label={`${selected.name} preview`}
          className="absolute inset-x-3 bottom-3 z-20 rounded-2xl border border-brand-line bg-white p-3.5 shadow-lg sm:right-auto sm:w-[380px]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-navy">{selected.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-brand-navy-soft">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{selected.area}</span>
                <span aria-hidden="true">·</span>
                <span className="shrink-0">{selected.distanceKm.toFixed(1)} km</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Close hospital preview"
              className="-mt-1 -mr-1 shrink-0 rounded-full p-1.5 text-brand-navy-soft transition-colors hover:bg-brand-surface hover:text-brand-navy"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <AvailabilityBadge status={selected.availability} />
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-navy-soft">
              <BedDouble className="size-3.5" aria-hidden="true" />
              {selected.availableBeds} of {selected.totalBeds} beds free
            </span>
          </div>

          <Link
            to={`/hospitals/${selected.id}`}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-blue text-xs font-semibold text-white transition-colors hover:bg-brand-blue-dark active:bg-brand-blue-dark/90"
          >
            View details
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 z-20 rounded-xl bg-white/95 px-3 py-2 shadow-sm ring-1 ring-black/5">
          <p className="text-[10px] font-semibold tracking-wide text-brand-navy-soft/70 uppercase">
            Bed availability
          </p>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {legendStatuses.map((status) => (
              <li
                key={status}
                className="flex items-center gap-1 text-[10px] font-medium text-brand-navy-soft"
              >
                <span
                  className={cn('size-1.5 rounded-full', availabilityDotClasses[status])}
                  aria-hidden="true"
                />
                {availabilityMeta[status].shortLabel}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="sr-only">
        Select a hospital marker to preview availability. Press Escape to clear the selection,
        or use the recenter control to reset the map.
      </p>
    </div>
  )
}
