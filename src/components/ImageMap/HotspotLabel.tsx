import { HotspotRegion } from '../../types/presentation.types';

interface HotspotLabelProps {
  hotspot: HotspotRegion;
  imageElement: HTMLImageElement | null;
}

function HotspotLabel({ hotspot, imageElement }: HotspotLabelProps) {
  if (!imageElement) return null;

  // Calculate position based on hotspot shape
  const getPosition = () => {
    const rect = imageElement.getBoundingClientRect();

    if (hotspot.shape === 'rect') {
      const { x = 0, y = 0, width = 0 } = hotspot.coords;
      // Position above the rectangle, centered
      return {
        left: rect.left + (rect.width * (x + width / 2)) / 100,
        top: rect.top + (rect.height * y) / 100 - 40 // 40px above
      };
    }

    if (hotspot.shape === 'circle') {
      const { cx = 0, cy = 0, r = 0 } = hotspot.coords;
      // Position above the circle
      return {
        left: rect.left + (rect.width * cx) / 100,
        top: rect.top + (rect.height * (cy - r)) / 100 - 40
      };
    }

    if (hotspot.shape === 'polygon') {
      // Calculate centroid of polygon for label position
      const { points = '' } = hotspot.coords;
      const coords = points.split(' ').map((pair) => {
        const [x, y] = pair.split(',').map(Number);
        return { x, y };
      });

      if (coords.length > 0) {
        const centroid = coords.reduce(
          (acc, coord) => ({
            x: acc.x + coord.x / coords.length,
            y: acc.y + coord.y / coords.length
          }),
          { x: 0, y: 0 }
        );

        return {
          left: rect.left + (rect.width * centroid.x) / 100,
          top: rect.top + (rect.height * centroid.y) / 100 - 40
        };
      }
    }

    return { left: 0, top: 0 };
  };

  const position = getPosition();

  return (
    <div
      className="hotspot-label"
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 9998
      }}
    >
      {hotspot.label}
    </div>
  );
}

export default HotspotLabel;
