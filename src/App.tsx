import { NavLink, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GuardProfileProvider } from './context/GuardProfileContext';
import { DashboardPage } from './pages/DashboardPage';
import { PreAuthorizedPage } from './pages/PreAuthorizedPage';
import { IntercomTrainerPage } from './pages/IntercomTrainerPage';
import { GuardProfileSettings } from './components/GuardProfileSettings';
import { IntercomTrainerPage } from './pages/IntercomTrainerPage';

const navigation = [
  { to: '/', label: 'Contractor Log' },
  { to: '/pre-authorized', label: 'Pre-Authorized Directory' },
codex/create-interactive-3d-intercom-module-6yjwza
  { to: '/intercom', label: 'Intercom Trainer' }
=======
main
];

export default function App() {
  return (
    <GuardProfileProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <div aria-hidden className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,#6366f11a,transparent_60%)]" />
        <Toaster position="top-right" toastOptions={{ style: { background: '#f8fafc', color: '#1e293b' } }} />
        <header className="relative border-b border-slate-200 bg-slate-50/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-brand-muted">
                Security Hub
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">Security Hub Mini</h1>
              <p className="mt-1 text-sm text-slate-500">
                Contractor sign-in backup system for fast, reliable front-desk workflows.
              </p>
            </div>
            <GuardProfileSettings />
          </div>
          <nav className="border-t border-slate-200/60">
            <div className="mx-auto flex max-w-7xl gap-2 px-6 py-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition hover:bg-slate-100 ${
                      isActive ? 'bg-brand text-white shadow-soft' : 'text-slate-500'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </header>
        <main className="relative mx-auto max-w-7xl px-6 py-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pre-authorized" element={<PreAuthorizedPage />} />
codex/create-interactive-3d-intercom-module-6yjwza
            <Route path="/intercom" element={<IntercomTrainerPage />} />
            <Route path="/intercom-trainer" element={<IntercomTrainerPage />} />
 main
          </Routes>
        </main>
      </div>
    </GuardProfileProvider>
  );
}
