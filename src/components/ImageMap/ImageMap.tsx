import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotspotRegion as HotspotRegionType } from '../../types/presentation.types';
import { HotspotRegion } from './HotspotRegion';
import HotspotModal from '../Modals/HotspotModal';
import HotspotTooltip from './HotspotTooltip';
import HotspotLabel from './HotspotLabel';
import { usePresentation } from '../../context/PresentationContext';
import './ImageMap.css';

interface ImageMapProps {
  imageSrc: string;
  alt: string;
  hotspots: HotspotRegionType[];
}

/**
 * Component that renders an image with clickable hotspot regions
 * Uses SVG overlay for responsive, percentage-based coordinates
 */
export function ImageMap({ imageSrc, alt, hotspots }: ImageMapProps) {
  const navigate = useNavigate();
  const { hotspotsRevealed } = usePresentation();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [activeModal, setActiveModal] = useState<HotspotRegionType | null>(null);
  const [tooltipState, setTooltipState] = useState<{
    hotspot: HotspotRegionType | null;
    visible: boolean;
    position: { x: number; y: number };
  }>({
    hotspot: null,
    visible: false,
    position: { x: 0, y: 0 }
  });

  const handleHotspotAction = (hotspot: HotspotRegionType) => {
    switch (hotspot.actionType) {
      case 'navigation':
        if (hotspot.targetPage) {
          navigate(hotspot.targetPage);
        }
        break;

      case 'external-link':
        if (hotspot.content?.url) {
          window.open(hotspot.content.url, '_blank', 'noopener,noreferrer');
        }
        break;

      case 'tooltip':
        // Tooltips are handled on hover, not click
        break;

      case 'text-popup':
      case 'image-popup':
      case 'video-popup':
      case 'iframe-popup':
        setActiveModal(hotspot);
        break;

      default:
        console.warn('Unknown hotspot action type:', hotspot.actionType);
    }
  };

  const handleMouseMove = (e: React.MouseEvent, hotspot: HotspotRegionType) => {
    if (hotspot.actionType === 'tooltip') {
      setTooltipState({
        hotspot,
        visible: true,
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipState({
      hotspot: null,
      visible: false,
      position: { x: 0, y: 0 }
    });
  };

  if (imageError) {
    return (
      <div className="image-map-container">
        <div className="image-map-error">
          <p>Unable to load image: {imageSrc}</p>
          <p className="image-map-error-hint">
            Make sure the image file exists in the public/images directory
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="image-map-container">
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className="presentation-image"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      {imageLoaded && hotspots.length > 0 && (
        <svg
          className="image-map-overlay"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onMouseLeave={handleMouseLeave}
        >
          {hotspots.map((hotspot) => (
            <g
              key={hotspot.id}
              onMouseMove={(e) => handleMouseMove(e as any, hotspot)}
              className={hotspotsRevealed ? 'revealed' : ''}
            >
              <HotspotRegion
                hotspot={hotspot}
                onClick={() => handleHotspotAction(hotspot)}
              />
            </g>
          ))}
        </svg>
      )}
      {!imageLoaded && !imageError && (
        <div className="image-map-loading">
          <p>Loading image...</p>
        </div>
      )}

      {/* Labels when hotspots are revealed */}
      {hotspotsRevealed && imageLoaded && hotspots.map((hotspot) => (
        <HotspotLabel
          key={`label-${hotspot.id}`}
          hotspot={hotspot}
          imageElement={imageRef.current}
        />
      ))}

      {/* Tooltip for hover interactions */}
      {tooltipState.hotspot && (
        <HotspotTooltip
          hotspot={tooltipState.hotspot}
          visible={tooltipState.visible}
          mousePosition={tooltipState.position}
        />
      )}

      {/* Modal for popup interactions */}
      {activeModal && (
        <HotspotModal
          hotspot={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
