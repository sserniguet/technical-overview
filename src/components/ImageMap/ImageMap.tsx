import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HotspotRegion as HotspotRegionType } from '../../types/presentation.types';
import { HotspotRegion } from './HotspotRegion';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleHotspotClick = (targetPage: string) => {
    navigate(targetPage);
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
        >
          {hotspots.map((hotspot) => (
            <HotspotRegion
              key={hotspot.id}
              hotspot={hotspot}
              onClick={() => handleHotspotClick(hotspot.targetPage)}
            />
          ))}
        </svg>
      )}
      {!imageLoaded && !imageError && (
        <div className="image-map-loading">
          <p>Loading image...</p>
        </div>
      )}
    </div>
  );
}
