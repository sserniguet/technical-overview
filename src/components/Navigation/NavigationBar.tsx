import { useNavigation } from '../../context/NavigationContext';
import { PageConfig } from '../../types/presentation.types';
import { TopNav } from './TopNav';
import { Breadcrumbs } from './Breadcrumbs';
import './Navigation.css';

interface NavigationBarProps {
  pages: PageConfig[];
  breadcrumbs: PageConfig[];
}

/**
 * Combined navigation bar with top nav and breadcrumbs
 * Top nav shows/hides at top, breadcrumbs on left side
 */
export function NavigationBar({ pages, breadcrumbs }: NavigationBarProps) {
  const { isVisible } = useNavigation();

  return (
    <>
      <div className={`navigation-bar ${isVisible ? 'visible' : 'hidden'}`}>
        <TopNav pages={pages} />
      </div>
      <div className="breadcrumbs-trigger-area">
        <div className="breadcrumbs-sidebar">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
      </div>
    </>
  );
}
