import { PageConfig } from '../types/presentation.types';
import { useConfig } from '../context/ConfigContext';
import { getBreadcrumbs } from '../utils/configLoader';
import { ImageMap } from '../components/ImageMap/ImageMap';
import { NavigationBar } from '../components/Navigation/NavigationBar';
import './PresentationPage.css';

interface PresentationPageProps {
  page: PageConfig;
}

/**
 * Generic page component that displays a presentation page
 * with its image and clickable hotspots
 */
export function PresentationPage({ page }: PresentationPageProps) {
  const { config } = useConfig();
  const breadcrumbs = getBreadcrumbs(config, page.id);

  return (
    <div className="presentation-page">
      <NavigationBar pages={config.pages} breadcrumbs={breadcrumbs} />

      <div className="presentation-page-header">
        <h1 className="presentation-page-title">{page.title}</h1>
        {page.description && (
          <p className="presentation-page-description">{page.description}</p>
        )}
      </div>

      <div className="presentation-page-content">
        <ImageMap
          imageSrc={page.image}
          alt={page.title}
          hotspots={page.hotspots}
        />
      </div>
    </div>
  );
}
