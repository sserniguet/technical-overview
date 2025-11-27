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
 * Different types of hotspot actions
 */
export type HotspotActionType =
  | 'navigation'      // Navigate to another page (existing behavior)
  | 'external-link'   // Open URL in new tab
  | 'tooltip'         // Show hover tooltip with text
  | 'text-popup'      // Click to open text content modal
  | 'image-popup'     // Click to open image modal
  | 'video-popup'     // Click to open video modal (HTML5 player)
  | 'iframe-popup';   // Click to open iframe modal

/**
 * Content configuration for different action types
 */
export interface HotspotContent {
  // For tooltip and text-popup
  text?: string;

  // For external-link
  url?: string;

  // For image-popup
  imageSrc?: string;
  imageAlt?: string;

  // For video-popup
  videoSrc?: string;          // Video URL (MP4, WebM, etc.)
  videoPoster?: string;       // Optional video thumbnail/poster image
  videoAutoplay?: boolean;    // Optional autoplay setting

  // For iframe-popup
  iframeSrc?: string;         // Iframe URL (HTTPS only for security)
  iframeTitle?: string;

  // Popup configuration (for modals)
  popupTitle?: string;
  popupWidth?: 'small' | 'medium' | 'large' | 'fullscreen';
}

/**
 * Clickable region within an image
 */
export interface HotspotRegion {
  id: string;
  shape: HotspotShape;
  coords: HotspotCoords;

  // Action configuration
  actionType: HotspotActionType;

  // Navigation (backward compatible - still used when actionType === 'navigation')
  targetPage?: string;        // Route to navigate to

  // Content for other action types
  content?: HotspotContent;

  // Display properties
  label: string;             // Tooltip/aria-label
  description?: string;      // Optional longer description

  // Visual properties (for highlighting in presentation mode)
  highlightColor?: string;   // Optional custom color for reveal mode
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
