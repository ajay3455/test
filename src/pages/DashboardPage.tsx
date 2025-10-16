import { ContractorLog } from '../components/dashboard/ContractorLog';
import { SignInForm } from '../components/sign-in/SignInForm';
import { useContractorSignIns } from '../hooks/useContractorSignIns';

export function DashboardPage() {
  const { signIns, loading, error, refresh } = useContractorSignIns();

  return (
    <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
      <SignInForm onSubmitted={refresh} />
      <ContractorLog signIns={signIns} loading={loading} error={error} onRefresh={refresh} />
    </div>
  );
}
