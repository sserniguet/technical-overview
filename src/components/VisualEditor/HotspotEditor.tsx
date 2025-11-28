import React, { useState, useRef, useEffect } from 'react';
import { HotspotRegion, HotspotShape } from '../../types/presentation.types';
import { EditorToolbar, EditorMode } from './EditorToolbar';
import { DrawingCanvas } from './DrawingCanvas';
import { pixelToPercentage, distance, parsePolygonPoints, stringifyPolygonPoints } from '../../utils/coordinateUtils';
import './HotspotEditor.css';

interface HotspotEditorProps {
  imageUrl: string;
  initialHotspots: HotspotRegion[];
  onSave: (hotspots: HotspotRegion[]) => void;
  onCancel: () => void;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | 'radius';

interface EditState {
  isDragging: boolean;
  isResizing: boolean;
  resizeHandle: ResizeHandle | null;
  startX: number;
  startY: number;
  initialCoords: any;
  editingPolygonPoint: number | null;
}

export function HotspotEditor({
  imageUrl,
  initialHotspots,
  onSave,
  onCancel
}: HotspotEditorProps) {
  const [mode, setMode] = useState<EditorMode>('draw');
  const [selectedShape, setSelectedShape] = useState<HotspotShape>('rect');
  const [hotspots, setHotspots] = useState<HotspotRegion[]>(initialHotspots);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({
    isDragging: false,
    isResizing: false,
    resizeHandle: null,
    startX: 0,
    startY: 0,
    initialCoords: null,
    editingPolygonPoint: null
  });

  const imageRef = useRef<HTMLImageElement>(null);

  const selectedHotspot = hotspots.find(h => h.id === selectedHotspotId);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'edit' && selectedHotspotId) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          handleDelete();
        } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          handleDuplicate();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, selectedHotspotId, hotspots]);

  // Delete selected hotspot
  const handleDelete = () => {
    if (!selectedHotspotId) return;

    setHotspots(hotspots.filter(h => h.id !== selectedHotspotId));
    setSelectedHotspotId(null);
  };

  // Duplicate selected hotspot
  const handleDuplicate = () => {
    if (!selectedHotspot) return;

    const duplicated: HotspotRegion = {
      ...selectedHotspot,
      id: `hotspot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: `${selectedHotspot.label} (copy)`
    };

    // Offset the duplicate slightly
    if (duplicated.shape === 'rect') {
      duplicated.coords = {
        ...duplicated.coords,
        x: Math.min(95, (duplicated.coords.x || 0) + 2),
        y: Math.min(95, (duplicated.coords.y || 0) + 2)
      };
    } else if (duplicated.shape === 'circle') {
      duplicated.coords = {
        ...duplicated.coords,
        cx: Math.min(95, (duplicated.coords.cx || 0) + 2),
        cy: Math.min(95, (duplicated.coords.cy || 0) + 2)
      };
    } else if (duplicated.shape === 'poly') {
      const points = parsePolygonPoints(duplicated.coords.points || '');
      const offsetPoints = points.map(p => ({
        x: Math.min(98, p.x + 2),
        y: Math.min(98, p.y + 2)
      }));
      duplicated.coords = {
        ...duplicated.coords,
        points: stringifyPolygonPoints(offsetPoints)
      };
    }

    setHotspots([...hotspots, duplicated]);
    setSelectedHotspotId(duplicated.id);
  };

  // Start dragging to move hotspot
  const handleMoveStart = (e: React.MouseEvent, hotspot: HotspotRegion) => {
    if (mode !== 'edit' || !imageRef.current) return;

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    setEditState({
      isDragging: true,
      isResizing: false,
      resizeHandle: null,
      startX: coords.x,
      startY: coords.y,
      initialCoords: { ...hotspot.coords },
      editingPolygonPoint: null
    });
  };

  // Start resizing hotspot
  const handleResizeStart = (e: React.MouseEvent, hotspot: HotspotRegion, handle: ResizeHandle) => {
    if (mode !== 'edit' || !imageRef.current) return;

    e.stopPropagation();

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    setEditState({
      isDragging: false,
      isResizing: true,
      resizeHandle: handle,
      startX: coords.x,
      startY: coords.y,
      initialCoords: { ...hotspot.coords },
      editingPolygonPoint: null
    });
  };

  // Start editing polygon point
  const handlePolygonPointStart = (e: React.MouseEvent, pointIndex: number) => {
    if (mode !== 'edit' || !imageRef.current || !selectedHotspot) return;

    e.stopPropagation();

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);

    setEditState({
      isDragging: false,
      isResizing: false,
      resizeHandle: null,
      startX: coords.x,
      startY: coords.y,
      initialCoords: { ...selectedHotspot.coords },
      editingPolygonPoint: pointIndex
    });
  };

  // Handle mouse move during edit operations
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!editState.isDragging && !editState.isResizing && editState.editingPolygonPoint === null) return;
    if (!selectedHotspot || !imageRef.current) return;

    const coords = pixelToPercentage(e.clientX, e.clientY, imageRef.current);
    const deltaX = coords.x - editState.startX;
    const deltaY = coords.y - editState.startY;

    let updatedCoords = { ...selectedHotspot.coords };

    if (editState.isDragging) {
      // Move hotspot
      if (selectedHotspot.shape === 'rect') {
        updatedCoords.x = Math.max(0, Math.min(100 - (updatedCoords.width || 0), (editState.initialCoords.x || 0) + deltaX));
        updatedCoords.y = Math.max(0, Math.min(100 - (updatedCoords.height || 0), (editState.initialCoords.y || 0) + deltaY));
      } else if (selectedHotspot.shape === 'circle') {
        updatedCoords.cx = Math.max(0, Math.min(100, (editState.initialCoords.cx || 0) + deltaX));
        updatedCoords.cy = Math.max(0, Math.min(100, (editState.initialCoords.cy || 0) + deltaY));
      } else if (selectedHotspot.shape === 'poly') {
        const points = parsePolygonPoints(editState.initialCoords.points || '');
        const movedPoints = points.map(p => ({
          x: Math.max(0, Math.min(100, p.x + deltaX)),
          y: Math.max(0, Math.min(100, p.y + deltaY))
        }));
        updatedCoords.points = stringifyPolygonPoints(movedPoints);
      }
    } else if (editState.isResizing && editState.resizeHandle) {
      // Resize hotspot
      if (selectedHotspot.shape === 'rect') {
        updatedCoords = resizeRectangle(editState.initialCoords, editState.resizeHandle, coords);
      } else if (selectedHotspot.shape === 'circle') {
        const newRadius = distance(
          editState.initialCoords.cx || 0,
          editState.initialCoords.cy || 0,
          coords.x,
          coords.y
        );
        updatedCoords.r = Math.max(1, Math.min(50, newRadius));
      }
    } else if (editState.editingPolygonPoint !== null) {
      // Edit polygon point
      const points = parsePolygonPoints(selectedHotspot.coords.points || '');
      points[editState.editingPolygonPoint] = {
        x: Math.max(0, Math.min(100, coords.x)),
        y: Math.max(0, Math.min(100, coords.y))
      };
      updatedCoords.points = stringifyPolygonPoints(points);
    }

    // Update hotspot
    setHotspots(hotspots.map(h =>
      h.id === selectedHotspotId ? { ...h, coords: updatedCoords } : h
    ));
  };

  // Resize rectangle helper
  const resizeRectangle = (initial: any, handle: ResizeHandle, coords: { x: number; y: number }) => {
    const result = { ...initial };

    switch (handle) {
      case 'nw':
        result.x = Math.min(coords.x, initial.x + initial.width - 1);
        result.y = Math.min(coords.y, initial.y + initial.height - 1);
        result.width = initial.width + (initial.x - result.x);
        result.height = initial.height + (initial.y - result.y);
        break;
      case 'ne':
        result.y = Math.min(coords.y, initial.y + initial.height - 1);
        result.width = Math.max(1, coords.x - initial.x);
        result.height = initial.height + (initial.y - result.y);
        break;
      case 'sw':
        result.x = Math.min(coords.x, initial.x + initial.width - 1);
        result.width = initial.width + (initial.x - result.x);
        result.height = Math.max(1, coords.y - initial.y);
        break;
      case 'se':
        result.width = Math.max(1, coords.x - initial.x);
        result.height = Math.max(1, coords.y - initial.y);
        break;
      case 'n':
        result.y = Math.min(coords.y, initial.y + initial.height - 1);
        result.height = initial.height + (initial.y - result.y);
        break;
      case 's':
        result.height = Math.max(1, coords.y - initial.y);
        break;
      case 'e':
        result.width = Math.max(1, coords.x - initial.x);
        break;
      case 'w':
        result.x = Math.min(coords.x, initial.x + initial.width - 1);
        result.width = initial.width + (initial.x - result.x);
        break;
    }

    return result;
  };

  // Handle mouse up - end edit operation
  const handleMouseUp = () => {
    setEditState({
      isDragging: false,
      isResizing: false,
      resizeHandle: null,
      startX: 0,
      startY: 0,
      initialCoords: null,
      editingPolygonPoint: null
    });
  };

  const handleSave = () => {
    onSave(hotspots);
  };

  const hasChanges = JSON.stringify(hotspots) !== JSON.stringify(initialHotspots);

  return (
    <div className="hotspot-editor">
      <EditorToolbar
        mode={mode}
        selectedShape={selectedShape}
        onModeChange={setMode}
        onShapeChange={setSelectedShape}
        onSave={handleSave}
        onCancel={onCancel}
        canSave={hasChanges}
      />

      <div
        className="editor-content"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <DrawingCanvas
          imageUrl={imageUrl}
          hotspots={hotspots}
          mode={mode}
          selectedShape={selectedShape}
          selectedHotspotId={selectedHotspotId}
          onHotspotsChange={setHotspots}
          onHotspotSelect={setSelectedHotspotId}
        />

        {mode === 'edit' && selectedHotspot && (
          <EditOverlay
            hotspot={selectedHotspot}
            onMoveStart={handleMoveStart}
            onResizeStart={handleResizeStart}
            onPolygonPointStart={handlePolygonPointStart}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        )}
      </div>

      {mode === 'edit' && selectedHotspot && (
        <div className="editor-info">
          <strong>Selected:</strong> {selectedHotspot.label}
          <span className="editor-shortcuts">
            Delete: DEL | Duplicate: Ctrl+D
          </span>
        </div>
      )}
    </div>
  );
}

// Edit overlay component for resize handles and controls
interface EditOverlayProps {
  hotspot: HotspotRegion;
  onMoveStart: (e: React.MouseEvent, hotspot: HotspotRegion) => void;
  onResizeStart: (e: React.MouseEvent, hotspot: HotspotRegion, handle: ResizeHandle) => void;
  onPolygonPointStart: (e: React.MouseEvent, pointIndex: number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function EditOverlay({
  hotspot,
  onMoveStart,
  onResizeStart,
  onPolygonPointStart,
  onDelete,
  onDuplicate
}: EditOverlayProps) {
  // This would render resize handles based on hotspot shape
  // For now, return null - full implementation would go here
  return null;
}
