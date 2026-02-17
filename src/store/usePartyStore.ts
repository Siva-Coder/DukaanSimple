import { create } from 'zustand';
import { Party, PartyType } from '../models/Party';
import { subscribeToParties } from '../services/partyService';

interface PartyState {
  customers: Party[];
  suppliers: Party[];
  loading: boolean;
  unsubscribe: (() => void) | null;
  initPartyListener: (type: PartyType) => void;
}

export const usePartyStore = create<PartyState>((set, get) => ({
  customers: [],
  suppliers: [],
  loading: false,
  unsubscribe: null,

  initPartyListener: (type) => {
    const previousUnsubscribe = get().unsubscribe;
    if (previousUnsubscribe) {
      previousUnsubscribe();
    }

    set({ loading: true });

    const unsubscribe = subscribeToParties(type, (parties) => {
      if (type === 'customer') {
        set({ customers: parties, loading: false });
      } else {
        set({ suppliers: parties, loading: false });
      }
    });

    set({ unsubscribe });
  },
}));