import { useState } from 'react';
import { HotspotRegion as HotspotRegionType } from '../../types/presentation.types';

interface HotspotRegionProps {
  hotspot: HotspotRegionType;
  onClick: () => void;
}

/**
 * Renders a clickable region (hotspot) on an image using SVG
 * Supports rect, circle, and polygon shapes with hover effects
 */
export function HotspotRegion({ hotspot, onClick }: HotspotRegionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const commonProps = {
    className: `hotspot ${isHovered ? 'hovered' : ''}`,
    onClick,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    onKeyDown: handleKeyDown,
    role: 'button',
    tabIndex: 0,
    'aria-label': hotspot.label,
  };

  // Render rectangle
  if (hotspot.shape === 'rect') {
    const { x = 0, y = 0, width = 0, height = 0 } = hotspot.coords;
    return (
      <rect
        x={`${x}%`}
        y={`${y}%`}
        width={`${width}%`}
        height={`${height}%`}
        {...commonProps}
      >
        <title>{hotspot.label}</title>
      </rect>
    );
  }

  // Render circle
  if (hotspot.shape === 'circle') {
    const { cx = 0, cy = 0, r = 0 } = hotspot.coords;
    return (
      <circle
        cx={`${cx}%`}
        cy={`${cy}%`}
        r={`${r}%`}
        {...commonProps}
      >
        <title>{hotspot.label}</title>
      </circle>
    );
  }

  // Render polygon
  if (hotspot.shape === 'polygon') {
    const { points = '' } = hotspot.coords;
    return (
      <polygon
        points={points}
        {...commonProps}
      >
        <title>{hotspot.label}</title>
      </polygon>
    );
  }

  return null;
}
