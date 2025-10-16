import { PARKING_DURATION_OPTIONS } from '../../../utils/constants';

interface ParkingDurationSelectorProps {
  duration: number | null;
  justParking: boolean;
  onSelect: (value: number | null) => void;
}

export function ParkingDurationSelector({
  duration,
  justParking,
  onSelect
}: ParkingDurationSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wider text-slate-500">
        Parking Duration {justParking && '*'}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {PARKING_DURATION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              duration === option.value
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-brand'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
