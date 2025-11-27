import { HotspotRegion } from '../../types/presentation.types';

interface TextContentProps {
  hotspot: HotspotRegion;
}

function TextContent({ hotspot }: TextContentProps) {
  return (
    <div className="text-content">
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {hotspot.content?.text || hotspot.description || 'No content available'}
      </p>
    </div>
  );
}

export default TextContent;
