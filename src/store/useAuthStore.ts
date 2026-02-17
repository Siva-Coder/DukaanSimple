import { create } from 'zustand';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { subscribeToAuthChanges } from '../services/authService';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  initializing: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setInitializing: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user }),
  setInitializing: (value) => set({ initializing: value }),
}));

// Initialize auth listener once
export const initAuthListener = () => {
  const setUser = useAuthStore.getState().setUser;
  const setInitializing = useAuthStore.getState().setInitializing;

  return subscribeToAuthChanges((user) => {
    setUser(user);
    setInitializing(false);
  });
};