import { useState, useEffect, useRef } from 'react';
import { HotspotRegion } from '../../types/presentation.types';

interface HotspotTooltipProps {
  hotspot: HotspotRegion;
  visible: boolean;
  mousePosition: { x: number; y: number };
}

function HotspotTooltip({ hotspot, visible, mousePosition }: HotspotTooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();

    // Position tooltip above and to the right of cursor
    let x = mousePosition.x + 15;
    let y = mousePosition.y - tooltipRect.height - 10;

    // Prevent tooltip from going off-screen
    const padding = 10;
    if (x + tooltipRect.width > window.innerWidth - padding) {
      x = mousePosition.x - tooltipRect.width - 15;
    }
    if (y < padding) {
      y = mousePosition.y + 20;
    }

    setPosition({ x, y });
  }, [visible, mousePosition]);

  if (!visible || hotspot.actionType !== 'tooltip') return null;

  const tooltipText = hotspot.content?.text || hotspot.description || hotspot.label;

  return (
    <div
      ref={tooltipRef}
      className="hotspot-tooltip"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        pointerEvents: 'none'
      }}
    >
      {tooltipText}
    </div>
  );
}

export default HotspotTooltip;
