import { Input } from '../../ui/Input';
import { AVAILABLE_KEYS } from '../../../utils/constants';

interface KeySelectorProps {
  selectedKeys: string[];
  otherKeyLabel: string;
  onToggle: (keyLabel: string) => void;
  onOtherKeyChange: (value: string) => void;
}

export function KeySelector({
  selectedKeys,
  otherKeyLabel,
  onToggle,
  onOtherKeyChange
}: KeySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_KEYS.map((keyLabel) => (
          <button
            key={keyLabel}
            type="button"
            onClick={() => onToggle(keyLabel)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              selectedKeys.includes(keyLabel)
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-brand'
            }`}
          >
            {keyLabel}
          </button>
        ))}
      </div>
      {selectedKeys.includes('Other') && (
        <Input
          placeholder="Specify other key..."
          value={otherKeyLabel}
          onChange={(event) => onOtherKeyChange(event.target.value)}
        />
      )}
    </div>
  );
}
