import { Link, useLocation } from 'react-router-dom';
import { PageConfig } from '../../types/presentation.types';
import './Navigation.css';

interface TopNavProps {
  pages: PageConfig[];
}

/**
 * Top navigation bar showing main navigation links
 */
export function TopNav({ pages }: TopNavProps) {
  const location = useLocation();

  // Filter pages that should show in navigation
  const navPages = pages.filter((page) => page.showInNav);

  return (
    <nav className="top-nav">
      <ul className="top-nav-list">
        {navPages.map((page) => {
          const isActive = location.pathname === page.path;
          return (
            <li key={page.id} className="top-nav-item">
              <Link
                to={page.path}
                className={`top-nav-link ${isActive ? 'active' : ''}`}
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
