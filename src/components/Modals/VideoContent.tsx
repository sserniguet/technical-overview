import { useEffect, useRef } from 'react';
import { HotspotRegion } from '../../types/presentation.types';

interface VideoContentProps {
  hotspot: HotspotRegion;
  onClose: () => void;
}

function VideoContent({ hotspot, onClose }: VideoContentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when modal closes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, [onClose]);

  return (
    <div className="video-content">
      <video
        ref={videoRef}
        controls
        poster={hotspot.content?.videoPoster}
        autoPlay={hotspot.content?.videoAutoplay}
        style={{ width: '100%', maxHeight: '70vh' }}
      >
        <source src={hotspot.content?.videoSrc} type="video/mp4" />
        <source
          src={hotspot.content?.videoSrc?.replace('.mp4', '.webm')}
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoContent;
