import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EmailVerificationState {
  email: string;
  isEmailLoaded: boolean;
  setEmail: (email: string) => void;
  clearEmail: () => void;
  markEmailLoaded: () => void;
}

export const useEmailVerificationStore = create(
  persist<EmailVerificationState>(
    (set) => ({
      email: '',
      isEmailLoaded: false,
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: '', isEmailLoaded: false }),
      markEmailLoaded: () => set({ isEmailLoaded: true }),
    }),
    {
      name: 'verification-email',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.markEmailLoaded();
        }
      },
    }
  )
);
