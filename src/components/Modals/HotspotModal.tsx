import { useEffect } from 'react';
import { HotspotRegion } from '../../types/presentation.types';
import TextContent from './TextContent';
import ImageContent from './ImageContent';
import VideoContent from './VideoContent';
import IframeContent from './IframeContent';
import './Modals.css';

interface HotspotModalProps {
  hotspot: HotspotRegion;
  onClose: () => void;
}

function HotspotModal({ hotspot, onClose }: HotspotModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Determine modal size based on content
  const modalSize = hotspot.content?.popupWidth || 'medium';

  // Render appropriate content based on action type
  const renderContent = () => {
    switch (hotspot.actionType) {
      case 'text-popup':
        return <TextContent hotspot={hotspot} />;
      case 'image-popup':
        return <ImageContent hotspot={hotspot} />;
      case 'video-popup':
        return <VideoContent hotspot={hotspot} onClose={onClose} />;
      case 'iframe-popup':
        return <IframeContent hotspot={hotspot} />;
      default:
        return <p>Unknown content type</p>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content hotspot-modal modal-${modalSize}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{hotspot.content?.popupTitle || hotspot.label}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default HotspotModal;
