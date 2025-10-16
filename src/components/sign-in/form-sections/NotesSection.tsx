import { Label } from '../../ui/Label';
import { Textarea } from '../../ui/Textarea';

interface NotesSectionProps {
  additionalNotes: string;
  onFormChange: (field: string, value: string) => void;
}

export function NotesSection({ additionalNotes, onFormChange }: NotesSectionProps) {
  return (
    <div className="space-y-3">
      <Label>Additional Notes</Label>
      <Textarea
        rows={2}
        placeholder="Add any other relevant details..."
        value={additionalNotes}
        onChange={(event) => onFormChange('additionalNotes', event.target.value)}
      />
    </div>
  );
}
