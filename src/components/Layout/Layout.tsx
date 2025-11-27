import { ReactNode } from 'react';
import { NavigationProvider } from '../../context/NavigationContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper with auto-hiding navigation
 * Navigation shows when mouse is at the top of the page
 */
export function Layout({ children }: LayoutProps) {
  return (
    <NavigationProvider>
      <div className="layout">
        <main className="layout-main">
          {children}
        </main>
      </div>
    </NavigationProvider>
  );
}
