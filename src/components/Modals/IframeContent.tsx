import { useState } from 'react';
import { HotspotRegion } from '../../types/presentation.types';

interface IframeContentProps {
  hotspot: HotspotRegion;
}

function IframeContent({ hotspot }: IframeContentProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Validate HTTPS URL
  const iframeSrc = hotspot.content?.iframeSrc || '';
  const isValidHttps = iframeSrc.startsWith('https://');

  if (!isValidHttps && iframeSrc) {
    return (
      <div className="error-placeholder">
        <p>Error: Only HTTPS URLs are allowed for security reasons.</p>
        <p>URL must start with https://</p>
      </div>
    );
  }

  return (
    <div className="iframe-content">
      {!iframeLoaded && !iframeError && (
        <div className="loading-placeholder">Loading content...</div>
      )}
      {iframeError && (
        <div className="error-placeholder">Failed to load content</div>
      )}
      <iframe
        src={iframeSrc}
        title={hotspot.content?.iframeTitle || hotspot.label}
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIframeLoaded(true)}
        onError={() => setIframeError(true)}
        style={{
          width: '100%',
          height: '70vh',
          border: 'none',
          display: iframeLoaded ? 'block' : 'none'
        }}
      />
    </div>
  );
}

export default IframeContent;
