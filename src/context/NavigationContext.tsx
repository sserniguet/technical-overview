import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface NavigationContextType {
  isVisible: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show nav when mouse is within 200px of top (enough space for main nav + breadcrumbs)
      setIsVisible(e.clientY <= 200);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <NavigationContext.Provider value={{ isVisible }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
