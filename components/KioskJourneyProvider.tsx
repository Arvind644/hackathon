'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { JewelryItem, VirtualTryOnResponse } from '@/lib/types';


type JourneyState = {
  faceImage: string | null;
  setFaceImage: (image: string | null) => void;
  budget: number;
  setBudget: (value: number) => void;
  selectedJewelry: JewelryItem[];
  setSelectedJewelry: (items: JewelryItem[]) => void;
  toggleJewelry: (item: JewelryItem) => void;
  clearSelection: () => void;
  recommendedJewelry: JewelryItem[];
  setRecommendedJewelry: (items: JewelryItem[]) => void;
  toggleRecommendedJewelry: (item: JewelryItem) => void;
  savedLooks: JewelryItem[];
  addSavedLook: (jewelry: JewelryItem[]) => void;
  removeSavedLook: (jewelryId: string) => void;
  sessionId: string;
  lastTryOn: VirtualTryOnResponse | null;
  setLastTryOn: (result: VirtualTryOnResponse | null) => void;
  hydrateComplete: boolean;
};

const STORAGE_KEY = 'kiosk-journey-state-v1';

const KioskJourneyContext = createContext<JourneyState | null>(null);

interface StoredState {
  faceImage: string | null;
  budget: number;
  selectedJewelry: JewelryItem[];
  recommendedJewelry: JewelryItem[];
  savedLooks: JewelryItem[];
  sessionId: string | null;
  lastTryOn: VirtualTryOnResponse | null;
}

const defaultStoredState: StoredState = {
  faceImage: null,
  budget: 1000,
  selectedJewelry: [],
  recommendedJewelry: [],
  savedLooks: [],
  sessionId: null,
  lastTryOn: null,
};

function readStoredState(): StoredState {
  if (typeof window === 'undefined') {
    return defaultStoredState;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultStoredState;
    }
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      faceImage: parsed.faceImage ?? null,
      budget: typeof parsed.budget === 'number' ? parsed.budget : defaultStoredState.budget,
      selectedJewelry: Array.isArray(parsed.selectedJewelry) ? parsed.selectedJewelry : [],
      recommendedJewelry: Array.isArray(parsed.recommendedJewelry) ? parsed.recommendedJewelry : [],
      savedLooks: Array.isArray(parsed.savedLooks) ? parsed.savedLooks : [],
      sessionId: parsed.sessionId ?? null,
      lastTryOn: parsed.lastTryOn ?? null,
    };
  } catch (error) {
    console.warn('Failed to parse kiosk journey session storage', error);
    return defaultStoredState;
  }
}

function persistState(state: StoredState) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist kiosk journey state', error);
  }
}

export default function KioskJourneyProvider({ children }: { children: ReactNode }) {
  const [hydrateComplete, setHydrateComplete] = useState(false);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [budget, setBudgetState] = useState<number>(defaultStoredState.budget);
  const [selectedJewelry, setSelectedJewelryState] = useState<JewelryItem[]>([]);
  const [recommendedJewelry, setRecommendedJewelryState] = useState<JewelryItem[]>([]);
  const [savedLooks, setSavedLooksState] = useState<JewelryItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [lastTryOn, setLastTryOnState] = useState<VirtualTryOnResponse | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = readStoredState();
    setFaceImage(stored.faceImage);
    setBudgetState(stored.budget);
    setSelectedJewelryState(stored.selectedJewelry);
    setRecommendedJewelryState(stored.recommendedJewelry);
    setSavedLooksState(stored.savedLooks);
    setSessionId(stored.sessionId || crypto.randomUUID());
    setLastTryOnState(stored.lastTryOn);
    setHydrateComplete(true);
  }, []);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }

    persistState({
      faceImage,
      budget,
      selectedJewelry,
      recommendedJewelry,
      savedLooks,
      sessionId,
      lastTryOn,
    });
  }, [faceImage, budget, selectedJewelry, recommendedJewelry, savedLooks, sessionId, lastTryOn, hydrateComplete]);

  const setBudget = useCallback((value: number) => {
    setBudgetState(Math.max(0, Math.round(value)));
  }, []);

  const setSelectedJewelry = useCallback((items: JewelryItem[]) => {
    setSelectedJewelryState(() => {
      const unique = new Map<string, JewelryItem>();
      items.forEach(item => {
        unique.set(item.id, item);
      });
      return Array.from(unique.values());
    });
  }, []);

  const toggleJewelry = useCallback((item: JewelryItem) => {
    setSelectedJewelryState(prev => {
      const exists = prev.some(existing => existing.id === item.id);
      if (exists) {
        return prev.filter(existing => existing.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedJewelryState([]);
    setLastTryOnState(null);
  }, []);

  const setRecommendedJewelry = useCallback((items: JewelryItem[]) => {
    setRecommendedJewelryState(() => {
      const unique = new Map<string, JewelryItem>();
      items.forEach(item => {
        unique.set(item.id, item);
      });
      return Array.from(unique.values());
    });
  }, []);

  const toggleRecommendedJewelry = useCallback((item: JewelryItem) => {
    setRecommendedJewelryState(prev => {
      const exists = prev.some(existing => existing.id === item.id);
      if (exists) {
        return prev.filter(existing => existing.id !== item.id);
      }
      return [...prev, item];
    });
  }, []);

  const addSavedLook = useCallback((jewelry: JewelryItem[]) => {
    setSavedLooksState(prev => {
      const newItems = jewelry.filter(item => !prev.some(existing => existing.id === item.id));
      return [...prev, ...newItems];
    });
  }, []);

  const removeSavedLook = useCallback((jewelryId: string) => {
    setSavedLooksState(prev => prev.filter(item => item.id !== jewelryId));
  }, []);

  const setLastTryOn = useCallback((result: VirtualTryOnResponse | null) => {
    setLastTryOnState(result);
  }, []);

  const contextValue = useMemo<JourneyState>(() => ({
    faceImage,
    setFaceImage,
    budget,
    setBudget,
    selectedJewelry,
    setSelectedJewelry,
    toggleJewelry,
    clearSelection,
    recommendedJewelry,
    setRecommendedJewelry,
    toggleRecommendedJewelry,
    savedLooks,
    addSavedLook,
    removeSavedLook,
    sessionId,
    lastTryOn,
    setLastTryOn,
    hydrateComplete,
  }), [faceImage, budget, selectedJewelry, recommendedJewelry, savedLooks, toggleJewelry, setBudget, setSelectedJewelry, setRecommendedJewelry, toggleRecommendedJewelry, addSavedLook, removeSavedLook, clearSelection, sessionId, lastTryOn, setLastTryOn, hydrateComplete]);

  return (
    <KioskJourneyContext.Provider value={contextValue}>
      {children}
    </KioskJourneyContext.Provider>
  );
}

export function useKioskJourney() {
  const context = useContext(KioskJourneyContext);
  if (!context) {
    throw new Error('useKioskJourney must be used within a KioskJourneyProvider');
  }
  return context;
}
