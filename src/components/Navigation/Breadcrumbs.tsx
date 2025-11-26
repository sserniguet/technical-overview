import { Link } from 'react-router-dom';
import { PageConfig } from '../../types/presentation.types';
import './Navigation.css';

interface BreadcrumbsProps {
  breadcrumbs: PageConfig[];
}

/**
 * Breadcrumb navigation showing the current page hierarchy
 */
export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  if (breadcrumbs.length <= 1) {
    // Don't show breadcrumbs if we're on the home page
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((page, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={page.id} className="breadcrumbs-item">
              {!isLast ? (
                <>
                  <Link to={page.path} className="breadcrumbs-link">
                    {page.title}
                  </Link>
                  <span className="breadcrumbs-separator" aria-hidden="true">
                    /
                  </span>
                </>
              ) : (
                <span className="breadcrumbs-current" aria-current="page">
                  {page.title}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
