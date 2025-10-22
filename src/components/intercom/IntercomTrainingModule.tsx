import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { intercomTargets, IntercomTarget } from '../../data/intercomCalls';
import { playActionClick, playRingPattern, playSuccessChord } from '../../utils/audio';

type CallStage = 'idle' | 'incoming' | 'talked' | 'unlocked' | 'completed';

type VerificationState = {
  [targetId: string]: boolean;
};

function getStageHint(target: IntercomTarget | null, stage: CallStage, verified: boolean) {
  if (!target || stage === 'idle') return 'Press “Simulate call” to start a scenario.';

  if (stage === 'incoming') {
    return 'An intercom call is ringing — press TALK to open the channel.';
  }

  switch (target.actionType) {
    case 'autoUnlock':
      if (stage === 'talked') {
        return 'Confirm the caller is a delivery. Press the key button to unlock, then finish with OFF.';
      }
      if (stage === 'unlocked') {
        return 'Door released. Press OFF to end the call.';
      }
      return 'Call completed.';
    case 'verifyUnlock':
      if (stage === 'talked') {
        return verified
          ? 'Verification recorded — press the key button to unlock, then press OFF to disconnect.'
          : 'Ask for the unit # or name and check the camera. Tick verification before unlocking.';
      }
      if (stage === 'unlocked') {
        return 'Door released. Press OFF to end the call.';
      }
      return 'Call completed.';
    case 'neverUnlock':
      if (stage === 'talked') {
        return 'Politely decline. Do NOT press the key button. End the call with OFF.';
      }
      return 'Call completed.';
    case 'redirect':
      if (stage === 'talked') {
        return 'Redirect the caller to the street exit. Do not unlock. Press OFF to finish.';
      }
      return 'Call completed.';
    case 'confirmThenUnlock':
      if (stage === 'talked') {
        return 'Confirm they truly need the dock or garage door. Unlock only once confirmed, then OFF.';
      }
      if (stage === 'unlocked') {
        return 'Door released. Press OFF to end the call.';
      }
      return 'Call completed.';
    case 'askPurpose':
      if (stage === 'talked') {
        return 'Gather details and decide the next steps. There is no connected door, so finish with OFF.';
      }
      return 'Call completed.';
    case 'noDoorControl':
      if (stage === 'talked') {
        return 'Explain that the desk cannot unlock this door and offer assistance. Press OFF when done.';
      }
      return 'Call completed.';
    default:
      return '';
  }
}

function requiresUnlock(action: IntercomTarget['actionType']) {
  return action === 'autoUnlock' || action === 'verifyUnlock' || action === 'confirmThenUnlock';
}

function allowsUnlock(action: IntercomTarget['actionType']) {
  return action === 'autoUnlock' || action === 'verifyUnlock' || action === 'confirmThenUnlock';
}

export function IntercomTrainingModule() {
  const [activeTarget, setActiveTarget] = useState<IntercomTarget | null>(null);
  const [stage, setStage] = useState<CallStage>('idle');
  const [verification, setVerification] = useState<VerificationState>({});
  const [statusMessage, setStatusMessage] = useState<string>('');

  const sortedColumns = useMemo(() => {
    return [1, 2, 3].map((column) =>
      intercomTargets
        .filter((target) => target.column === column)
        .sort((a, b) => a.row - b.row)
    );
  }, []);

  const stageHint = useMemo(
    () => getStageHint(activeTarget, stage, activeTarget ? verification[activeTarget.id] ?? false : false),
    [activeTarget, stage, verification]
  );

  const resetCall = useCallback(() => {
    setStage('idle');
    setStatusMessage('');
    setActiveTarget(null);
  }, []);

  const startCall = useCallback(
    (target: IntercomTarget) => {
      setActiveTarget(target);
      setStage('incoming');
      setStatusMessage('');
      setVerification((prev) => ({ ...prev, [target.id]: false }));
      playRingPattern();
    },
    []
  );

  const startRandomCall = useCallback(() => {
    const randomTarget = intercomTargets[Math.floor(Math.random() * intercomTargets.length)];
    startCall(randomTarget);
  }, [startCall]);

  const handleTalk = useCallback(() => {
    if (!activeTarget) {
      setStatusMessage('No active call to answer.');
      return;
    }

    if (stage !== 'incoming') {
      setStatusMessage(stage === 'idle' ? 'Start a scenario to practice.' : 'TALK already pressed. Continue to the next step.');
      return;
    }

    playActionClick();
    setStage('talked');
    setStatusMessage(activeTarget.guardScript);
  }, [activeTarget, stage]);

  const handleUnlock = useCallback(() => {
    if (!activeTarget) {
      setStatusMessage('No call is active.');
      return;
    }

    if (stage === 'idle') {
      setStatusMessage('Start a scenario to practice.');
      return;
    }

    if (stage === 'incoming') {
      setStatusMessage('Press TALK first to speak to the caller.');
      return;
    }

    if (!allowsUnlock(activeTarget.actionType)) {
      setStatusMessage('Do not unlock for this call. Finish with OFF when you are ready.');
      return;
    }

    const verified = verification[activeTarget.id] ?? false;
    if (activeTarget.actionType === 'verifyUnlock' && !verified) {
      setStatusMessage('Record that you verified the caller before unlocking.');
      return;
    }

    if (stage === 'unlocked') {
      setStatusMessage('Door already released. Press OFF to end the call.');
      return;
    }

    playActionClick();
    setStage('unlocked');
    setStatusMessage('Door unlocked — remind the caller and then press OFF to disconnect.');
  }, [activeTarget, stage, verification]);

  const handleOff = useCallback(() => {
    if (!activeTarget) {
      setStatusMessage('No call to clear.');
      return;
    }

    if (stage === 'incoming') {
      setStatusMessage('Answer with TALK before ending the call.');
      return;
    }

    if (stage === 'talked' && requiresUnlock(activeTarget.actionType)) {
      setStatusMessage('Unlock the door (if appropriate) before ending the call.');
      return;
    }

    playActionClick();
    setStage('completed');
    setStatusMessage('Call ended. Nice work!');
    playSuccessChord();
    setTimeout(() => {
      resetCall();
    }, 1500);
  }, [activeTarget, resetCall, stage]);

  const activeVerification = activeTarget ? verification[activeTarget.id] ?? false : false;
  const showVerification = activeTarget?.actionType === 'verifyUnlock';

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(360px,420px),1fr]">
      <div className="space-y-6">
        <div className="[perspective:1600px]">
          <div
            className="relative mx-auto max-w-xl transform-gpu rounded-3xl bg-slate-950 p-6 text-slate-100 shadow-[0_40px_120px_rgba(15,23,42,0.45)]"
            style={{
              transform: 'rotateX(8deg) rotateY(-18deg)',
              boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.1), 0 32px 120px rgba(15, 23, 42, 0.45)'
            }}
          >
            <div className="grid grid-cols-[210px,repeat(3,110px)] gap-3">
              <div className="flex flex-col gap-3 rounded-2xl bg-slate-900 p-4 shadow-inner shadow-black/40">
                <div className="rounded-lg bg-slate-800 p-3 shadow-inner shadow-black/40">
                  <div className="h-1.5 rounded-full bg-slate-700" />
                  <div className="mt-2 h-1 rounded-full bg-slate-700" />
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    <span className="h-1 rounded-full bg-slate-700" />
                    <span className="h-1 rounded-full bg-slate-700" />
                    <span className="h-1 rounded-full bg-slate-700" />
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950/40 p-3 shadow-inner shadow-black/30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),transparent_70%)]" />
                  <div className="relative flex h-24 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80">
                    <span className="text-sm font-semibold tracking-[0.2em] text-slate-500">AIPHONE</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-300">
                  <div className="rounded-md border border-slate-700 bg-slate-800 py-2 text-center">Privacy</div>
                  <div className="rounded-md border border-slate-700 bg-slate-800 py-2 text-center">Talk</div>
                  <div className="rounded-md border border-slate-700 bg-slate-800 py-2 text-center">Scan</div>
                  <div className="rounded-md border border-slate-700 bg-slate-800 py-2 text-center">All Call</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['✖', '🔈', '🔑', '⏹'].map((symbol, index) => {
                    const labels = ['Cancel', 'Talk', 'Unlock', 'Off'];
                    const handlers = [
                      () => setStatusMessage('Cancel is decorative in this demo.'),
                      handleTalk,
                      handleUnlock,
                      handleOff
                    ];
                    const isAction = index > 0;
                    return (
                      <button
                        key={symbol}
                        type="button"
                        onClick={handlers[index]}
                        className={clsx(
                          'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold transition',
                          isAction && 'hover:border-brand hover:bg-brand/20',
                          index === 1 && stage !== 'idle' && 'ring-2 ring-brand/70',
                          index === 2 && stage === 'unlocked' && 'ring-2 ring-emerald-400/70',
                          index === 3 && stage === 'completed' && 'ring-2 ring-sky-300/70'
                        )}
                      >
                        <span className="text-2xl">{symbol}</span>
                        <span className="text-[0.55rem] uppercase tracking-[0.2em] text-slate-300">{labels[index]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {sortedColumns.map((columnTargets, columnIndex) => (
                <div
                  key={`column-${columnIndex}`}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-800/60 bg-slate-900/80 p-2 shadow-inner shadow-black/30"
                >
                  {columnTargets.map((target) => {
                    const isActive = activeTarget?.id === target.id && stage !== 'idle';
                    return (
                      <button
                        key={target.id}
                        type="button"
                        onClick={() => startCall(target)}
                        className={clsx(
                          'group relative overflow-hidden rounded-xl border border-slate-800/50 px-3 py-2 text-left shadow-sm transition hover:shadow-lg',
                          target.colorClass,
                          target.textClass ?? 'text-slate-900',
                          isActive && 'ring-4 ring-brand/70 shadow-[0_0_30px_rgba(99,102,241,0.45)]'
                        )}
                      >
                        <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
                          <span>{target.label}</span>
                          <span className="text-[0.55rem] text-slate-800/60 group-hover:text-slate-800/80">CALL</span>
                        </div>
                        {target.subLabel && (
                          <p className="mt-1 text-[0.6rem] font-medium normal-case tracking-normal text-slate-700/80">
                            {target.subLabel}
                          </p>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 animate-pulse bg-brand/20" aria-hidden />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-800/70 bg-slate-900/90 p-4 shadow-inner shadow-black/30">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Call Status</p>
              <p className="mt-2 text-sm text-slate-100">{statusMessage || stageHint}</p>
            </div>
          </div>
        </div>
        {showVerification && activeTarget && (
          <div className="rounded-2xl border border-emerald-200/50 bg-emerald-50/70 p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-emerald-800">Verification Checklist</h3>
            <p className="mt-2 text-sm text-emerald-700">
              Confirm the caller’s details before unlocking. Tick the box once unit/name and camera check are complete.
            </p>
            <label className="mt-3 flex items-center gap-3 text-sm font-medium text-emerald-800">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                checked={activeVerification}
                onChange={(event) =>
                  setVerification((prev) => ({ ...prev, [activeTarget.id]: event.target.checked }))
                }
              />
              Verification complete — caller confirmed and camera checked.
            </label>
          </div>
        )}
        {activeTarget?.helperNote && (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-slate-800">Quick Reminder</h3>
            <p className="mt-2 text-sm text-slate-600">{activeTarget.helperNote}</p>
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-soft-lg">
          <h2 className="text-lg font-semibold text-slate-900">Intercom call simulator</h2>
          <p className="mt-2 text-sm text-slate-600">
            Launch a scenario to see the corresponding button light up. Answer with TALK, follow the checklist, unlock when
            appropriate, and finish with OFF.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startRandomCall}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-light"
            >
              Simulate random call
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTarget) {
                  resetCall();
                }
              }}
              className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
            >
              Clear panel
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-soft-lg">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Cheat sheet</h3>
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            <li>
              <strong className="text-slate-800">1.</strong> “Hi, security here — how may I assist you?” Listen for tone and confidence.
            </li>
            <li>
              <strong className="text-slate-800">2.</strong> Ask for a unit number or name whenever the caller is a resident. Verify on camera when unsure.
            </li>
            <li>
              <strong className="text-slate-800">3.</strong> Always unlock P1 E8 Dog Relief for deliveries. Never unlock any E5 buttons.
            </li>
            <li>
              <strong className="text-slate-800">4.</strong> Redirect E7 callers to the Yonge Street exit — those doors are not controlled from the desk.
            </li>
            <li>
              <strong className="text-slate-800">5.</strong> Log suspicious calls with the time, caller details, and what was requested.
            </li>
          </ul>
        </div>
        <div className="rounded-3xl border border-brand-muted/60 bg-brand-surface/80 p-6 shadow-soft-lg">
          <h3 className="text-sm font-semibold text-brand text-opacity-90">Need a specific location?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Click any label on the panel to trigger that exact call scenario. The illuminated button mirrors the hardware so you can
            rehearse the right script every time.
          </p>
        </div>
      </div>
    </div>
  );
}
