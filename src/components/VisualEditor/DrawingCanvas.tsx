import React, { useRef, useState, useEffect } from 'react';
import { HotspotRegion, HotspotShape, HotspotCoords } from '../../types/presentation.types';
import { pixelToPercentage, distance, stringifyPolygonPoints } from '../../utils/coordinateUtils';
import { EditorMode } from './EditorToolbar';
import './DrawingCanvas.css';

interface DrawingCanvasProps {
  imageUrl: string;
  hotspots: HotspotRegion[];
  mode: EditorMode;
  selectedShape: HotspotShape;
  selectedHotspotId: string | null;
  onHotspotsChange: (hotspots: HotspotRegion[]) => void;
  onHotspotSelect: (id: string | null) => void;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  polygonPoints: { x: number; y: number }[];
}

export function DrawingCanvas({
  imageUrl,
  hotspots,
  mode,
  selectedShape,
  selectedHotspotId,
  onHotspotsChange,
  onHotspotSelect
}: DrawingCanvasProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    polygonPoints: []
  });

  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Update image dimensions when image loads
  useEffect(() => {
    const img = imageRef.current;
    if (img) {
      const updateDimensions = () => {
        const rect = img.getBoundingClientRect();
        setImageDimensions({ width: rect.width, height: rect.height });
      };

      img.addEventListener('load', updateDimensions);
      if (img.complete) {
        updateDimensions();
      }

      window.addEventListener('resize', updateDimensions);
      return () => {
        img.removeEventListener('load', updateDimensions);
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [imageUrl]);

  // Handle mouse down - start drawing
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'draw' || !imageRef.current) return;

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    if (selectedShape === 'poly') {
      // Polygon mode - add point
      setDrawingState(prev => ({
        ...prev,
        polygonPoints: [...prev.polygonPoints, coords],
        currentX: coords.x,
        currentY: coords.y
      }));
    } else {
      // Rectangle or Circle - start drawing
      setDrawingState({
        isDrawing: true,
        startX: coords.x,
        startY: coords.y,
        currentX: coords.x,
        currentY: coords.y,
        polygonPoints: []
      });
    }
  };

  // Handle mouse move - update current position
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'draw' || !imageRef.current) return;

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    if (selectedShape === 'poly' && drawingState.polygonPoints.length > 0) {
      // Update preview line for polygon
      setDrawingState(prev => ({
        ...prev,
        currentX: coords.x,
        currentY: coords.y
      }));
    } else if (drawingState.isDrawing) {
      // Update preview for rectangle/circle
      setDrawingState(prev => ({
        ...prev,
        currentX: coords.x,
        currentY: coords.y
      }));
    }
  };

  // Handle mouse up - finish drawing rectangle or circle
  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'draw' || !drawingState.isDrawing || !imageRef.current) return;

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    let newHotspot: HotspotRegion | null = null;

    if (selectedShape === 'rect') {
      const x = Math.min(drawingState.startX, coords.x);
      const y = Math.min(drawingState.startY, coords.y);
      const width = Math.abs(coords.x - drawingState.startX);
      const height = Math.abs(coords.y - drawingState.startY);

      // Only create if size is significant (at least 1% in both dimensions)
      if (width > 1 && height > 1) {
        newHotspot = createHotspot('rect', { x, y, width, height });
      }
    } else if (selectedShape === 'circle') {
      const cx = drawingState.startX;
      const cy = drawingState.startY;
      const r = distance(drawingState.startX, drawingState.startY, coords.x, coords.y);

      // Only create if radius is significant (at least 1%)
      if (r > 1) {
        newHotspot = createHotspot('circle', { cx, cy, r });
      }
    }

    if (newHotspot) {
      onHotspotsChange([...hotspots, newHotspot]);
      onHotspotSelect(newHotspot.id);
    }

    // Reset drawing state
    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      polygonPoints: []
    });
  };

  // Handle double-click - finish polygon
  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'draw' || selectedShape !== 'poly') return;
    if (drawingState.polygonPoints.length < 3) return;

    e.preventDefault();

    const points = stringifyPolygonPoints(drawingState.polygonPoints);
    const newHotspot = createHotspot('poly', { points });

    onHotspotsChange([...hotspots, newHotspot]);
    onHotspotSelect(newHotspot.id);

    // Reset polygon drawing
    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      polygonPoints: []
    });
  };

  // Create a new hotspot with unique ID
  const createHotspot = (shape: HotspotShape, coords: Partial<HotspotCoords>): HotspotRegion => {
    const id = `hotspot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id,
      shape,
      coords: coords as HotspotCoords,
      actionType: 'navigation',
      label: `New ${shape} hotspot`,
      content: {}
    };
  };

  // Handle hotspot click in edit mode
  const handleHotspotClick = (hotspotId: string, e: React.MouseEvent) => {
    if (mode === 'edit') {
      e.stopPropagation();
      onHotspotSelect(hotspotId);
    }
  };

  // Render preview of shape being drawn
  const renderDrawingPreview = () => {
    if (mode !== 'draw') return null;

    if (selectedShape === 'rect' && drawingState.isDrawing) {
      const x = Math.min(drawingState.startX, drawingState.currentX);
      const y = Math.min(drawingState.startY, drawingState.currentY);
      const width = Math.abs(drawingState.currentX - drawingState.startX);
      const height = Math.abs(drawingState.currentY - drawingState.startY);

      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="rgba(130, 70, 175, 0.2)"
          stroke="var(--temenos-energy-violet)"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      );
    }

    if (selectedShape === 'circle' && drawingState.isDrawing) {
      const r = distance(
        drawingState.startX,
        drawingState.startY,
        drawingState.currentX,
        drawingState.currentY
      );

      return (
        <circle
          cx={drawingState.startX}
          cy={drawingState.startY}
          r={r}
          fill="rgba(130, 70, 175, 0.2)"
          stroke="var(--temenos-energy-violet)"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
      );
    }

    if (selectedShape === 'poly' && drawingState.polygonPoints.length > 0) {
      const points = [...drawingState.polygonPoints];
      const pointsStr = stringifyPolygonPoints(points);

      return (
        <>
          {/* Polygon outline */}
          <polyline
            points={pointsStr}
            fill="none"
            stroke="var(--temenos-energy-violet)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />

          {/* Preview line to cursor */}
          {points.length > 0 && (
            <line
              x1={points[points.length - 1].x}
              y1={points[points.length - 1].y}
              x2={drawingState.currentX}
              y2={drawingState.currentY}
              stroke="var(--temenos-energy-violet)"
              strokeWidth="0.3"
              strokeDasharray="1,1"
            />
          )}

          {/* Point markers */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="1"
              fill="var(--temenos-energy-violet)"
            />
          ))}
        </>
      );
    }

    return null;
  };

  // Render existing hotspots
  const renderHotspots = () => {
    return hotspots.map(hotspot => {
      const isSelected = hotspot.id === selectedHotspotId;
      const opacity = mode === 'view' ? 0.3 : 0.4;
      const strokeWidth = isSelected ? '1' : '0.5';

      let element: JSX.Element;

      if (hotspot.shape === 'rect') {
        element = (
          <rect
            x={hotspot.coords.x}
            y={hotspot.coords.y}
            width={hotspot.coords.width}
            height={hotspot.coords.height}
            fill={`rgba(130, 70, 175, ${opacity})`}
            stroke={isSelected ? '#FFD700' : 'var(--temenos-energy-violet)'}
            strokeWidth={strokeWidth}
          />
        );
      } else if (hotspot.shape === 'circle') {
        element = (
          <circle
            cx={hotspot.coords.cx}
            cy={hotspot.coords.cy}
            r={hotspot.coords.r}
            fill={`rgba(130, 70, 175, ${opacity})`}
            stroke={isSelected ? '#FFD700' : 'var(--temenos-energy-violet)'}
            strokeWidth={strokeWidth}
          />
        );
      } else {
        element = (
          <polygon
            points={hotspot.coords.points}
            fill={`rgba(130, 70, 175, ${opacity})`}
            stroke={isSelected ? '#FFD700' : 'var(--temenos-energy-violet)'}
            strokeWidth={strokeWidth}
          />
        );
      }

      return (
        <g
          key={hotspot.id}
          className={`hotspot ${isSelected ? 'selected' : ''}`}
          onClick={(e) => handleHotspotClick(hotspot.id, e)}
          style={{ cursor: mode === 'edit' ? 'pointer' : 'default' }}
        >
          {element}
        </g>
      );
    });
  };

  return (
    <div className="drawing-canvas">
      <div className="canvas-container">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Editor canvas"
          className="canvas-image"
          draggable={false}
        />
        <svg
          ref={svgRef}
          className="canvas-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          style={{
            width: imageDimensions.width,
            height: imageDimensions.height,
            cursor: mode === 'draw' ? 'crosshair' : mode === 'edit' ? 'pointer' : 'default'
          }}
        >
          {renderHotspots()}
          {renderDrawingPreview()}
        </svg>
      </div>

      {mode === 'draw' && selectedShape === 'poly' && drawingState.polygonPoints.length > 0 && (
        <div className="polygon-hint">
          Points: {drawingState.polygonPoints.length} | Double-click to finish
          <button
            onClick={() => setDrawingState(prev => ({
              ...prev,
              polygonPoints: []
            }))}
            className="cancel-polygon"
          >
            ❌ Cancel
          </button>
        </div>
      )}
    </div>
  );
}
