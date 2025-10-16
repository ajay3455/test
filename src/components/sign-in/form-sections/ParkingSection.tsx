import { Switch } from '../../ui/Switch';
import { VehiclePlateManager } from './VehiclePlateManager';
import { ParkingDurationSelector } from './ParkingDurationSelector';

interface ParkingSectionProps {
  needsParking: boolean;
  justParking: boolean;
  parkingDurationMinutes: number | null;
  vehiclesSignedIn: string[];
  knownPlates: string[];
  onFormChange: (field: string, value: any) => void;
}

export function ParkingSection({
  needsParking,
  justParking,
  parkingDurationMinutes,
  vehiclesSignedIn,
  knownPlates,
  onFormChange
}: ParkingSectionProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between">
        <label className="font-medium text-slate-800">Parking Needed?</label>
        <Switch
          checked={needsParking}
          onChange={(checked) => {
            onFormChange('needsParking', checked);
            if (!checked) {
              onFormChange('justParking', false);
              onFormChange('parkingDurationMinutes', null);
            }
          }}
        />
      </div>
      {needsParking && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Just Parking mode</span>
            <Switch
              checked={justParking}
              onChange={(checked) => {
                onFormChange('justParking', checked);
                if (checked) {
                  onFormChange('keysRequired', false);
                } else {
                  onFormChange('parkingDurationMinutes', null);
                }
              }}
            />
          </div>
          <VehiclePlateManager
            vehiclesSignedIn={vehiclesSignedIn}
            knownPlates={knownPlates}
            onUpdate={(plates) => onFormChange('vehiclesSignedIn', plates)}
          />
          {(justParking || parkingDurationMinutes) && (
            <ParkingDurationSelector
              duration={parkingDurationMinutes}
              justParking={justParking}
              onSelect={(value) => onFormChange('parkingDurationMinutes', value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
