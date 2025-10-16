import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { GuardProfile } from '../types';

interface GuardProfileContextValue {
  profile: GuardProfile;
  updateProfile: (profile: GuardProfile) => void;
}

const GuardProfileContext = createContext<GuardProfileContextValue | undefined>(undefined);

const defaultProfile: GuardProfile = {
  name: '',
  autoApprove: false
};

export function GuardProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<GuardProfile>('security-hub-mini:guard-profile', defaultProfile);

  return (
    <GuardProfileContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </GuardProfileContext.Provider>
  );
}

export function useGuardProfile() {
  const context = useContext(GuardProfileContext);
  if (!context) {
    throw new Error('useGuardProfile must be used within GuardProfileProvider');
  }
  return context;
}
