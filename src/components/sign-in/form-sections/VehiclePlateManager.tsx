import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface VehiclePlateManagerProps {
  vehiclesSignedIn: string[];
  knownPlates: string[];
  onUpdate: (plates: string[]) => void;
}

export function VehiclePlateManager({
  vehiclesSignedIn,
  knownPlates,
  onUpdate
}: VehiclePlateManagerProps) {
  const [licenseInput, setLicenseInput] = useState('');

  const handleAddPlate = () => {
    const value = licenseInput.trim().toUpperCase();
    if (!value) return;
    if (vehiclesSignedIn.includes(value)) {
      toast.error('License plate already added');
      return;
    }
    onUpdate([...vehiclesSignedIn, value]);
    setLicenseInput('');
  };

  const handleRemovePlate = (plate: string) => {
    onUpdate(vehiclesSignedIn.filter((item) => item !== plate));
  };

  const handleKnownPlateClick = (plate: string) => {
    if (vehiclesSignedIn.includes(plate)) {
      handleRemovePlate(plate);
    } else {
      onUpdate([...vehiclesSignedIn, plate]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-wider text-slate-500">
          Vehicle License Plate(s)
        </label>
        <div className="flex gap-2">
          <Input
            value={licenseInput}
            onChange={(event) => setLicenseInput(event.target.value)}
            placeholder="ABC-1234"
            className="flex-1 uppercase"
          />
          <Button type="button" onClick={handleAddPlate} variant="secondary" size="md">
            Add
          </Button>
        </div>
        {vehiclesSignedIn.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {vehiclesSignedIn.map((plate) => (
              <span
                key={plate}
                className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-3 py-1 text-xs uppercase text-slate-700"
              >
                {plate}
                <button
                  className="text-slate-500"
                  type="button"
                  onClick={() => handleRemovePlate(plate)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      {knownPlates.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-slate-500">Known plates</p>
          <div className="flex flex-wrap gap-2">
            {knownPlates.map((plate) => (
              <button
                key={plate}
                type="button"
                onClick={() => handleKnownPlateClick(plate)}
                className={`rounded-full border px-3 py-1 text-xs uppercase transition ${
                  vehiclesSignedIn.includes(plate)
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-slate-300 text-slate-600 hover:border-brand'
                }`}
              >
                {plate}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
