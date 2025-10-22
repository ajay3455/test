import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CallType, ControlAction, IntercomButtonDefinition, PanelColor, intercomButtons } from './data';

type ToneType = 'call' | 'talk' | 'key' | 'off' | 'error';

type Feedback = {
  tone: 'info' | 'success' | 'warning' | 'error';
  message: string;
};

type StepInstruction = {
  prompt: string;
  script: string;
  caution?: string;
};

type CallFlowDefinition = {
  name: string;
  summary: string;
  steps: ControlAction[];
  instructions: Partial<Record<ControlAction, StepInstruction>>;
  caution?: string;
};

type CallHistoryEntry = {
  id: string;
  callId: string;
  label: string;
  completedAt: string;
  flowName: string;
};

const callFlows: Record<CallType, CallFlowDefinition> = {
  delivery: {
    name: 'Parcel / Delivery Access',
    summary: 'Always release the door for deliveries at P1 E8 Dog Relief, TTC, Ramp and the parcel room.',
    steps: ['talk', 'key', 'off'],
    instructions: {
      talk: {
        prompt: 'Greet the courier and confirm they are delivering to the building.',
        script: '“Delivery or parcel access — you’re clear to enter.”'
      },
      key: {
        prompt: 'Press the key to release the E8 door immediately for delivery access.',
        script: 'Key button held to unlock Elevator E8 door.'
      },
      off: {
        prompt: 'Disconnect once the courier has acknowledged entry.',
        script: '“Door is open. Have a great day.”'
      }
    },
    caution: 'Always unlock P1 E8 Dog Relief for deliveries.'
  },
  resident: {
    name: 'Resident Verification',
    summary: 'Confirm the caller’s unit or name before unlocking the residential E8 door.',
    steps: ['talk', 'key', 'off'],
    instructions: {
      talk: {
        prompt: 'Introduce yourself and ask for the unit number or resident name.',
        script: '“Hi, security here — may I have your unit number?”'
      },
      key: {
        prompt: 'Check the camera if unsure, then unlock the door for the resident.',
        script: '“Thanks! Opening the E8 door for you now.”'
      },
      off: {
        prompt: 'After they confirm access, wrap up the call.',
        script: '“You’re all set. Welcome home.”'
      }
    },
    caution: 'Verify on camera if unsure before unlocking.'
  },
  privateLobby: {
    name: 'Private Lobby (E5)',
    summary: 'The E5 lobby is private. Do not release this door.',
    steps: ['talk', 'off'],
    instructions: {
      talk: {
        prompt: 'Advise the caller that E5 stays locked and redirect them.',
        script: '“This is the private residential lobby. Please follow parking signs to E8 or use the commercial elevator.”'
      },
      off: {
        prompt: 'End the call once they confirm they will move to E8 or E7.',
        script: '“Security signing off.”'
      }
    },
    caution: 'Never unlock E5 (private elevator).'
  },
  commercial: {
    name: 'Commercial Elevator (E7)',
    summary: 'Keep the commercial doors closed. Direct callers to the street exit.',
    steps: ['talk', 'off'],
    instructions: {
      talk: {
        prompt: 'Let the caller know the Yonge Street exit is available.',
        script: '“Please use the Yonge Street exit; the door stays open during daytime. If it’s locked, go to another parking level.”'
      },
      off: {
        prompt: 'Disconnect after ensuring they understand the instructions.',
        script: '“Door will remain closed. Have a good day.”'
      }
    },
    caution: 'Redirect E7 callers to the street exit.'
  },
  loadingDock: {
    name: 'Loading Dock Access',
    summary: 'Confirm the caller requires the loading dock or garage door before opening.',
    steps: ['talk', 'key', 'off'],
    instructions: {
      talk: {
        prompt: 'Confirm who is calling and which door they need opened.',
        script: '“Do you need the loading dock or the garage door opened?”'
      },
      key: {
        prompt: 'Use the key control to open the dock only after confirmation.',
        script: 'Loading dock door opened from desk control.'
      },
      off: {
        prompt: 'End the call and log the visit if required.',
        script: '“Door is open. Please proceed.”'
      }
    },
    caution: 'Record suspicious dock activity with time and details.'
  },
  pool: {
    name: 'Pool Level Call',
    summary: 'No remote door control is available from the desk for the pool.',
    steps: ['talk', 'off'],
    instructions: {
      talk: {
        prompt: 'Confirm the reason for the call and advise no remote door control exists.',
        script: '“There’s no door connected here. What assistance do you need?”'
      },
      off: {
        prompt: 'Wrap up once you have provided guidance or escalated.',
        script: '“Please contact the concierge if you need more help.”'
      }
    },
    caution: 'Record suspicious calls in the log with time and details.'
  },
  other: {
    name: 'Assistance / Unknown',
    summary: 'Gather details before deciding how to help.',
    steps: ['talk', 'off'],
    instructions: {
      talk: {
        prompt: 'Listen carefully and learn what support is needed.',
        script: '“Security here — how may I assist you?”'
      },
      off: {
        prompt: 'Finish once you have provided next steps or escalated.',
        script: '“Thank you. Ending the call now.”'
      }
    },
    caution: 'Escalate unusual requests to the supervisor and document them.'
  }
};

const colorThemes: Record<PanelColor, { panel: string; text: string; border: string; led: string }> = {
  yellow: {
    panel: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-300',
    led: 'bg-amber-400'
  },
  pink: {
    panel: 'bg-pink-100',
    text: 'text-pink-900',
    border: 'border-pink-200',
    led: 'bg-pink-400'
  },
  blue: {
    panel: 'bg-sky-100',
    text: 'text-sky-900',
    border: 'border-sky-200',
    led: 'bg-sky-400'
  },
  green: {
    panel: 'bg-emerald-100',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    led: 'bg-emerald-400'
  },
  orange: {
    panel: 'bg-orange-100',
    text: 'text-orange-900',
    border: 'border-orange-200',
    led: 'bg-orange-400'
  },
  white: {
    panel: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    led: 'bg-slate-200'
  },
  slate: {
    panel: 'bg-slate-700',
    text: 'text-slate-100',
    border: 'border-slate-500',
    led: 'bg-slate-400'
  }
};

const controlButtonStyles: Record<ControlAction, { label: string; icon: JSX.Element }> = {
  talk: {
    label: 'Talk',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3a3 3 0 0 1 3 3v4a3 3 0 1 1-6 0V6a3 3 0 0 1 3-3zm-6 9a6 6 0 0 0 12 0m-6 6v3m-4 0h8"
        />
      </svg>
    )
  },
  key: {
    label: 'Unlock',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.5V11a4 4 0 0 0-4-4 3.99 3.99 0 0 0-3 1.35A3.99 3.99 0 0 0 11 7a4 4 0 0 0-4 4v1.5m10 0H7m10 0v4a2 2 0 0 1-2 2h-1m-6-6v2.5m0 0L6 17m2-2.5 2 2.5"
        />
      </svg>
    )
  },
  off: {
    label: 'End',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v6m6.36 2.64a9 9 0 1 1-12.72 0" />
      </svg>
    )
  }
};

export function IntercomTrainer() {
  const [activeCall, setActiveCall] = useState<IntercomButtonDefinition | null>(null);
  const [hoveredButton, setHoveredButton] = useState<IntercomButtonDefinition | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [callHistory, setCallHistory] = useState<CallHistoryEntry[]>([]);
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const groupedColumns = useMemo(() => {
    const columns = new Map<number, IntercomButtonDefinition[]>();
    intercomButtons.forEach((button) => {
      const list = columns.get(button.column) ?? [];
      list.push(button);
      columns.set(button.column, list);
    });
    return Array.from(columns.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, buttons]) => buttons.sort((a, b) => a.row - b.row));
  }, []);

  const playTone = useCallback(
    async (type: ToneType) => {
      if (typeof window === 'undefined') return;
      const frequencyMap: Record<ToneType, number> = {
        call: 880,
        talk: 660,
        key: 520,
        off: 420,
        error: 180
      };
      const durationMap: Record<ToneType, number> = {
        call: 0.25,
        talk: 0.18,
        key: 0.22,
        off: 0.18,
        error: 0.4
      };
      const context = audioContextRef.current ?? new AudioContext();
      if (context.state === 'suspended') {
        await context.resume();
      }
      audioContextRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type === 'error' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequencyMap[type], context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(type === 'error' ? 0.4 : 0.28, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationMap[type]);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + durationMap[type] + 0.08);
    },
    []
  );

  const setTimedFeedback = useCallback((value: Feedback | null) => {
    if (feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current);
    }
    if (value) {
      feedbackTimeout.current = setTimeout(() => setFeedback(null), 7000);
    }
    setFeedback(value);
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeout.current) {
        clearTimeout(feedbackTimeout.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleCallButtonClick = (button: IntercomButtonDefinition) => {
    if (activeCall && activeCall.id !== button.id) {
      setTimedFeedback({
        tone: 'warning',
        message: 'You are already handling a call. Finish it before answering another line.'
      });
      void playTone('error');
      return;
    }

    setActiveCall(button);
    setHoveredButton(button);
    setCurrentStepIndex(0);
    const flow = callFlows[button.callType];
    setTimedFeedback({
      tone: 'info',
      message: `Incoming call from ${button.location}. ${flow.summary}`
    });
    void playTone('call');
  };

  const handleControlPress = (action: ControlAction) => {
    if (!activeCall) {
      setTimedFeedback({ tone: 'warning', message: 'Press a lit call button to start a simulation.' });
      void playTone('error');
      return;
    }

    const flow = callFlows[activeCall.callType];
    const expectedAction = flow.steps[currentStepIndex];

    if (action !== expectedAction) {
      const instruction = expectedAction ? flow.instructions[expectedAction] : undefined;
      setTimedFeedback({
        tone: 'warning',
        message: instruction
          ? `Not yet. Next step: ${instruction.prompt}`
          : 'Follow the highlighted step shown on the display.'
      });
      void playTone('error');
      return;
    }

    setTimedFeedback({
      tone: 'success',
      message: flow.instructions[action]?.prompt ?? 'Step completed.'
    });

    setCurrentStepIndex((prev) => prev + 1);
    void playTone(action);

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= flow.steps.length) {
      const entry: CallHistoryEntry = {
        id: `${activeCall.id}-${Date.now()}`,
        callId: activeCall.id,
        label: `${activeCall.label}${activeCall.subLabel ? ` – ${activeCall.subLabel}` : ''}`,
        completedAt: new Date().toISOString(),
        flowName: flow.name
      };
      setCallHistory((prev) => [entry, ...prev].slice(0, 8));
      setTimeout(() => {
        setActiveCall(null);
        setCurrentStepIndex(0);
      }, 400);
    }
  };

  const displayButton = activeCall ?? hoveredButton;
  const displayFlow = displayButton ? callFlows[displayButton.callType] : null;
  const nextAction = activeCall ? callFlows[activeCall.callType].steps[currentStepIndex] : null;

  const getControlState = (action: ControlAction) => {
    if (!activeCall) return 'idle';
    const flow = callFlows[activeCall.callType];
    if (flow.steps.slice(0, currentStepIndex).includes(action)) return 'complete';
    return flow.steps[currentStepIndex] === action ? 'active' : 'pending';
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr),320px]">
        <div>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center" style={{ perspective: '1800px' }}>
              <div
                className="relative w-full max-w-md rounded-[2.5rem] bg-slate-900 p-6 text-slate-100 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.6)]"
                style={{ transform: 'rotateY(-12deg) rotateX(3deg)', transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 rounded-[2.5rem] border border-slate-700/60"></div>
                <div className="space-y-6">
                  <div className="grid grid-cols-10 gap-1 rounded-xl bg-slate-950/80 p-3 shadow-inner">
                    {Array.from({ length: 50 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full bg-slate-800 shadow-[0_0_4px_rgba(15,23,42,0.8)]"
                      />
                    ))}
                  </div>
                  <div className="rounded-2xl bg-slate-950/80 p-5 shadow-inner">
                    {displayButton && displayFlow ? (
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-[0.35em] text-brand-muted">Live Call Display</p>
                        <h2 className="text-lg font-semibold text-white">
                          {displayButton.label}
                          {displayButton.subLabel ? <span className="text-brand-muted"> · {displayButton.subLabel}</span> : null}
                        </h2>
                        <p className="text-sm text-slate-300">{displayButton.location}</p>
                        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-sm text-slate-200">
                          <p className="font-medium text-slate-100">{displayFlow.name}</p>
                          <p className="mt-1 text-slate-300">{displayFlow.summary}</p>
                        </div>
                        {activeCall ? (
                          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-sm text-slate-200">
                            {nextAction ? (
                              <>
                                <p className="text-xs uppercase tracking-[0.35em] text-brand-muted">Next Step</p>
                                <p className="mt-1 text-base font-semibold text-white">
                                  {controlButtonStyles[nextAction].label}
                                </p>
                                {displayFlow.instructions[nextAction] ? (
                                  <>
                                    <p className="mt-1 text-slate-300">{displayFlow.instructions[nextAction]?.prompt}</p>
                                    <p className="mt-2 rounded-lg bg-slate-800/60 p-2 text-xs text-slate-200">
                                      {displayFlow.instructions[nextAction]?.script}
                                    </p>
                                  </>
                                ) : null}
                                {displayFlow.caution ? (
                                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
                                    {displayFlow.caution}
                                  </p>
                                ) : null}
                                <p className="mt-3 text-xs text-slate-400">
                                  Step {currentStepIndex + 1} of {displayFlow.steps.length}
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-base font-semibold text-emerald-400">Call complete</p>
                                <p className="mt-2 text-sm text-slate-300">Great job. Await the next call.</p>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-sm text-slate-200">
                            <p className="text-xs uppercase tracking-[0.35em] text-brand-muted">Preview</p>
                            <p className="mt-1 text-slate-300">
                              Click this button to simulate a call. Follow the talk → unlock → off sequence shown here.
                            </p>
                            {displayFlow.caution ? (
                              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                                {displayFlow.caution}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3 text-center text-slate-300">
                        <p className="text-xs uppercase tracking-[0.35em] text-brand-muted">Standby</p>
                        <p className="text-sm text-slate-400">
                          Press any call button on the directory pads to start a guided simulation. The panel will light up and
                          walk you through the correct response.
                        </p>
                        <p className="text-xs text-slate-500">Use TALK → UNLOCK → END buttons below to respond.</p>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['talk', 'key', 'off'] as ControlAction[]).map((action) => {
                      const state = getControlState(action);
                      const isDisabled = !activeCall;
                      return (
                        <button
                          key={action}
                          type="button"
                          onClick={() => handleControlPress(action)}
                          className={`group relative flex flex-col items-center justify-center gap-2 rounded-full border border-slate-800/70 bg-slate-800/80 p-4 text-center text-sm font-semibold uppercase tracking-[0.25em] transition focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-slate-900 ${
                            state === 'active'
                              ? 'shadow-[0_0_18px_rgba(59,130,246,0.45)] ring-2 ring-sky-400'
                              : state === 'complete'
                              ? 'text-emerald-300'
                              : ''
                          } ${isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-slate-700/80'}`}
                          aria-pressed={state === 'active'}
                          aria-disabled={isDisabled}
                        >
                          <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-inner ${state === 'active' ? 'ring-4 ring-sky-400/70' : ''}`}>
                            {controlButtonStyles[action].icon}
                          </span>
                          <span>{controlButtonStyles[action].label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {groupedColumns.map((column, index) => (
                <div
                  key={index}
                  className="w-full max-w-[10.5rem] rounded-[2.25rem] bg-slate-900/95 p-4 shadow-[0_25px_45px_-20px_rgba(15,23,42,0.6)]"
                  style={{
                    transform: `rotateY(${index === 0 ? -6 : index === 1 ? 0 : 6}deg) rotateX(2deg)`
                  }}
                >
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                    <span>Directory</span>
                    <span>P{index + 1}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {column.map((button) => {
                      const colorTheme = colorThemes[button.color];
                      const isActive = activeCall?.id === button.id;
                      const isPreview = hoveredButton?.id === button.id;
                      return (
                        <button
                          key={button.id}
                          type="button"
                          onClick={() => handleCallButtonClick(button)}
                          onMouseEnter={() => setHoveredButton(button)}
                          onFocus={() => setHoveredButton(button)}
                          onMouseLeave={() => setHoveredButton((prev) => (prev?.id === button.id ? null : prev))}
                          onBlur={() => setHoveredButton((prev) => (prev?.id === button.id ? null : prev))}
                          className={`relative flex flex-col items-start gap-1 rounded-2xl border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                            colorTheme.panel
                          } ${colorTheme.text} ${colorTheme.border} ${
                            isActive
                              ? 'shadow-[0_0_25px_rgba(251,191,36,0.45)] ring-2 ring-amber-300'
                              : isPreview
                              ? 'shadow-inner'
                              : 'shadow'
                          }`}
                        >
                          <span
                            className={`absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full shadow ${
                              isActive ? 'animate-ping bg-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.7)]' : colorTheme.led
                            }`}
                            aria-hidden
                          />
                          <span className="text-sm font-semibold leading-none">{button.label}</span>
                          {button.subLabel ? (
                            <span className="text-[0.65rem] uppercase tracking-[0.25em] opacity-75">{button.subLabel}</span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft">
            <h3 className="text-lg font-semibold text-slate-900">Call Guidance</h3>
            {displayButton && displayFlow ? (
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-900">Location:</span> {displayButton.location}
                </p>
                <p>
                  <span className="font-medium text-slate-900">Workflow:</span> {displayFlow.name}
                </p>
                <p>{displayFlow.summary}</p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Scripted Response</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    {displayFlow.steps.map((step) => (
                      <li key={step} className="rounded-xl bg-white/80 p-2 shadow-inner">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                          {controlButtonStyles[step].label}
                        </p>
                        <p className="mt-1 text-slate-700">{displayFlow.instructions[step]?.prompt}</p>
                        <p className="mt-1 text-xs italic text-slate-500">{displayFlow.instructions[step]?.script}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {displayFlow.caution ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
                    {displayFlow.caution}
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Hover or tap a directory button to preview what to say. Click it to light the panel and practise the full call
                sequence.
              </p>
            )}
          </div>
          {feedback ? (
            <div
              className={`rounded-3xl border p-4 text-sm shadow-soft ${
                feedback.tone === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : feedback.tone === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : feedback.tone === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-800'
                  : 'border-sky-200 bg-sky-50 text-sky-800'
              }`}
            >
              {feedback.message}
            </div>
          ) : null}
          <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Recent Simulations</h3>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Last {callHistory.length}</span>
            </div>
            {callHistory.length ? (
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                {callHistory.map((entry) => (
                  <li key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-semibold text-slate-900">{entry.label}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{entry.flowName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(entry.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Complete a call to see it appear in the log.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
