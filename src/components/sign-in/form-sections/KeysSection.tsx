import { Switch } from '../../ui/Switch';
import { KeySelector } from './KeySelector';

interface KeysSectionProps {
  keysRequired: boolean;
  selectedKeys: string[];
  otherKeyLabel: string;
  idProvided: boolean;
  onFormChange: (field: string, value: any) => void;
  onKeyToggle: (keyLabel: string) => void;
}

export function KeysSection({
  keysRequired,
  selectedKeys,
  otherKeyLabel,
  idProvided,
  onFormChange,
  onKeyToggle
}: KeysSectionProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between">
        <label className="font-medium text-slate-800">Keys Required?</label>
        <Switch
          checked={keysRequired}
          onChange={(checked) => {
            onFormChange('keysRequired', checked);
            if (!checked) {
              onFormChange('selectedKeys', []);
              onFormChange('otherKeyLabel', '');
            }
          }}
        />
      </div>
      {keysRequired && (
        <div className="space-y-4">
          <KeySelector
            selectedKeys={selectedKeys}
            otherKeyLabel={otherKeyLabel}
            onToggle={onKeyToggle}
            onOtherKeyChange={(value) => onFormChange('otherKeyLabel', value)}
          />
          <div className="flex items-center justify-between rounded-lg border border-slate-300 bg-slate-100 p-3">
            <span className="text-sm font-medium text-slate-700">ID Provided?</span>
            <Switch
              checked={idProvided}
              onChange={(checked) => onFormChange('idProvided', checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
