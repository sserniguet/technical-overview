import { useState } from 'react';
import { HotspotRegion } from '../../types/presentation.types';

interface ImageContentProps {
  hotspot: HotspotRegion;
}

function ImageContent({ hotspot }: ImageContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="image-content">
      {!imageLoaded && !imageError && (
        <div className="loading-placeholder">Loading image...</div>
      )}
      {imageError && (
        <div className="error-placeholder">Failed to load image</div>
      )}
      <img
        src={hotspot.content?.imageSrc}
        alt={hotspot.content?.imageAlt || hotspot.label}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
    </div>
  );
}

export default ImageContent;
