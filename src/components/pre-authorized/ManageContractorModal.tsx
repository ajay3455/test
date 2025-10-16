import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../common/Modal';
import type { PreAuthorizedContractor } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { ProfileImageUploader } from './ProfileImageUploader';

interface ManageContractorModalProps {
  open: boolean;
  contractor: PreAuthorizedContractor | null;
  onClose: () => void;
}

type FormState = {
  name: string;
  company: string;
  contactNumber: string;
  notes: string;
  category: string;
  isActive: boolean;
  archived: boolean;
  knownLicensePlates: string[];
  newPlate: string;
  profilePictureUrl: string | null;
};

const defaultState: FormState = {
  name: '',
  company: '',
  contactNumber: '',
  notes: '',
  category: '',
  isActive: true,
  archived: false,
  knownLicensePlates: [],
  newPlate: '',
  profilePictureUrl: null
};

export function ManageContractorModal({ open, contractor, onClose }: ManageContractorModalProps) {
  const [form, setForm] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contractor) {
      setForm({
        name: contractor.name ?? '',
        company: contractor.company ?? '',
        contactNumber: contractor.contact_number ?? '',
        notes: contractor.notes ?? '',
        category: contractor.category ?? '',
        isActive: contractor.is_active ?? true,
        archived: contractor.archived ?? false,
        knownLicensePlates: contractor.known_license_plates ?? [],
        newPlate: '',
        profilePictureUrl: contractor.profile_picture_url ?? null
      });
    } else if (open) {
      setForm(defaultState);
    }
  }, [open, contractor]);

  if (!open) return null;

  const handleAddPlate = () => {
    const value = form.newPlate.trim().toUpperCase();
    if (!value) return;
    if (form.knownLicensePlates.includes(value)) {
      toast.error('Plate already listed.');
      return;
    }
    setForm((previous) => ({
      ...previous,
      knownLicensePlates: [...previous.knownLicensePlates, value],
      newPlate: ''
    }));
  };

  const handleRemovePlate = (plate: string) => {
    setForm((previous) => ({
      ...previous,
      knownLicensePlates: previous.knownLicensePlates.filter((item) => item !== plate)
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.company.trim()) {
      toast.error('Name and company are required.');
      return;
    }

    setLoading(true);
    const payload = {
      name: form.name.trim(),
      company: form.company.trim(),
      contact_number: form.contactNumber.trim() || null,
      notes: form.notes.trim() || null,
      category: form.category.trim() || null,
      is_active: form.isActive,
      archived: form.archived,
      known_license_plates: form.knownLicensePlates,
      profile_picture_url: form.profilePictureUrl
    };

    const query = contractor
      ? supabase.from('pre_authorized_contractors').update(payload).eq('id', contractor.id)
      : supabase.from('pre_authorized_contractors').insert(payload);

    const { error } = await query;

    setLoading(false);

    if (error) {
      toast.error(`Failed to save contractor: ${error.message}`);
      return;
    }

    toast.success(`Contractor ${contractor ? 'updated' : 'added'}.`);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`${contractor ? 'Edit' : 'Add'} Pre-Authorized Contractor`}
      widthClass="max-w-4xl"
      footer={
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-60"
          >
            {loading ? 'Saving...' : contractor ? 'Save changes' : 'Add contractor'}
          </button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-[320px,1fr]">
        <ProfileImageUploader
          value={form.profilePictureUrl}
          onChange={(url) => setForm((previous) => ({ ...previous, profilePictureUrl: url }))}
        />
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500">Full Name *</label>
              <input
                value={form.name}
                onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500">Company *</label>
              <input
                value={form.company}
                onChange={(event) => setForm((previous) => ({ ...previous, company: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500">Contact Number</label>
              <input
                value={form.contactNumber}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, contactNumber: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-slate-500">Category</label>
              <input
                value={form.category}
                onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-slate-500">Notes</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(event) => setForm((previous) => ({ ...previous, notes: event.target.value }))}
            />
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <label className="text-xs uppercase tracking-wider text-slate-500">Known License Plates</label>
            <div className="flex gap-2">
              <input
                className="flex-1 uppercase"
                placeholder="ABC123"
                value={form.newPlate}
                onChange={(event) => setForm((previous) => ({ ...previous, newPlate: event.target.value }))}
              />
              <button
                type="button"
                onClick={handleAddPlate}
                className="rounded-lg bg-brand-light px-3 py-2 text-sm font-semibold text-white hover:bg-brand"
              >
                Add
              </button>
            </div>
            {form.knownLicensePlates.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.knownLicensePlates.map((plate) => (
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
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, isActive: event.target.checked }))
                }
              />
              Active contractor
            </label>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.archived}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, archived: event.target.checked }))
                }
              />
              Archived
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
