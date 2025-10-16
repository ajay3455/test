// 🌐 SECTION A: Header & Config
// FILE: src/components/sign-in/SignInForm.tsx
// LAST UPDATED: 2025-10-16

// 📝 A1: Imports
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useGuardProfile } from '../../context/GuardProfileContext';
import { supabase } from '../../lib/supabaseClient';
import type { PreAuthorizedContractor } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { BasicInfoSection } from './form-sections/BasicInfoSection';
import { KeysSection } from './form-sections/KeysSection';
import { NotesSection } from './form-sections/NotesSection';
import { ParkingSection } from './form-sections/ParkingSection';
import { PurposeOfVisitSection } from './form-sections/PurposeOfVisitSection';

// 📝 A2: Constants
const DRAFT_KEY = 'security-hub-mini:sign-in-draft';

// ⚙️ SECTION B: Type Definitions
type FormState = {
  name: string;
  company: string;
  contactNumber: string;
  purposeOfVisit: string;
  needsParking: boolean;
  justParking: boolean;
  parkingDurationMinutes: number | null;
  vehiclesSignedIn: string[];
  keysRequired: boolean;
  selectedKeys: string[];
  otherKeyLabel: string;
  idProvided: boolean;
  additionalNotes: string;
  preAuthorizedId: string | null;
};

// ⚙️ SECTION C: Initial State
const emptyForm: FormState = {
  name: '',
  company: '',
  contactNumber: '',
  purposeOfVisit: '',
  needsParking: false,
  justParking: false,
  parkingDurationMinutes: null,
  vehiclesSignedIn: [],
  keysRequired: false,
  selectedKeys: [],
  otherKeyLabel: '',
  idProvided: true,
  additionalNotes: '',
  preAuthorizedId: null
};

// 🛠 SECTION D: Utility Functions
function sanitizeSearchTerm(value: string) {
  return value.replace(/[%_]/g, '').trim();
}

// 🎨 SECTION E: Component Definition
export function SignInForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { profile } = useGuardProfile();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [draftRestored, setDraftRestored] = useState(false);
  const [suggestions, setSuggestions] = useState<PreAuthorizedContractor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<PreAuthorizedContractor | null>(
    null
  );

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

  const knownPlates = useMemo(
    () => selectedContractor?.known_license_plates ?? [],
    [selectedContractor]
  );

  const handleClearForm = () => {
    setForm(emptyForm);
    setSelectedContractor(null);
    setDraftRestored(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setForm((previous) => ({ ...previous, [field]: value }));
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
          keyLabel === 'Other' && !isSelected
            ? previous.otherKeyLabel
            : keyLabel === 'Other'
            ? ''
            : previous.otherKeyLabel
      };
    });
  };

  const submitDisabled = !form.name || !form.company || !form.purposeOfVisit || isLoading;

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
      parking_duration_minutes: form.justParking
        ? form.parkingDurationMinutes
        : form.needsParking
        ? form.parkingDurationMinutes
        : null,
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
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Contractor Sign-In</CardTitle>
            <CardDescription>
              Capture all the required contractor details quickly with smart suggestions.
            </CardDescription>
          </div>
          {draftRestored && (
            <Button variant="ghost" size="sm" onClick={handleClearForm}>
              Clear draft
            </Button>
          )}
        </div>
      </CardHeader>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <BasicInfoSection
          name={form.name}
          company={form.company}
          contactNumber={form.contactNumber}
          suggestions={suggestions}
          onFormChange={handleFormChange}
          onSuggestionSelect={handleSuggestionSelect}
          onDeselect={() => {
            handleFormChange('preAuthorizedId', null);
            setSelectedContractor(null);
          }}
        />
        <PurposeOfVisitSection
          purposeOfVisit={form.purposeOfVisit}
          onFormChange={handleFormChange}
        />
        <ParkingSection
          needsParking={form.needsParking}
          justParking={form.justParking}
          parkingDurationMinutes={form.parkingDurationMinutes}
          vehiclesSignedIn={form.vehiclesSignedIn}
          knownPlates={knownPlates}
          onFormChange={handleFormChange}
        />
        {!form.justParking && (
          <KeysSection
            keysRequired={form.keysRequired}
            selectedKeys={form.selectedKeys}
            otherKeyLabel={form.otherKeyLabel}
            idProvided={form.idProvided}
            onFormChange={handleFormChange}
            onKeyToggle={handleKeyToggle}
          />
        )}
        <NotesSection
          additionalNotes={form.additionalNotes}
          onFormChange={handleFormChange}
        />
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClearForm}>
            Clear
          </Button>
          <Button type="submit" disabled={submitDisabled}>
            {isLoading ? 'Submitting...' : 'Submit Sign-In'}
          </Button>
        </div>
      </form>
    </Card>
  );
}