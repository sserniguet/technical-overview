import { ReactNode } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { TopNav } from '../Navigation/TopNav';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout wrapper with header, navigation, and footer
 */
export function Layout({ children }: LayoutProps) {
  const { config } = useConfig();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <h1 className="layout-title">Technical Overview</h1>
          <p className="layout-subtitle">Interactive Technical Presentation</p>
        </div>
      </header>

      <TopNav pages={config.pages} />

      <main className="layout-main">
        {children}
      </main>

      <footer className="layout-footer">
        <p>&copy; 2024 Technical Overview. Built with Vite + React</p>
      </footer>
    </div>
  );
}
