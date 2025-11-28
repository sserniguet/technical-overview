import { HotspotCoords } from '../types/presentation.types';

/**
 * Convert pixel coordinates to percentage (0-100)
 */
export function pixelToPercentage(
  pixelX: number,
  pixelY: number,
  imageElement: HTMLImageElement
): { x: number; y: number } {
  const rect = imageElement.getBoundingClientRect();
  const x = ((pixelX - rect.left) / rect.width) * 100;
  const y = ((pixelY - rect.top) / rect.height) * 100;

  // Clamp to 0-100 range and round to 2 decimal places
  return {
    x: Math.max(0, Math.min(100, Math.round(x * 100) / 100)),
    y: Math.max(0, Math.min(100, Math.round(y * 100) / 100))
  };
}

/**
 * Convert percentage coordinates to pixel
 */
export function percentageToPixel(
  percentX: number,
  percentY: number,
  imageElement: HTMLImageElement
): { x: number; y: number } {
  const rect = imageElement.getBoundingClientRect();
  return {
    x: rect.left + (rect.width * percentX) / 100,
    y: rect.top + (rect.height * percentY) / 100
  };
}

/**
 * Get mouse position relative to image
 */
export function getMousePosition(
  event: MouseEvent | React.MouseEvent,
  imageElement: HTMLImageElement
): { x: number; y: number } {
  return pixelToPercentage(event.clientX, event.clientY, imageElement);
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Round coordinates to specified decimal places
 */
export function roundCoords(coords: HotspotCoords, decimals: number = 2): HotspotCoords {
  const round = (num: number | undefined) =>
    num !== undefined ? Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals) : undefined;

  return {
    x: round(coords.x),
    y: round(coords.y),
    width: round(coords.width),
    height: round(coords.height),
    cx: round(coords.cx),
    cy: round(coords.cy),
    r: round(coords.r),
    points: coords.points
  };
}

/**
 * Parse polygon points string into array of coordinates
 */
export function parsePolygonPoints(points: string): { x: number; y: number }[] {
  if (!points) return [];

  return points.split(' ').map((pair) => {
    const [x, y] = pair.split(',').map(Number);
    return { x, y };
  });
}

/**
 * Convert polygon points array to string
 */
export function stringifyPolygonPoints(points: { x: number; y: number }[]): string {
  return points.map(p => `${Math.round(p.x * 100) / 100},${Math.round(p.y * 100) / 100}`).join(' ');
}

/**
 * Calculate centroid of polygon
 */
export function getPolygonCentroid(points: { x: number; y: number }[]): { x: number; y: number } {
  if (points.length === 0) return { x: 50, y: 50 };

  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 }
  );

  return {
    x: sum.x / points.length,
    y: sum.y / points.length
  };
}
