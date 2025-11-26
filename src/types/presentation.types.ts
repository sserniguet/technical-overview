/**
 * Shape types for clickable hotspot regions
 */
export type HotspotShape = 'rect' | 'circle' | 'polygon';

/**
 * Coordinates for different hotspot shapes (percentage-based 0-100)
 */
export interface HotspotCoords {
  // For rectangle
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // For circle
  cx?: number;  // center x
  cy?: number;  // center y
  r?: number;   // radius

  // For polygon
  points?: string; // e.g., "10,10 20,20 30,10"
}

/**
 * Clickable region within an image
 */
export interface HotspotRegion {
  id: string;
  shape: HotspotShape;
  coords: HotspotCoords;
  targetPage: string;        // Route to navigate to
  label: string;             // Tooltip/aria-label
  description?: string;      // Optional longer description
}

/**
 * Configuration for a single presentation page
 */
export interface PageConfig {
  id: string;
  path: string;              // Route path (e.g., "/architecture")
  title: string;
  description?: string;
  image: string;             // Path relative to /public/images
  hotspots: HotspotRegion[];
  parent?: string;           // Parent page ID for breadcrumbs
  showInNav: boolean;        // Show in main navigation menu
}

/**
 * Main presentation configuration structure
 */
export interface PresentationConfig {
  pages: PageConfig[];
}
