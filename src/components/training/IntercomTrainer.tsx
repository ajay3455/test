import { useMemo, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

type FloorColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'white' | 'slate';

type ScenarioAction =
  | 'unlock'
  | 'verify-then-unlock'
  | 'deny'
  | 'redirect'
  | 'confirm'
  | 'ask';

type Scenario = {
  id: ScenarioAction;
  summary: string;
  script: string;
  doorControl: 'unlock' | 'keep-closed' | 'desk-only';
  reminder?: string;
};

type IntercomButton = {
  id: string;
  label: string;
  description?: string;
  column: number;
  row: number;
  color: FloorColor;
  scenario: ScenarioAction;
};

type Stage = 'idle' | 'incoming' | 'talk' | 'key' | 'complete';

const SCENARIOS: Record<ScenarioAction, Scenario> = {
  unlock: {
    id: 'unlock',
    summary: 'Immediate unlock: parcel or TTC access.',
    script: "Delivery or parcel access — you're clear to enter.",
    doorControl: 'unlock',
    reminder: 'Always unlock P1 E8 Dog Relief for deliveries.'
  },
  'verify-then-unlock': {
    id: 'verify-then-unlock',
    summary: 'Verify caller, then unlock if confirmed resident.',
    script: 'May I have your unit number or name for verification? Thank you — you are clear.',
    doorControl: 'unlock',
    reminder: 'Confirm caller details before unlocking. Check camera if uncertain.'
  },
  deny: {
    id: 'deny',
    summary: 'Do not unlock. This is private residential access.',
    script:
      'This is the private residential lobby. Please follow parking signs to E8 or use the commercial elevator for exit.',
    doorControl: 'keep-closed',
    reminder: 'Never unlock E5. Log suspicious activity if caller insists.'
  },
  redirect: {
    id: 'redirect',
    summary: 'Redirect caller to Yonge Street exit or other level.',
    script:
      'Please use the Yonge Street exit — the door stays open during the day. If it is locked, proceed to another parking level.',
    doorControl: 'keep-closed',
    reminder: 'Do not unlock commercial E7 doors from the desk.'
  },
  confirm: {
    id: 'confirm',
    summary: 'Confirm purpose, then release loading dock or garage if appropriate.',
    script: 'Do you require the loading dock or garage door? Stand by while I open it from the desk.',
    doorControl: 'desk-only',
    reminder: 'Use the desk push button to open loading dock after confirming purpose.'
  },
  ask: {
    id: 'ask',
    summary: 'No door control — clarify the request.',
    script: 'How may I assist you? There is no door connected here — what do you need help with?',
    doorControl: 'keep-closed',
    reminder: 'Record unusual requests in the security log.'
  }
};

const BUTTONS: IntercomButton[] = [
  { id: 'p1-e8', label: 'P1 E8', description: 'Dog Relief / TTC', column: 0, row: 0, color: 'yellow', scenario: 'unlock' },
  { id: 'p1-ramp', label: 'P1 Ramp', description: 'Ramp CCTV', column: 0, row: 1, color: 'yellow', scenario: 'ask' },
  { id: 'p1-e7', label: 'P1 E7', description: 'Commercial', column: 0, row: 2, color: 'yellow', scenario: 'redirect' },
  { id: 'p1-e5', label: 'P1 E5', description: 'Private Lobby', column: 0, row: 3, color: 'yellow', scenario: 'deny' },
  { id: 'p1-c024', label: 'P1 C024', description: 'Resident Call', column: 0, row: 4, color: 'yellow', scenario: 'verify-then-unlock' },

  { id: 'p2-e8', label: 'P2 E8', description: 'Resident', column: 1, row: 0, color: 'pink', scenario: 'verify-then-unlock' },
  { id: 'p2-e7', label: 'P2 E7', description: 'Commercial', column: 1, row: 1, color: 'pink', scenario: 'redirect' },
  { id: 'p2-e5', label: 'P2 E5', description: 'Private Lobby', column: 1, row: 2, color: 'pink', scenario: 'deny' },
  { id: 'p2-4012', label: 'P2 4012', description: 'Resident Call', column: 1, row: 3, color: 'pink', scenario: 'verify-then-unlock' },
  { id: 'p2-3019', label: 'P2 3019', description: 'Resident Call', column: 1, row: 4, color: 'pink', scenario: 'verify-then-unlock' },

  { id: 'p3-e8', label: 'P3 E8', description: 'Resident', column: 2, row: 0, color: 'blue', scenario: 'verify-then-unlock' },
  { id: 'p3-e7', label: 'P3 E7', description: 'Commercial', column: 2, row: 1, color: 'blue', scenario: 'redirect' },
  { id: 'p3-e5', label: 'P3 E5', description: 'Private Lobby', column: 2, row: 2, color: 'blue', scenario: 'deny' },
  { id: 'p3-1709', label: 'P3 1709', description: 'Resident Call', column: 2, row: 3, color: 'blue', scenario: 'verify-then-unlock' },
  { id: 'p3-2614', label: 'P3 2614', description: 'Resident Call', column: 2, row: 4, color: 'blue', scenario: 'verify-then-unlock' },

  { id: 'p4-e8', label: 'P4 E8', description: 'Resident', column: 3, row: 0, color: 'green', scenario: 'verify-then-unlock' },
  { id: 'p4-e7', label: 'P4 E7', description: 'Commercial', column: 3, row: 1, color: 'green', scenario: 'redirect' },
  { id: 'p4-e5', label: 'P4 E5', description: 'Private Lobby', column: 3, row: 2, color: 'green', scenario: 'deny' },
  { id: 'p4-1205', label: 'P4 1205', description: 'Resident Call', column: 3, row: 3, color: 'green', scenario: 'verify-then-unlock' },
  { id: 'p4-1804', label: 'P4 1804', description: 'Resident Call', column: 3, row: 4, color: 'green', scenario: 'verify-then-unlock' },

  { id: 'p5-e8', label: 'P5 E8', description: 'Resident', column: 4, row: 0, color: 'orange', scenario: 'verify-then-unlock' },
  { id: 'p5-e7', label: 'P5 E7', description: 'Commercial', column: 4, row: 1, color: 'orange', scenario: 'redirect' },
  { id: 'p5-e5', label: 'P5 E5', description: 'Private Lobby', column: 4, row: 2, color: 'orange', scenario: 'deny' },
  { id: 'p5-604', label: 'P5 604', description: 'Resident Call', column: 4, row: 3, color: 'orange', scenario: 'verify-then-unlock' },
  { id: 'p5-817', label: 'P5 817', description: 'Resident Call', column: 4, row: 4, color: 'orange', scenario: 'verify-then-unlock' },

  { id: 'loading-dock', label: 'Loading Dock', description: 'Dock / Pool Corridor', column: 5, row: 0, color: 'white', scenario: 'confirm' },
  { id: 'pool', label: 'Pool 6F', description: '6th Floor', column: 5, row: 1, color: 'white', scenario: 'ask' },
  { id: 'desk', label: 'Desk Call', description: 'Miscellaneous', column: 5, row: 2, color: 'white', scenario: 'ask' }
];

const CHECKLIST_STEPS = [
  'Hi, security here — how may I assist you?',
  'Listen for confidence and tone.',
  'Ask for unit number or name.',
  'Verify on camera if unsure before unlocking.'
];

const FLOOR_COLORS: Record<FloorColor, string> = {
  yellow: 'from-yellow-200 to-yellow-300 text-yellow-950',
  pink: 'from-pink-200 to-pink-300 text-pink-950',
  blue: 'from-sky-200 to-sky-300 text-sky-950',
  green: 'from-emerald-200 to-emerald-300 text-emerald-950',
  orange: 'from-orange-200 to-orange-300 text-orange-950',
  white: 'from-slate-100 to-slate-200 text-slate-700',
  slate: 'from-slate-200 to-slate-300 text-slate-700'
};

const ringTone =
  'data:audio/wav;base64,UklGRlQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAEQAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA=';

const clickTone =
  'data:audio/wav;base64,UklGRkQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAACQAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI=';

export function IntercomTrainer() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [checklist, setChecklist] = useState<boolean[]>(() => CHECKLIST_STEPS.map(() => false));
  const [hintVisible, setHintVisible] = useState(true);

  const ringRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    ringRef.current = new Audio(ringTone);
    ringRef.current.loop = true;
    clickRef.current = new Audio(clickTone);
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;
    if (stage === 'incoming') {
      void ringRef.current.play().catch(() => undefined);
    } else {
      ringRef.current.pause();
      ringRef.current.currentTime = 0;
    }
  }, [stage]);

  const activeButton = useMemo(
    () => (activeId ? BUTTONS.find((button) => button.id === activeId) ?? null : null),
    [activeId]
  );

  useEffect(() => {
    if (stage === 'idle') {
      setChecklist(CHECKLIST_STEPS.map(() => false));
      setHintVisible(true);
    }
  }, [stage]);

  const scenario = activeButton ? SCENARIOS[activeButton.scenario] : null;

  const groupedButtons = useMemo(() => {
    const columns = new Map<number, IntercomButton[]>();
    BUTTONS.forEach((button) => {
      if (!columns.has(button.column)) {
        columns.set(button.column, []);
      }
      columns.get(button.column)?.push(button);
    });
    columns.forEach((buttons) => buttons.sort((a, b) => a.row - b.row));
    return Array.from(columns.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, buttons]) => buttons);
  }, []);

  function simulateCall(id: string) {
    if (clickRef.current) {
      void clickRef.current.play().catch(() => undefined);
    }
    setActiveId(id);
    setStage('incoming');
    setHintVisible(true);
  }

  function handleTalkPressed() {
    if (stage === 'incoming') {
      setStage('talk');
      setHintVisible(false);
      if (clickRef.current) {
        void clickRef.current.play().catch(() => undefined);
      }
    }
  }

  function handleKeyPressed() {
    if (!scenario) return;
    if (clickRef.current) {
      void clickRef.current.play().catch(() => undefined);
    }
    if (stage !== 'talk') return;

    if (scenario.doorControl === 'unlock') {
      setStage('key');
    } else {
      setHintVisible(true);
    }
  }

  function handleOffPressed() {
    if (stage === 'idle') return;
    if (clickRef.current) {
      void clickRef.current.play().catch(() => undefined);
    }
    if (stage === 'key' || scenario?.doorControl !== 'unlock') {
      setStage('complete');
      setTimeout(() => {
        setActiveId(null);
        setStage('idle');
      }, 900);
    }
  }

  function toggleChecklist(index: number) {
    setChecklist((prev) =>
      prev.map((value, i) => {
        if (i === index) {
          return !value;
        }
        return value;
      })
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 pb-16">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold text-slate-900">Intercom Training Console</h1>
        <p className="max-w-3xl text-slate-600">
          Practice responding to parking and elevator intercom calls with a faithful recreation of the
          Aiphone panel. Trigger a call, follow the verification protocol, and complete the Talk → Key → Off
          workflow while the illuminated button guides you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex items-center justify-center">
          <div style={{ perspective: '1800px' }} className="w-full max-w-3xl">
            <div
              className="relative mx-auto aspect-[16/8] max-w-full transform rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)] transition-[transform] duration-500"
              style={{ transform: 'rotateX(12deg) rotateY(-12deg)' }}
            >
              <div className="flex h-full gap-4">
                <div className="flex w-[240px] flex-col justify-between rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-10 rounded-lg border border-slate-700/60 bg-slate-800/70 shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex-1 rounded-2xl border border-slate-700/40 bg-slate-900/70 p-4">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Status</p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">
                          {stage === 'idle' && 'Standby'}
                          {stage === 'incoming' && 'Incoming Call'}
                          {stage === 'talk' && 'Talk Mode Active'}
                          {stage === 'key' && 'Door Unlocked'}
                          {stage === 'complete' && 'Call Logged'}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          {activeButton && scenario ? scenario.summary : 'Awaiting call selection.'}
                        </p>
                      </div>

                      <div className="mt-6 rounded-xl border border-slate-700/40 bg-slate-800/80 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          Verification Protocol
                        </p>
                        <ul className="mt-2 space-y-2 text-sm text-slate-200">
                          {CHECKLIST_STEPS.map((step, index) => (
                            <li key={step}>
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-brand focus:ring-brand"
                                  checked={checklist[index]}
                                  onChange={() => toggleChecklist(index)}
                                />
                                <span>{step}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={handleTalkPressed}
                      className={clsx(
                        'flex h-16 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 shadow-inner transition',
                        stage === 'incoming' && 'animate-pulse border-brand text-white shadow-[0_0_20px_rgba(148,163,184,0.5)]',
                        stage !== 'incoming' && 'hover:border-brand/60 hover:text-white'
                      )}
                    >
                      <span className="text-lg font-semibold">TALK</span>
                      <span className="text-[10px] tracking-[0.3em] text-slate-500">HOLD</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleKeyPressed}
                      className={clsx(
                        'flex h-16 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 shadow-inner transition',
                        stage === 'talk' && scenario?.doorControl === 'unlock'
                          ? 'animate-pulse border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(74,222,128,0.5)]'
                          : 'hover:border-emerald-400/60 hover:text-emerald-100'
                      )}
                    >
                      <span className="text-xl">🔑</span>
                      <span className="text-[10px] tracking-[0.3em] text-slate-500">UNLOCK</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOffPressed}
                      className={clsx(
                        'flex h-16 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 shadow-inner transition',
                        stage === 'key' || (stage === 'talk' && scenario?.doorControl !== 'unlock')
                          ? 'animate-pulse border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,114,182,0.5)]'
                          : 'hover:border-rose-400/60 hover:text-rose-100'
                      )}
                    >
                      <span className="text-lg font-semibold">OFF</span>
                      <span className="text-[10px] tracking-[0.3em] text-slate-500">RESET</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 gap-3">
                  {groupedButtons.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className="flex flex-1 flex-col gap-3 rounded-3xl border border-slate-700/50 bg-slate-900/70 p-3 shadow-inner"
                    >
                      {column.map((button) => (
                        <div key={button.id} className="relative">
                          <button
                            type="button"
                            onClick={() => simulateCall(button.id)}
                            className={clsx(
                              'relative flex w-full flex-col items-start gap-1 rounded-2xl border border-slate-600/40 bg-slate-800/60 p-3 text-left shadow-[inset_0_2px_6px_rgba(15,23,42,0.6)] transition',
                              activeId === button.id
                                ? 'border-white/70 shadow-[0_0_18px_rgba(226,232,240,0.75)]'
                                : 'hover:border-white/40'
                            )}
                          >
                            <span
                              className={clsx(
                                'inline-flex items-center rounded-lg bg-gradient-to-br px-2 py-1 text-xs font-semibold uppercase tracking-widest shadow-inner',
                                FLOOR_COLORS[button.color]
                              )}
                            >
                              {button.label}
                            </span>
                            <span className="text-sm font-medium text-slate-100">
                              {button.description}
                            </span>
                            <span className="text-xs text-slate-400">{SCENARIOS[button.scenario].summary}</span>
                          </button>
                          {activeId === button.id && stage !== 'idle' && scenario && (
                            <div className="pointer-events-none absolute -right-2 top-1/2 w-56 -translate-y-1/2 translate-x-full rounded-2xl border border-white/30 bg-slate-900/90 p-3 text-xs text-slate-100 shadow-lg">
                              <p className="font-semibold text-brand">Suggested Response</p>
                              <p className="mt-1 text-slate-200">{scenario.script}</p>
                              {scenario.reminder && (
                                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                                  {scenario.reminder}
                                </p>
                              )}
                            </div>
                          )}
                          {activeId === button.id && stage === 'incoming' && hintVisible && (
                            <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-300/70 ring-8 ring-amber-200/20" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-soft backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Call Library</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose a button to ring. The matching key on the panel will glow until you complete the
              Talk → Key → Off sequence.
            </p>
          </div>

          <div className="space-y-3">
            {BUTTONS.map((button) => (
              <button
                key={button.id}
                type="button"
                onClick={() => simulateCall(button.id)}
                className={clsx(
                  'flex w-full flex-col rounded-2xl border border-slate-200 bg-white/90 p-3 text-left shadow-sm transition hover:shadow-md',
                  activeId === button.id && 'border-brand/80 shadow-brand/40'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{button.label}</span>
                  <span
                    className={clsx(
                      'inline-flex items-center rounded-full bg-gradient-to-br px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
                      FLOOR_COLORS[button.color]
                    )}
                  >
                    {button.color}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{button.description}</p>
                <p className="mt-1 text-sm text-slate-700">{SCENARIOS[button.scenario].summary}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => simulateCall(BUTTONS[Math.floor(Math.random() * BUTTONS.length)].id)}
            className="group relative overflow-hidden rounded-2xl bg-brand px-4 py-3 font-semibold text-white shadow-lg transition hover:shadow-brand/60"
          >
            <span className="relative z-10">Surprise Me With a Random Call</span>
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/0 opacity-0 transition group-hover:opacity-100" />
          </button>

          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm text-slate-600">
            <p className="font-semibold text-brand">Quick Safety Reminders</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Always unlock P1 E8 Dog Relief for deliveries.</li>
              <li>Never unlock E5 (private residential elevator).</li>
              <li>Redirect E7 callers to the street exit.</li>
              <li>Record suspicious calls in the log with time and details.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
