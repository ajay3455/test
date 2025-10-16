import { Label } from '../../ui/Label';
import { Textarea } from '../../ui/Textarea';
import { QUICK_PURPOSE_TEMPLATES } from '../../../utils/constants';

interface PurposeOfVisitSectionProps {
  purposeOfVisit: string;
  onFormChange: (field: string, value: any) => void;
}

export function PurposeOfVisitSection({
  purposeOfVisit,
  onFormChange
}: PurposeOfVisitSectionProps) {
  const handleQuickPurposeClick = (template: string) => {
    const isJustParking = template.toLowerCase() === 'just parking';
    onFormChange('purposeOfVisit', purposeOfVisit ? `${purposeOfVisit}\n${template}` : template);
    if (isJustParking) {
      onFormChange('justParking', true);
      onFormChange('needsParking', true);
      onFormChange('keysRequired', false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label>Purpose of Visit *</Label>
        <div className="flex flex-wrap gap-2">
          {QUICK_PURPOSE_TEMPLATES.map((template) => (
            <button
              type="button"
              key={template}
              onClick={() => handleQuickPurposeClick(template)}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:border-brand hover:bg-brand/10"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
      <Textarea
        required
        rows={3}
        placeholder="Describe the contractor's objective..."
        value={purposeOfVisit}
        onChange={(event) => onFormChange('purposeOfVisit', event.target.value)}
      />
    </div>
  );
}
