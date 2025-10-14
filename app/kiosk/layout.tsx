import type { ReactNode } from 'react';
import KioskJourneyProvider from '@/components/KioskJourneyProvider';

export default function KioskLayout({ children }: { children: ReactNode }) {
  return (
    <KioskJourneyProvider>
      {children}
    </KioskJourneyProvider>
  );
}
