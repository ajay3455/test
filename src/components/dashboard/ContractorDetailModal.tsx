import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';
import { Modal } from '../common/Modal';
import type { ContractorSignIn, GeneralComment } from '../../types';
import { formatDateHeading, formatElapsed, formatTime } from '../../utils/format';
import { useGuardProfile } from '../../context/GuardProfileContext';
import { supabase } from '../../lib/supabaseClient';
import { ApprovalModal } from './modals/ApprovalModal';
import { SignOutModal } from './modals/SignOutModal';
import { HistoryModal } from './modals/HistoryModal';

interface ContractorDetailModalProps {
  entry: ContractorSignIn | null;
  onClose: () => void;
}

export function ContractorDetailModal({ entry, onClose }: ContractorDetailModalProps) {
  const { profile } = useGuardProfile();
  const [currentEntry, setCurrentEntry] = useState<ContractorSignIn | null>(entry);
  const [commentText, setCommentText] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [approvalMode, setApprovalMode] = useState<'approve' | 'decline' | null>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setCurrentEntry(entry);
    setCommentText('');
    setIsImportant(false);
  }, [entry]);

  const commentList = useMemo(() => currentEntry?.general_comments ?? [], [currentEntry?.general_comments]);

  if (!entry || !currentEntry) return null;

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment.');
      return;
    }

    const newComment: GeneralComment = {
      id: uuid(),
      text: commentText.trim(),
      author_id: null,
      author_name: profile.name || 'Security',
      created_at: new Date().toISOString(),
      is_important: isImportant
    };

    setCommentLoading(true);
    const updatedComments = [...commentList, newComment];
    const { data, error } = await supabase
      .from('contractor_sign_ins')
      .update({ general_comments: updatedComments })
      .eq('id', currentEntry.id)
      .select()
      .single();

    setCommentLoading(false);

    if (error) {
      toast.error(`Failed to add comment: ${error.message}`);
      return;
    }

    setCurrentEntry(data as ContractorSignIn);
    setCommentText('');
    setIsImportant(false);
    toast.success('Comment added');
  };

  const toggleImportant = async (comment: GeneralComment) => {
    const updated = commentList.map((item) =>
      item.id === comment.id ? { ...item, is_important: !item.is_important } : item
    );
    const { data, error } = await supabase
      .from('contractor_sign_ins')
      .update({ general_comments: updated })
      .eq('id', currentEntry.id)
      .select()
      .single();

    if (error) {
      toast.error(`Failed to update comment: ${error.message}`);
      return;
    }

    setCurrentEntry(data as ContractorSignIn);
  };

  return (
    <>
      <Modal
        open={Boolean(entry)}
        onClose={onClose}
        title={`${currentEntry.name} • ${currentEntry.company}`}
        subtitle={`Signed in ${formatElapsed(currentEntry.created_at)} ago at ${formatTime(currentEntry.created_at)}`}
        footer={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {currentEntry.approval_status === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => setApprovalMode('decline')}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-rose-500/60 px-4 py-2 text-sm font-semibold text-rose-200 hover:border-rose-400"
                >
                  Decline
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalMode('approve')}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                >
                  Approve
                </button>
              </>
            )}
            {currentEntry.approval_status === 'approved' && !currentEntry.is_signed_out && (
              <button
                type="button"
                onClick={() => setSignOutOpen(true)}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-white hover:bg-brand"
              >
                Sign Out Contractor
              </button>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          <section className="grid gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Visit Details</h4>
            <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Purpose</dt>
                <dd className="text-sm text-slate-200">{currentEntry.purpose_of_visit}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Contact</dt>
                <dd className="text-sm text-slate-200">{currentEntry.contact_number || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Parking</dt>
                <dd className="text-sm text-slate-200">
                  {currentEntry.needs_parking
                    ? currentEntry.parking_duration_minutes
                      ? `${currentEntry.parking_duration_minutes} min`
                      : 'Parking required'
                    : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Keys</dt>
                <dd className="text-sm text-slate-200">
                  {(currentEntry.keys ?? []).length > 0
                    ? currentEntry.keys?.join(', ')
                    : 'No keys required'}
                </dd>
              </div>
              {currentEntry.vehicles_signed_in && currentEntry.vehicles_signed_in.length > 0 && (
                <div className="md:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Vehicles</dt>
                  <dd className="mt-1 flex flex-wrap gap-2 text-sm text-slate-200">
                    {currentEntry.vehicles_signed_in.map((plate) => (
                      <span key={plate} className="rounded-full border border-slate-700 px-3 py-1">
                        {plate}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            {currentEntry.contractor_notes && (
              <p className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                {currentEntry.contractor_notes}
              </p>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">General Comments</h4>
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="text-xs font-semibold text-brand-muted hover:text-brand-light"
              >
                View sign-in history
              </button>
            </div>
            <div className="space-y-2">
              {commentList.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-4 text-sm text-slate-400">
                  No comments recorded yet.
                </p>
              ) : (
                commentList
                  .slice()
                  .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
                  .map((comment) => (
                    <article
                      key={comment.id}
                      className={`space-y-2 rounded-2xl border px-4 py-3 text-sm ${
                        comment.is_important
                          ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-100'
                          : 'border-slate-800 bg-slate-900/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{comment.author_name || 'Security'}</p>
                          <p className="text-xs text-slate-400">{formatDateHeading(comment.created_at)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleImportant(comment)}
                          className="text-xs font-semibold text-slate-300 hover:text-white"
                        >
                          {comment.is_important ? 'Unmark' : 'Mark important'}
                        </button>
                      </div>
                      <p>{comment.text}</p>
                    </article>
                  ))
              )}
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <textarea
                rows={3}
                placeholder="Add a comment for this visit"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                className="w-full"
              />
              <label className="inline-flex items-center gap-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(event) => setIsImportant(event.target.checked)}
                />
                Mark as important
              </label>
              <button
                type="button"
                disabled={commentLoading}
                onClick={handleAddComment}
                className="inline-flex items-center rounded-xl bg-brand-light px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand disabled:opacity-60"
              >
                {commentLoading ? 'Saving...' : 'Add comment'}
              </button>
            </div>
          </section>

          <section className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Security Workflow</h4>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Approval Status</dt>
                <dd className="text-sm text-slate-200">{currentEntry.approval_status}</dd>
                {currentEntry.approved_by_name && (
                  <p className="text-xs text-slate-500">Approved by {currentEntry.approved_by_name}</p>
                )}
                {currentEntry.security_approval_notes && (
                  <p className="mt-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
                    {currentEntry.security_approval_notes}
                  </p>
                )}
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Sign-Out Status</dt>
                <dd className="text-sm text-slate-200">
                  {currentEntry.is_signed_out
                    ? `Signed out at ${currentEntry.sign_out_time ? formatTime(currentEntry.sign_out_time) : ''}`
                    : 'Still on-site'}
                </dd>
                {currentEntry.signed_out_by_name && (
                  <p className="text-xs text-slate-500">Signed out by {currentEntry.signed_out_by_name}</p>
                )}
                {currentEntry.security_sign_out_notes && (
                  <p className="mt-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
                    {currentEntry.security_sign_out_notes}
                  </p>
                )}
              </div>
            </dl>
          </section>
        </div>
      </Modal>

      <ApprovalModal
        mode={approvalMode}
        entry={currentEntry}
        onClose={() => setApprovalMode(null)}
        onCompleted={(updated) => setCurrentEntry(updated)}
      />

      <SignOutModal
        open={signOutOpen}
        entry={currentEntry}
        onClose={() => setSignOutOpen(false)}
        onCompleted={(updated) => setCurrentEntry(updated)}
      />

      <HistoryModal
        open={historyOpen}
        contractorId={currentEntry.pre_authorized_contractor_id}
        contractorName={currentEntry.name}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
}
