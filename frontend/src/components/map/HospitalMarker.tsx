import { Plus } from 'lucide-react'
import type { Hospital, MapPosition } from '../../types/domain'
import { availabilityDotClasses } from '../../utils/availability'
import { cn } from '../../utils/cn'

interface HospitalMarkerProps {
  hospital: Hospital
  position: MapPosition
  selected: boolean
  onSelect: () => void
}

export function HospitalMarker({
  hospital,
  position,
  selected,
  onSelect,
}: HospitalMarkerProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${hospital.name}, ${hospital.availableBeds} beds free, ${hospital.distanceKm.toFixed(1)} km away`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      className={cn(
        'group absolute flex -translate-x-1/2 -translate-y-full flex-col items-center transition-transform active:scale-95',
        selected ? 'z-20' : 'z-10',
      )}
    >
      <span
        className={cn(
          'flex size-9 items-center justify-center rounded-full border-[3px] border-white text-white shadow-md transition-all group-hover:scale-105',
          availabilityDotClasses[hospital.availability],
          selected ? 'scale-110 ring-4 ring-brand-blue/30' : 'ring-1 ring-black/5',
        )}
      >
        <Plus className="size-4" strokeWidth={3} aria-hidden="true" />
      </span>
      <span
        className={cn(
          'mt-1 max-w-[76px] truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold shadow-sm transition-colors',
          selected ? 'bg-brand-blue text-white' : 'bg-white/95 text-brand-navy',
        )}
      >
        {hospital.shortName}
      </span>
    </button>
  )
}
