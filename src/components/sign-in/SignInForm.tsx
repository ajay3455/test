import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useGuardProfile } from '../../context/GuardProfileContext';
import { supabase } from '../../lib/supabaseClient';
import type { PreAuthorizedContractor } from '../../types';
import {
  AVAILABLE_KEYS,
  PARKING_DURATION_OPTIONS,
  QUICK_PURPOSE_TEMPLATES
} from '../../utils/constants';

const DRAFT_KEY = 'security-hub-mini:sign-in-draft';

type FormState = {
  name: string;
  company: string;
  contactNumber: string;
  purposeOfVisit: string;
  needsParking: boolean;
  justParking: boolean;
  parkingDurationMinutes: number | null;
  licenseInput: string;
  vehiclesSignedIn: string[];
  keysRequired: boolean;
  selectedKeys: string[];
  otherKeyLabel: string;
  idProvided: boolean;
  additionalNotes: string;
  preAuthorizedId: string | null;
};

const emptyForm: FormState = {
  name: '',
  company: '',
  contactNumber: '',
  purposeOfVisit: '',
  needsParking: false,
  justParking: false,
  parkingDurationMinutes: null,
  licenseInput: '',
  vehiclesSignedIn: [],
  keysRequired: false,
  selectedKeys: [],
  otherKeyLabel: '',
  idProvided: true,
  additionalNotes: '',
  preAuthorizedId: null
};

function sanitizeSearchTerm(value: string) {
  return value.replace(/[%_]/g, '').trim();
}

export function SignInForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { profile } = useGuardProfile();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [draftRestored, setDraftRestored] = useState(false);
  const [suggestions, setSuggestions] = useState<PreAuthorizedContractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<PreAuthorizedContractor | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(DRAFT_KEY);
      if (stored) {
        setForm({ ...emptyForm, ...JSON.parse(stored) });
        setDraftRestored(true);
      }
    } catch (error) {
      console.error('Failed to restore draft', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch (error) {
      console.error('Failed to persist draft', error);
    }
  }, [form]);

  useEffect(() => {
    const searchTerm = sanitizeSearchTerm(form.name || form.company);
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const handler = window.setTimeout(async () => {
      const { data, error } = await supabase
        .from('pre_authorized_contractors')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
        .limit(6);

      if (error) {
        console.error('Failed to fetch suggestions', error);
        return;
      }

      setSuggestions(data ?? []);
    }, 260);

    return () => window.clearTimeout(handler);
  }, [form.name, form.company]);

  const knownPlates = useMemo(() => selectedContractor?.known_license_plates ?? [], [selectedContractor]);

  const handleClearForm = () => {
    setForm(emptyForm);
    setSelectedContractor(null);
    setDraftRestored(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  };

  const handleAddVehiclePlate = () => {
    const value = form.licenseInput.trim().toUpperCase();
    if (!value) return;
    if (form.vehiclesSignedIn.includes(value)) {
      toast.error('License plate already added');
      return;
    }
    setForm((previous) => ({
      ...previous,
      vehiclesSignedIn: [...previous.vehiclesSignedIn, value],
      licenseInput: ''
    }));
  };

  const handleRemovePlate = (plate: string) => {
    setForm((previous) => ({
      ...previous,
      vehiclesSignedIn: previous.vehiclesSignedIn.filter((item) => item !== plate)
    }));
  };

  const handleKeyToggle = (keyLabel: string) => {
    setForm((previous) => {
      const isSelected = previous.selectedKeys.includes(keyLabel);
      const nextSelected = isSelected
        ? previous.selectedKeys.filter((item) => item !== keyLabel)
        : [...previous.selectedKeys, keyLabel];

      return {
        ...previous,
        selectedKeys: nextSelected,
        otherKeyLabel:
          keyLabel === 'Other' && !isSelected ? previous.otherKeyLabel : keyLabel === 'Other' ? '' : previous.otherKeyLabel
      };
    });
  };

  const handleSuggestionSelect = (contractor: PreAuthorizedContractor) => {
    setSelectedContractor(contractor);
    setSuggestions([]);
    setForm((previous) => ({
      ...previous,
      name: contractor.name ?? previous.name,
      company: contractor.company ?? previous.company,
      contactNumber: contractor.contact_number ?? previous.contactNumber,
      preAuthorizedId: contractor.id
    }));
  };

  const quickPurposeButtons = QUICK_PURPOSE_TEMPLATES.map((template) => (
    <button
      type="button"
      key={template}
      onClick={() => {
        setForm((previous) => {
          const isJustParking = template.toLowerCase() === 'just parking';
          return {
            ...previous,
            purposeOfVisit:
              previous.purposeOfVisit.trim().length === 0
                ? template
                : `${previous.purposeOfVisit}\n${template}`,
            justParking: isJustParking ? true : previous.justParking,
            needsParking: isJustParking ? true : previous.needsParking,
            keysRequired: isJustParking ? false : previous.keysRequired
          };
        });
      }}
      className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 transition hover:border-brand-light hover:bg-brand-light/10"
    >
      {template}
    </button>
  ));

  const submitDisabled = !form.name || !form.company || !form.purposeOfVisit;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitDisabled) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (form.justParking && !form.parkingDurationMinutes) {
      toast.error('Parking duration is required for Just Parking entries.');
      return;
    }

    if (form.keysRequired && form.selectedKeys.length === 0) {
      toast.error('Select at least one key.');
      return;
    }

    if (form.selectedKeys.includes('Other') && !form.otherKeyLabel.trim()) {
      toast.error('Provide a label for the other key.');
      return;
    }

    setIsLoading(true);

    const keys = form.keysRequired
      ? form.selectedKeys.map((item) => (item === 'Other' ? form.otherKeyLabel.trim() : item))
      : null;

    const payload = {
      pre_authorized_contractor_id: form.preAuthorizedId,
      name: form.name.trim(),
      company: form.company.trim(),
      contact_number: form.contactNumber.trim() || null,
      purpose_of_visit: form.purposeOfVisit.trim(),
      needs_parking: form.needsParking,
      vehicles_signed_in: form.vehiclesSignedIn.length ? form.vehiclesSignedIn : null,
      keys,
      id_provided: form.keysRequired ? form.idProvided : null,
      contractor_notes: form.additionalNotes.trim() || null,
      is_signed_out: false,
      approval_status: profile.autoApprove && profile.name ? 'approved' : 'pending',
      approved_by_name: profile.autoApprove && profile.name ? profile.name : null,
      created_by_user_name: profile.name || null,
      created_by_user_id: null,
      parking_duration_minutes: form.justParking ? form.parkingDurationMinutes : form.needsParking ? form.parkingDurationMinutes : null,
      work_status: null,
      work_details: null,
      keys_not_returned_reason: null,
      general_comments: []
    };

    const { error } = await supabase.from('contractor_sign_ins').insert(payload);

    setIsLoading(false);

    if (error) {
      toast.error(`Sign-in failed: ${error.message}`);
      return;
    }

    toast.success('Contractor signed in successfully.');
    handleClearForm();
    onSubmitted();
  };

  return (
    <section className="h-max rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-soft">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Contractor Sign-In</h2>
          <p className="text-sm text-slate-400">
            Capture all the required contractor details quickly with smart suggestions.
          </p>
        </div>
        {draftRestored && (
          <button
            type="button"
            onClick={handleClearForm}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-300 hover:border-brand-light hover:text-white"
          >
            Clear draft
          </button>
        )}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-200">Full Name *</label>
          <input
            required
            placeholder="Jane Contractor"
            value={form.name}
            onChange={(event) => {
              const value = event.target.value;
              setForm((previous) => ({ ...previous, name: value, preAuthorizedId: null }));
              setSelectedContractor(null);
            }}
          />
          {suggestions.length > 0 && (
            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900 p-2">
              <p className="text-xs uppercase tracking-wider text-slate-500">Pre-authorized matches</p>
              <ul className="space-y-1">
                {suggestions.map((contractor) => (
                  <li key={contractor.id}>
                    <button
                      type="button"
                      onClick={() => handleSuggestionSelect(contractor)}
                      className="flex w-full flex-col rounded-lg border border-transparent px-3 py-2 text-left text-sm hover:border-brand-light hover:bg-brand-light/10"
                    >
                      <span className="font-medium text-slate-100">{contractor.name}</span>
                      <span className="text-xs text-slate-400">{contractor.company}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-200">Company *</label>
          <input
            required
            placeholder="Northwind Mechanical"
            value={form.company}
            onChange={(event) => {
              const value = event.target.value;
              setForm((previous) => ({ ...previous, company: value, preAuthorizedId: null }));
              setSelectedContractor(null);
            }}
          />
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-200">Contact Number</label>
          <input
            placeholder="(555) 123-4567"
            value={form.contactNumber}
            onChange={(event) => setForm((previous) => ({ ...previous, contactNumber: event.target.value }))}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-200">Purpose of Visit *</label>
            <div className="flex flex-wrap gap-2">{quickPurposeButtons}</div>
          </div>
          <textarea
            required
            rows={3}
            placeholder="Describe the contractor's objective..."
            value={form.purposeOfVisit}
            onChange={(event) => setForm((previous) => ({ ...previous, purposeOfVisit: event.target.value }))}
          />
        </div>
        <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <label className="font-medium text-slate-200">Parking Needed?</label>
            <button
              type="button"
              onClick={() =>
                setForm((previous) => ({
                  ...previous,
                  needsParking: !previous.needsParking,
                  justParking: !previous.needsParking ? previous.justParking : false,
                  parkingDurationMinutes: !previous.needsParking ? previous.parkingDurationMinutes : null
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                form.needsParking ? 'border-brand-light bg-brand-light/80' : 'border-slate-700 bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  form.needsParking ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {form.needsParking && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Just Parking mode</span>
                <button
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      justParking: !previous.justParking,
                      keysRequired: previous.justParking ? previous.keysRequired : false,
                      parkingDurationMinutes: previous.justParking ? previous.parkingDurationMinutes : null
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                    form.justParking ? 'border-brand-light bg-brand-light/80' : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      form.justParking ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-500">Vehicle License Plate(s)</label>
                <div className="flex gap-2">
                  <input
                    value={form.licenseInput}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, licenseInput: event.target.value }))
                    }
                    placeholder="ABC-1234"
                    className="flex-1 uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleAddVehiclePlate}
                    className="rounded-lg bg-brand-light px-3 py-2 text-sm font-semibold text-white hover:bg-brand"
                  >
                    Add
                  </button>
                </div>
                {form.vehiclesSignedIn.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.vehiclesSignedIn.map((plate) => (
                      <span
                        key={plate}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs uppercase text-slate-200"
                      >
                        {plate}
                        <button className="text-slate-400" type="button" onClick={() => handleRemovePlate(plate)}>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {knownPlates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Known plates</p>
                    <div className="flex flex-wrap gap-2">
                      {knownPlates.map((plate) => (
                        <button
                          key={plate}
                          type="button"
                          onClick={() =>
                            setForm((previous) => ({
                              ...previous,
                              vehiclesSignedIn: previous.vehiclesSignedIn.includes(plate)
                                ? previous.vehiclesSignedIn
                                : [...previous.vehiclesSignedIn, plate]
                            }))
                          }
                          className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase text-slate-200 hover:border-brand-light"
                        >
                          {plate}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {(form.justParking || form.parkingDurationMinutes) && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500">
                    Parking Duration {form.justParking && '*'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PARKING_DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({ ...previous, parkingDurationMinutes: option.value }))
                        }
                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                          form.parkingDurationMinutes === option.value
                            ? 'border-brand-light bg-brand-light/20 text-brand-muted'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-brand-light'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!form.justParking && (
          <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
              <label className="font-medium text-slate-200">Keys Required?</label>
              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    keysRequired: !previous.keysRequired,
                    selectedKeys: !previous.keysRequired ? previous.selectedKeys : [],
                    otherKeyLabel: !previous.keysRequired ? previous.otherKeyLabel : ''
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                  form.keysRequired ? 'border-brand-light bg-brand-light/80' : 'border-slate-700 bg-slate-800'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    form.keysRequired ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {form.keysRequired && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_KEYS.map((keyLabel) => {
                    const isSelected = form.selectedKeys.includes(keyLabel);
                    return (
                      <button
                        key={keyLabel}
                        type="button"
                        onClick={() => handleKeyToggle(keyLabel)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          isSelected
                            ? 'border-brand-light bg-brand-light/20 text-brand-muted'
                            : 'border-slate-700 text-slate-200 hover:border-brand-light'
                        }`}
                      >
                        {keyLabel}
                      </button>
                    );
                  })}
                </div>
                {form.selectedKeys.includes('Other') && (
                  <input
                    placeholder="Enter custom key name"
                    value={form.otherKeyLabel}
                    onChange={(event) =>
                      setForm((previous) => ({ ...previous, otherKeyLabel: event.target.value }))
                    }
                  />
                )}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500">Government ID Provided?</label>
                  <div className="flex gap-2">
                    {[true, false].map((value) => (
                      <button
                        type="button"
                        key={String(value)}
                        onClick={() => setForm((previous) => ({ ...previous, idProvided: value }))}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                          form.idProvided === value
                            ? 'border-brand-light bg-brand-light/20 text-brand-muted'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-brand-light'
                        }`}
                      >
                        {value ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-200">Additional Notes</label>
          <textarea
            rows={3}
            placeholder="Special instructions, escorts required, etc."
            value={form.additionalNotes}
            onChange={(event) => setForm((previous) => ({ ...previous, additionalNotes: event.target.value }))}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || submitDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-light px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isLoading ? 'Submitting...' : 'Sign Contractor In'}
        </button>
      </form>
    </section>
  );
}
