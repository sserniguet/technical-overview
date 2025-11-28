import React from 'react';
import { HotspotShape } from '../../types/presentation.types';
import './EditorToolbar.css';

export type EditorMode = 'draw' | 'edit' | 'view';

interface EditorToolbarProps {
  mode: EditorMode;
  selectedShape: HotspotShape;
  onModeChange: (mode: EditorMode) => void;
  onShapeChange: (shape: HotspotShape) => void;
  onSave: () => void;
  onCancel: () => void;
  canSave: boolean;
}

export function EditorToolbar({
  mode,
  selectedShape,
  onModeChange,
  onShapeChange,
  onSave,
  onCancel,
  canSave
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <div className="toolbar-section">
        <label>Mode:</label>
        <div className="button-group">
          <button
            className={mode === 'draw' ? 'active' : ''}
            onClick={() => onModeChange('draw')}
            title="Draw new hotspots"
          >
            ✏️ Draw
          </button>
          <button
            className={mode === 'edit' ? 'active' : ''}
            onClick={() => onModeChange('edit')}
            title="Edit existing hotspots"
          >
            🖊️ Edit
          </button>
          <button
            className={mode === 'view' ? 'active' : ''}
            onClick={() => onModeChange('view')}
            title="View only"
          >
            👁️ View
          </button>
        </div>
      </div>

      {mode === 'draw' && (
        <div className="toolbar-section">
          <label>Shape:</label>
          <div className="button-group">
            <button
              className={selectedShape === 'rect' ? 'active' : ''}
              onClick={() => onShapeChange('rect')}
              title="Draw rectangle"
            >
              ⬜ Rectangle
            </button>
            <button
              className={selectedShape === 'circle' ? 'active' : ''}
              onClick={() => onShapeChange('circle')}
              title="Draw circle"
            >
              ⭕ Circle
            </button>
            <button
              className={selectedShape === 'poly' ? 'active' : ''}
              onClick={() => onShapeChange('poly')}
              title="Draw polygon"
            >
              🔷 Polygon
            </button>
          </div>
        </div>
      )}

      <div className="toolbar-section toolbar-hints">
        {mode === 'draw' && selectedShape === 'rect' && (
          <span>💡 Click and drag to draw a rectangle</span>
        )}
        {mode === 'draw' && selectedShape === 'circle' && (
          <span>💡 Click center, then drag to set radius</span>
        )}
        {mode === 'draw' && selectedShape === 'poly' && (
          <span>💡 Click to add points, double-click to finish</span>
        )}
        {mode === 'edit' && (
          <span>💡 Click hotspot to select, drag to move, use handles to resize</span>
        )}
        {mode === 'view' && (
          <span>💡 View mode - no editing allowed</span>
        )}
      </div>

      <div className="toolbar-section toolbar-actions">
        <button
          className="btn-save"
          onClick={onSave}
          disabled={!canSave}
          title="Save changes"
        >
          ✅ Save
        </button>
        <button
          className="btn-cancel"
          onClick={onCancel}
          title="Cancel and close"
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );
}
