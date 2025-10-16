import { Label } from '../../ui/Label';
import { Input } from '../../ui/Input';
import type { PreAuthorizedContractor } from '../../../types';

interface BasicInfoSectionProps {
  name: string;
  company: string;
  contactNumber: string;
  suggestions: PreAuthorizedContractor[];
  onFormChange: (field: string, value: string | null) => void;
  onSuggestionSelect: (contractor: PreAuthorizedContractor) => void;
  onDeselect: () => void;
}

export function BasicInfoSection({
  name,
  company,
  contactNumber,
  suggestions,
  onFormChange,
  onSuggestionSelect,
  onDeselect
}: BasicInfoSectionProps) {
  return (
    <>
      <div className="space-y-3">
        <Label>Full Name *</Label>
        <Input
          required
          placeholder="Jane Contractor"
          value={name}
          onChange={(event) => {
            onFormChange('name', event.target.value);
            onDeselect();
          }}
        />
        {suggestions.length > 0 && (
          <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Pre-authorized matches
            </p>
            <ul className="space-y-1">
              {suggestions.map((contractor) => (
                <li key={contractor.id}>
                  <button
                    type="button"
                    onClick={() => onSuggestionSelect(contractor)}
                    className="flex w-full flex-col rounded-lg border border-transparent px-3 py-2 text-left text-sm hover:border-brand hover:bg-brand/10"
                  >
                    <span className="font-medium text-slate-800">{contractor.name}</span>
                    <span className="text-xs text-slate-500">{contractor.company}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <Label>Company *</Label>
        <Input
          required
          placeholder="Northwind Mechanical"
          value={company}
          onChange={(event) => {
            onFormChange('company', event.target.value);
            onDeselect();
          }}
        />
      </div>
      <div className="space-y-3">
        <Label>Contact Number</Label>
        <Input
          placeholder="(555) 123-4567"
          value={contactNumber}
          onChange={(event) => onFormChange('contactNumber', event.target.value)}
        />
      </div>
    </>
  );
}
