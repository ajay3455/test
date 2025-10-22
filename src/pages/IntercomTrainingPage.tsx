import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CallAction,
  CallPoint,
  ColorKey,
  callPoints as intercomColumns,
  colorSwatches
} from '../lib/intercomData';

interface CallState {
  point: CallPoint;
  stage: 'incoming' | 'talked' | 'unlocked' | 'completed';
  timestamp: number;
}

const actionLabels: Record<CallAction, string> = {
  unlock: 'Unlock Door',
  verify: 'Verify Caller',
  deny: 'Do Not Unlock',
  redirect: 'Redirect Caller',
  confirm: 'Confirm Purpose',
  ask: 'Gather Details'
};

const colorRing: Record<ColorKey, string> = {
  yellow: 'shadow-[0_0_0_1px_rgba(250,204,21,0.6)]',
  pink: 'shadow-[0_0_0_1px_rgba(249,168,212,0.5)]',
  blue: 'shadow-[0_0_0_1px_rgba(147,197,253,0.5)]',
  green: 'shadow-[0_0_0_1px_rgba(134,239,172,0.5)]',
  orange: 'shadow-[0_0_0_1px_rgba(253,186,116,0.5)]',
  white: 'shadow-[0_0_0_1px_rgba(248,250,252,0.6)]',
  slate: 'shadow-[0_0_0_1px_rgba(148,163,184,0.6)]'
};

function useCallAudio() {
  const playTone = useCallback(() => {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, context.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.8);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.9);
  }, []);

  const speak = useCallback((message: string) => {
    if (typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-CA';
    window.speechSynthesis.speak(utterance);
  }, []);

  return { playTone, speak };
}

const guardSteps = [
  '👋 “Hi, security here — how may I assist you?”',
  '🗣️ Listen for confidence and tone.',
  '🏢 Ask for unit number or name if unsure.',
  '📷 Verify on camera before unlocking.'
];

const stageSummary: Record<CallAction, { unlocks: boolean; allowKey: boolean }> = {
  unlock: { unlocks: true, allowKey: true },
  verify: { unlocks: false, allowKey: false },
  deny: { unlocks: false, allowKey: false },
  redirect: { unlocks: false, allowKey: false },
  confirm: { unlocks: true, allowKey: true },
  ask: { unlocks: false, allowKey: false }
};

const columnTilt = {
  main: 'rotateX(6deg) rotateY(-10deg)',
  stack: 'rotateX(6deg) rotateY(-6deg)'
};

export function IntercomTrainingPage() {
  const [activeCall, setActiveCall] = useState<CallState | null>(null);
  const [callHistory, setCallHistory] = useState<CallState[]>([]);
  const [hint, setHint] = useState<string>('Press any label to simulate an incoming call.');

  const { playTone, speak } = useCallAudio();

  const startCall = useCallback(
    (point: CallPoint) => {
      playTone();
      setActiveCall({ point, stage: 'incoming', timestamp: Date.now() });
      setHint(`${point.shortLabel} is calling. Press TALK to respond.`);
    },
    [playTone]
  );

  const onTalk = useCallback(() => {
    if (!activeCall) return;
    if (activeCall.stage !== 'incoming') return;
    speak(activeCall.point.guardPrompt.replace(/“|”/g, ''));
    setActiveCall({ ...activeCall, stage: 'talked' });
    const requiresUnlock = stageSummary[activeCall.point.action].allowKey;
    setHint(
      `${activeCall.point.guardPrompt} ${
        requiresUnlock
          ? 'Now press the KEY button to release the door when ready.'
          : 'Review the guidance card and finish with the OFF button.'
      }`
    );
  }, [activeCall, speak]);

  const onKey = useCallback(() => {
    if (!activeCall) return;
    if (activeCall.stage !== 'talked') return;
    const summary = stageSummary[activeCall.point.action];
    if (!summary.allowKey) {
      setHint('This call does not allow remote unlocking. Close the call with the OFF button.');
      return;
    }
    playTone();
    setActiveCall({ ...activeCall, stage: 'unlocked' });
    setHint('Door released. Wrap up the call and hit the OFF button to disconnect.');
  }, [activeCall, playTone]);

  const onOff = useCallback(() => {
    if (!activeCall) return;
    if (activeCall.stage === 'incoming') {
      setHint('You need to TALK to the caller before ending the call.');
      return;
    }
    const completed = { ...activeCall, stage: 'completed' as const };
    setActiveCall(completed);
    setCallHistory((history) => [completed, ...history].slice(0, 6));
    setHint('Call disconnected. Ready for the next scenario.');
    setTimeout(() => setActiveCall(null), 350);
  }, [activeCall]);

  const highlightedId = activeCall?.point.id;

  const activeGuidance = activeCall?.point;
  const activeAction = activeCall ? stageSummary[activeCall.point.action] : null;

  const talkGlow = activeCall?.stage === 'incoming';
  const keyGlow = !!(activeCall && activeCall.stage === 'talked' && activeAction?.allowKey);
  const offGlow = !!(
    activeCall &&
    ((activeCall.stage === 'talked' && !activeAction?.allowKey) || activeCall.stage === 'unlocked')
  );

  const timeline = useMemo(
    () =>
      callHistory.map((entry) => ({
        id: `${entry.point.id}-${entry.timestamp}`,
        label: entry.point.shortLabel,
        stage: entry.stage,
        action: actionLabels[entry.point.action],
        at: new Date(entry.timestamp).toLocaleTimeString()
      })),
    [callHistory]
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-10 pb-16 text-slate-100 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <section className="space-y-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand/30 via-brand/10 to-transparent blur-3xl" />
          <div className="relative flex flex-col gap-6 rounded-[2.5rem] border border-slate-800/70 bg-slate-900/60 p-8 shadow-2xl shadow-brand/10 backdrop-blur">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-brand-light/70">Training Deck</p>
                <h2 className="text-2xl font-semibold">Aiphone Intercom Simulator</h2>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p className="font-medium text-slate-300">The Gloucester on Yonge</p>
                <p>Security Desk Practice Module</p>
              </div>
            </header>

            <div className="mx-auto w-full max-w-3xl">
              <div className="relative mx-auto h-[460px] max-w-full perspective-[1600px]">
                <div
                  className="absolute inset-0 mx-auto grid h-full max-w-3xl grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] gap-3"
                  style={{ transform: columnTilt.main }}
                >
                  <div className="relative rounded-[2rem] bg-slate-950/90 shadow-[12px_18px_28px_rgba(2,6,23,0.55)] ring-1 ring-slate-800/90">
                    <div className="flex h-full flex-col px-6 py-5">
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-3">
                          <div className="mb-2 h-16 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 shadow-inner" />
                          <div className="h-28 rounded-lg border border-slate-800/60 bg-slate-950/70" />
                        </div>
                        <div className="flex flex-col justify-between rounded-xl border border-slate-800/60 bg-slate-950/70 p-3 text-center text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          <div className="flex flex-1 items-center justify-center rounded-md border border-slate-800/50 bg-slate-900/80">
                            <span>Privacy</span>
                          </div>
                          <div className="flex flex-1 items-center justify-center rounded-md border border-slate-800/50 bg-slate-900/80">
                            <span>Scan</span>
                          </div>
                          <div className="flex flex-1 items-center justify-center rounded-md border border-slate-800/50 bg-slate-900/80">
                            <span>Monitor</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
                        <DeviceButton
                          label="Talk"
                          subLabel="Hold"
                          active={talkGlow}
                          onClick={onTalk}
                        />
                        <DeviceButton
                          label="Scan"
                          subLabel="Cycle"
                          active={false}
                          onClick={() => setHint('Scan cycles through panels. Not needed for this training call.')}
                        />
                        <DeviceButton
                          label="All Call"
                          subLabel="Page"
                          active={false}
                          onClick={() => setHint('All Call broadcasts to every handset. Use sparingly.')}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                        <DeviceButton label="Talk" subLabel="Handsfree" active={false} onClick={onTalk} disabled />
                        <DeviceButton label="Key" subLabel="Unlock" active={keyGlow} onClick={onKey} />
                        <DeviceButton label="Off" subLabel="End" active={offGlow} onClick={onOff} />
                      </div>

                      <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-xs text-slate-400">
                        <span>Active Call</span>
                        <AnimatePresence mode="wait" initial={false}>
                          {activeGuidance ? (
                            <motion.span
                              key={activeGuidance.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              className="text-right text-slate-200"
                            >
                              {activeGuidance.shortLabel}
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                            >
                              Standby
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  {intercomColumns.map((column) => (
                    <div
                      key={column.id}
                      className="rounded-[1.75rem] bg-slate-950/90 p-4 shadow-[12px_18px_28px_rgba(2,6,23,0.45)] ring-1 ring-slate-800/80"
                      style={{ transform: columnTilt.stack }}
                    >
                      <div className="mb-3 text-center text-[10px] uppercase tracking-[0.35em] text-slate-500">
                        {column.title}
                      </div>
                      <div className="grid gap-3">
                        {column.buttons.map((button) => (
                          <CallButton
                            key={button.id}
                            point={button}
                            active={highlightedId === button.id}
                            onClick={() => startCall(button)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-6 rounded-[2.25rem] border border-slate-800/70 bg-slate-950/70 p-6 shadow-xl">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-100">Call Guidance</h3>
          <p className="text-sm text-slate-400">{hint}</p>
          {activeGuidance ? (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="font-semibold text-slate-100">{activeGuidance.shortLabel}</p>
              <p className="mt-2 text-slate-300">{actionLabels[activeGuidance.action]}</p>
              <p className="mt-1 text-slate-400">{activeGuidance.accessRule}</p>
              <div className="mt-3 rounded-xl border border-slate-800/70 bg-slate-900/60 p-3 text-slate-200">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-light/70">Suggested Script</p>
                <p className="mt-1 text-sm text-slate-100">{activeGuidance.guardPrompt}</p>
              </div>
              <p className="mt-3 text-sm text-slate-400">{activeGuidance.notes}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800/80 p-6 text-center text-sm text-slate-500">
              Select a call point on the panel to view the cheat sheet.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-light/60">Verification Protocol</p>
          <ul className="mt-2 space-y-2 text-slate-200">
            {guardSteps.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-[2px] text-brand-light">•</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-light/60">Recent Practice</p>
            <button
              className="rounded-full border border-slate-700/70 px-3 py-1 text-xs text-slate-400 transition hover:border-brand/60 hover:text-slate-100"
              onClick={() => setCallHistory([])}
            >
              Clear Log
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {timeline.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-800/70 p-4 text-center text-xs text-slate-500">
                No practice calls yet.
              </li>
            ) : (
              timeline.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800/70 bg-slate-900/50 px-3 py-2 text-xs text-slate-300"
                >
                  <div>
                    <p className="font-medium text-slate-100">{item.label}</p>
                    <p className="text-[11px] text-slate-400">{item.action}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{item.at}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}

interface DeviceButtonProps {
  label: string;
  subLabel?: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

function DeviceButton({ label, subLabel, active = false, disabled, onClick }: DeviceButtonProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`group relative flex h-20 flex-col items-center justify-center rounded-2xl border border-slate-800/70 bg-slate-950/70 text-slate-200 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)] transition focus:outline-none focus:ring-2 focus:ring-brand/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        active ? 'shadow-[0_0_25px_rgba(129,140,248,0.45)] border-brand/70 text-white' : ''
      } ${disabled ? 'opacity-60' : 'hover:border-brand/40 hover:shadow-[0_0_18px_rgba(99,102,241,0.25)]'}`}
    >
      <span className="text-sm font-semibold uppercase tracking-[0.25em]">{label}</span>
      {subLabel && <span className="mt-1 text-[10px] uppercase tracking-[0.35em] text-slate-400">{subLabel}</span>}
      <span
        className={`absolute inset-x-6 bottom-3 h-[3px] rounded-full transition ${
          active ? 'bg-brand-light shadow-[0_0_16px_rgba(129,140,248,0.8)]' : 'bg-slate-800'
        }`}
      />
    </button>
  );
}

interface CallButtonProps {
  point: CallPoint;
  active: boolean;
  onClick: () => void;
}

function CallButton({ point, active, onClick }: CallButtonProps) {
  const gradient = useMemo(() => {
    const base = colorSwatches[point.color];
    return `linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.75) 15%, ${base} 90%)`;
  }, [point.color]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-16 flex-col justify-center rounded-xl border border-slate-800/60 bg-slate-900/80 px-3 text-left text-xs font-medium uppercase tracking-[0.2em] text-slate-200 transition hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-[0_12px_24px_rgba(99,102,241,0.25)] focus:outline-none focus:ring-2 focus:ring-brand/60 focus:ring-offset-2 focus:ring-offset-slate-950 ${
        active ? 'ring-2 ring-brand-light/80 shadow-[0_0_25px_rgba(129,140,248,0.45)]' : colorRing[point.color]
      }`}
      style={{ backgroundImage: gradient }}
    >
      <span>{point.lines[0]}</span>
      <span className="text-[11px] tracking-[0.25em] text-slate-100">{point.lines[1]}</span>
      <motion.span
        layoutId={active ? 'call-indicator' : undefined}
        className={`absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-light ${
          active ? 'animate-ping-slow' : 'opacity-0'
        }`}
      />
      {active && (
        <span className="absolute inset-0 rounded-xl border-2 border-brand/60 shadow-[0_0_25px_rgba(129,140,248,0.65)]" />
      )}
    </button>
  );
}

export default IntercomTrainingPage;
