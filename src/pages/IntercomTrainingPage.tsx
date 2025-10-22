import { IntercomTrainingModule } from '../components/intercom/IntercomTrainingModule';

export function IntercomTrainingPage() {
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-muted">Interactive Training</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Parking & elevator intercom simulator</h1>
        <p className="mt-3 text-base text-slate-600">
          Practice every possible call on a faithful recreation of the Aiphone console. Lights, audio and guided prompts show you
          exactly what to say and which controls to use before the real handset rings.
        </p>
      </header>
      <IntercomTrainingModule />
    </div>
  );
}
