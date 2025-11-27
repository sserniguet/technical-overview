import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PresentationContextType {
  hotspotsRevealed: boolean;
  toggleHotspots: () => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

interface PresentationProviderProps {
  children: ReactNode;
}

export function PresentationProvider({ children }: PresentationProviderProps) {
  const [hotspotsRevealed, setHotspotsRevealed] = useState(false);

  const toggleHotspots = () => {
    setHotspotsRevealed((prev) => !prev);
  };

  // Global keyboard handler for 'H' key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger on 'H' key, not when in input fields
      if (
        e.key === 'h' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        toggleHotspots();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <PresentationContext.Provider value={{ hotspotsRevealed, toggleHotspots }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}
