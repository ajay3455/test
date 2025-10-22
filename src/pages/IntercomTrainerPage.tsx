import { IntercomTrainer } from '../components/intercom/IntercomTrainer';

export function IntercomTrainerPage() {
  return (
    <div className="space-y-10">
      <div className="max-w-4xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-muted">Training Lab</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Intercom Response Simulator</h2>
        <p className="mt-2 text-sm text-slate-600">
          Practise the exact workflow for The Gloucester on Yonge’s parking and elevator intercom. Click a button on the
          3D directory to trigger a call, follow the prompts on the screen, and respond using the Talk, Unlock, and End
          controls.
        </p>
      </div>
      <IntercomTrainer />
    </div>
  );
}
