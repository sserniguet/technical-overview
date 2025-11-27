import { PresentationConfig, PageConfig, HotspotRegion } from '../types/presentation.types';
import presentationData from '../config/presentation.json';

/**
 * Migrate old hotspot format to new format for backward compatibility
 */
function migrateHotspot(hotspot: any): HotspotRegion {
  return {
    ...hotspot,
    // Default to 'navigation' if actionType is not specified (backward compatibility)
    actionType: hotspot.actionType || 'navigation',
    // Initialize content object if not present
    content: hotspot.content || {}
  };
}

/**
 * Load and validate the presentation configuration
 */
export function loadPresentationConfig(): PresentationConfig {
  const config = presentationData as PresentationConfig;

  // Basic validation
  if (!config.pages || !Array.isArray(config.pages)) {
    throw new Error('Invalid configuration: pages array is required');
  }

  if (config.pages.length === 0) {
    throw new Error('Invalid configuration: at least one page is required');
  }

  // Validate and migrate each page
  config.pages.forEach((page, index) => {
    if (!page.id || !page.path || !page.title || !page.image) {
      throw new Error(
        `Invalid configuration: page at index ${index} is missing required fields (id, path, title, or image)`
      );
    }

    if (page.showInNav === undefined) {
      throw new Error(
        `Invalid configuration: page '${page.id}' is missing showInNav property`
      );
    }

    if (!Array.isArray(page.hotspots)) {
      throw new Error(
        `Invalid configuration: page '${page.id}' hotspots must be an array`
      );
    }

    // Migrate hotspots to new format for backward compatibility
    page.hotspots = page.hotspots.map(migrateHotspot);
  });

  return config;
}

/**
 * Get a page by its path
 */
export function getPageByPath(config: PresentationConfig, path: string): PageConfig | undefined {
  return config.pages.find((page) => page.path === path);
}

/**
 * Get a page by its ID
 */
export function getPageById(config: PresentationConfig, id: string): PageConfig | undefined {
  return config.pages.find((page) => page.id === id);
}

/**
 * Get all pages that should show in navigation
 */
export function getNavPages(config: PresentationConfig): PageConfig[] {
  return config.pages.filter((page) => page.showInNav);
}

/**
 * Build breadcrumb trail for a page
 */
export function getBreadcrumbs(config: PresentationConfig, pageId: string): PageConfig[] {
  const breadcrumbs: PageConfig[] = [];
  let currentPage = getPageById(config, pageId);

  while (currentPage) {
    breadcrumbs.unshift(currentPage);
    if (currentPage.parent) {
      currentPage = getPageById(config, currentPage.parent);
    } else {
      currentPage = undefined;
    }
  }

  return breadcrumbs;
}
