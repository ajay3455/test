import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuid } from 'uuid';
import { Modal } from '../common/Modal';
import type { ContractorSignIn, GeneralComment } from '../../types';
import { formatDateHeading, formatElapsed, formatTime } from '../../utils/format';
import { useGuardProfile } from '../../context/GuardProfileContext';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { ApprovalModal } from './modals/ApprovalModal';
import { HistoryModal } from './modals/HistoryModal';
import { SignOutModal } from './modals/SignOutModal';

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

  const commentList = useMemo(
    () => currentEntry?.general_comments ?? [],
    [currentEntry?.general_comments]
  );

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
        subtitle={`Signed in ${formatElapsed(currentEntry.created_at)} ago at ${formatTime(
          currentEntry.created_at
        )}`}
        footer={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            {currentEntry.approval_status === 'pending' && (
              <>
                <Button
                  type="button"
                  onClick={() => setApprovalMode('decline')}
                  variant="danger"
                  className="flex-1"
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  onClick={() => setApprovalMode('approve')}
                  className="flex-1 bg-green-600 hover:bg-green-500"
                >
                  Approve
                </Button>
              </>
            )}
            {currentEntry.approval_status === 'approved' && !currentEntry.is_signed_out && (
              <Button type="button" onClick={() => setSignOutOpen(true)} className="flex-1">
                Sign Out Contractor
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          <section className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-100/60 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Visit Details
            </h4>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Purpose</dt>
                <dd className="text-sm text-slate-700">{currentEntry.purpose_of_visit}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Contact</dt>
                <dd className="text-sm text-slate-700">
                  {currentEntry.contact_number || 'Not provided'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Parking</dt>
                <dd className="text-sm text-slate-700">
                  {currentEntry.needs_parking
                    ? currentEntry.parking_duration_minutes
                      ? `${currentEntry.parking_duration_minutes} min`
                      : 'Parking required'
                    : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Keys</dt>
                <dd className="text-sm text-slate-700">
                  {(currentEntry.keys ?? []).length > 0
                    ? currentEntry.keys?.join(', ')
                    : 'No keys required'}
                </dd>
              </div>
              {currentEntry.vehicles_signed_in && currentEntry.vehicles_signed_in.length > 0 && (
                <div className="md:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Vehicles</dt>
                  <dd className="mt-1 flex flex-wrap gap-2 text-sm text-slate-700">
                    {currentEntry.vehicles_signed_in.map((plate) => (
                      <span
                        key={plate}
                        className="rounded-full border border-slate-300 bg-slate-200 px-3 py-1"
                      >
                        {plate}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            {currentEntry.contractor_notes && (
              <p className="rounded-xl border border-slate-200 bg-slate-100/80 p-3 text-sm text-slate-600">
                {currentEntry.contractor_notes}
              </p>
            )}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                General Comments
              </h4>
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                className="text-xs font-semibold text-brand hover:text-brand-light"
              >
                View sign-in history
              </button>
            </div>
            <div className="space-y-2">
              {commentList.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-300 bg-slate-100/30 p-4 text-sm text-slate-500">
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
                          ? 'border-yellow-300 bg-yellow-100/60 text-yellow-800'
                          : 'border-slate-200 bg-slate-100/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{comment.author_name || 'Security'}</p>
                          <p className="text-xs text-slate-500">
                            {formatDateHeading(comment.created_at)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleImportant(comment)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                        >
                          {comment.is_important ? 'Unmark' : 'Mark important'}
                        </button>
                      </div>
                      <p>{comment.text}</p>
                    </article>
                  ))
              )}
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-100/60 p-4">
              <Textarea
                rows={3}
                placeholder="Add a comment for this visit"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-brand focus:ring-brand/50"
                    checked={isImportant}
                    onChange={(event) => setIsImportant(event.target.checked)}
                  />
                  Mark as important
                </label>
                <Button
                  type="button"
                  disabled={commentLoading}
                  onClick={handleAddComment}
                  size="sm"
                >
                  {commentLoading ? 'Saving...' : 'Add comment'}
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-100/60 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Security Workflow
            </h4>
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Approval Status</dt>
                <dd className="text-sm font-semibold text-slate-700">
                  {currentEntry.approval_status}
                </dd>
                {currentEntry.approved_by_name && (
                  <p className="text-xs text-slate-500">
                    Approved by {currentEntry.approved_by_name}
                  </p>
                )}
                {currentEntry.security_approval_notes && (
                  <p className="mt-2 rounded-xl border border-slate-200 bg-slate-100/80 p-3 text-xs text-slate-600">
                    {currentEntry.security_approval_notes}
                  </p>
                )}
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Sign-Out Status</dt>
                <dd className="text-sm font-semibold text-slate-700">
                  {currentEntry.is_signed_out
                    ? `Signed out at ${
                        currentEntry.sign_out_time ? formatTime(currentEntry.sign_out_time) : ''
                      }`
                    : 'Still on-site'}
                </dd>
                {currentEntry.signed_out_by_name && (
                  <p className="text-xs text-slate-500">
                    Signed out by {currentEntry.signed_out_by_name}
                  </p>
                )}
                {currentEntry.security_sign_out_notes && (
                  <p className="mt-2 rounded-xl border border-slate-200 bg-slate-100/80 p-3 text-xs text-slate-600">
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
