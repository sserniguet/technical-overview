# Enhanced Interactive Hotspot System - Implementation Plan

## Executive Summary

Transform the presentation system's hotspot functionality from navigation-only to a comprehensive interaction system with multiple action types, visual hotspot creation, and presentation mode features. The existing percentage-based SVG overlay architecture already handles resizing correctly - we'll build on this solid foundation.

## Current State Analysis

**Strengths:**
- ✅ Percentage-based coordinates (0-100%) - hotspots already scale with images
- ✅ SVG overlay with `viewBox="0 0 100 100"` - automatic responsive behavior
- ✅ Three shape types (rect, circle, polygon) working well
- ✅ Clean component separation: ImageMap.tsx + HotspotRegion.tsx
- ✅ Modal pattern established in ConfigEditor

**Key Finding:** The resize issue mentioned is actually already solved by the percentage-based coordinate system. The real pain points are manual coordinate entry and limited interaction types.

**Important: Image Format Clarification**
- Users import **PNG images** (screenshots, not SVG graphics)
- The **SVG layer is only for hotspot overlays** - it sits on top of PNG images
- Visual editor will draw hotspots on PNG images using an SVG overlay
- No SVG image creation required from user - they continue using their PNG screenshots

## User Requirements

1. **Multiple Hotspot Action Types:**
   - Navigation (existing) ✓
   - External links (new tab)
   - Tooltips (hover)
   - Text popups (modal)
   - Image popups (modal)
   - Video playback (modal with HTML5 video player)
   - Iframe demos (embedded modal)

2. **Visual Hotspot Editor:**
   - Multi-shape drawing tool (rect/circle/polygon)
   - Click-and-drag to create hotspots on image
   - Edit/move/resize existing hotspots visually
   - Real-time preview

3. **Presentation Mode:**
   - Keyboard shortcut ('H') to reveal all hotspots
   - Show labels/outlines when revealed
   - Quick identification during live demos

---

## Implementation Plan

### Phase 1: Data Model & Type System

**Goal:** Establish foundation with 100% backward compatibility

#### New TypeScript Types (`src/types/presentation.types.ts`)

```typescript
export type HotspotActionType =
  | 'navigation'      // Navigate to page (existing)
  | 'external-link'   // Open URL in new tab
  | 'tooltip'         // Hover tooltip
  | 'text-popup'      // Click for text modal
  | 'image-popup'     // Click for image modal
  | 'video-popup'     // Click for video modal (HTML5 player)
  | 'iframe-popup';   // Click for iframe modal

export interface HotspotContent {
  text?: string;              // For tooltip/text-popup
  url?: string;               // For external-link
  imageSrc?: string;          // For image-popup
  imageAlt?: string;
  videoSrc?: string;          // For video-popup (MP4, WebM, etc.)
  videoPoster?: string;       // Optional video thumbnail/poster image
  videoAutoplay?: boolean;    // Optional autoplay setting
  iframeSrc?: string;         // For iframe-popup (HTTPS only)
  iframeTitle?: string;
  popupTitle?: string;        // Modal title
  popupWidth?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export interface HotspotRegion {
  id: string;
  shape: HotspotShape;
  coords: HotspotCoords;

  // Enhanced action system
  actionType: HotspotActionType;
  targetPage?: string;        // For navigation (backward compat)
  content?: HotspotContent;   // For other types

  label: string;
  description?: string;
  highlightColor?: string;    // For reveal mode
}
```

#### Migration Strategy

Add to `src/utils/configLoader.ts`:
```typescript
function migrateHotspot(hotspot: any): HotspotRegion {
  return {
    ...hotspot,
    actionType: hotspot.actionType || 'navigation',
    content: hotspot.content || {}
  };
}
```

**Files to Modify:**
- `src/types/presentation.types.ts`
- `src/utils/configLoader.ts`
- `src/context/ConfigContext.tsx`

---

### Phase 2: Hotspot Action System

**Goal:** Implement multiple interaction types with modals and tooltips

#### Component Architecture

```
src/components/
├── ImageMap/
│   ├── ImageMap.tsx              [MODIFY] Add modal state, reveal mode
│   ├── HotspotRegion.tsx        [MODIFY] Action dispatcher
│   ├── HotspotTooltip.tsx       [NEW] Hover tooltip
│   ├── HotspotLabel.tsx         [NEW] Reveal mode labels
│   └── ImageMap.css             [MODIFY] New styles
│
└── Modals/
    ├── HotspotModal.tsx         [NEW] Generic modal wrapper
    ├── TextContent.tsx          [NEW] Text renderer
    ├── ImageContent.tsx         [NEW] Image renderer
    ├── VideoContent.tsx         [NEW] HTML5 video player
    ├── IframeContent.tsx        [NEW] Sandboxed iframe
    └── Modals.css               [NEW] Modal styles
```

#### Action Dispatcher Pattern

Update `HotspotRegion.tsx`:
```typescript
const handleClick = () => {
  switch (hotspot.actionType) {
    case 'navigation':
      navigate(hotspot.targetPage);
      break;
    case 'external-link':
      window.open(hotspot.content?.url, '_blank', 'noopener,noreferrer');
      break;
    case 'text-popup':
    case 'image-popup':
    case 'video-popup':
    case 'iframe-popup':
      onOpenModal?.(hotspot);
      break;
  }
};
```

#### Modal Implementation

**HotspotModal.tsx:**
- Four size options: small (600px), medium (900px), large (1200px), fullscreen
- Renders appropriate content based on actionType
- ESC key closes modal
- Reuses existing modal pattern from ConfigEditor

**Iframe Security:**
```typescript
<iframe
  src={hotspot.content?.iframeSrc}
  sandbox="allow-scripts allow-same-origin allow-forms"
  referrerPolicy="no-referrer"
  loading="lazy"
/>
```
- HTTPS-only validation
- Sandbox attributes for security

**Video Player Implementation:**
```typescript
<video controls poster={hotspot.content?.videoPoster} autoPlay={hotspot.content?.videoAutoplay}>
  <source src={hotspot.content?.videoSrc} type="video/mp4" />
  <source src={hotspot.content?.videoSrc?.replace('.mp4', '.webm')} type="video/webm" />
  Your browser does not support the video tag.
</video>
```
- HTML5 video player with native controls
- Support for MP4, WebM formats
- Optional poster image (thumbnail before play)
- Optional autoplay when modal opens
- Pause video when modal closes

**Files to Create:**
- `src/components/Modals/HotspotModal.tsx`
- `src/components/Modals/TextContent.tsx`
- `src/components/Modals/ImageContent.tsx`
- `src/components/Modals/VideoContent.tsx`
- `src/components/Modals/IframeContent.tsx`
- `src/components/Modals/Modals.css`
- `src/components/ImageMap/HotspotTooltip.tsx`

**Files to Modify:**
- `src/components/ImageMap/HotspotRegion.tsx`
- `src/components/ImageMap/ImageMap.tsx`
- `src/components/ImageMap/ImageMap.css`

---

### Phase 3: ConfigEditor Action Configuration

**Goal:** Enable users to configure all hotspot action types

#### Enhanced Hotspot Editor UI

Add to ConfigEditor hotspot section:

```typescript
<select value={hotspot.actionType} onChange={...}>
  <option value="navigation">🔗 Navigate to Page</option>
  <option value="external-link">🌐 External Link</option>
  <option value="tooltip">💬 Tooltip (Hover)</option>
  <option value="text-popup">📝 Text Popup</option>
  <option value="image-popup">🖼️ Image Popup</option>
  <option value="video-popup">🎥 Video Popup</option>
  <option value="iframe-popup">🎬 Iframe Demo</option>
</select>

{/* Conditional fields based on actionType */}
```

#### Conditional Form Fields

- **navigation:** Target page dropdown
- **external-link:** URL input
- **tooltip/text-popup:** Textarea for text content
- **image-popup:** Image URL + alt text
- **video-popup:** Video URL (MP4/WebM) + optional poster image + autoplay toggle
- **iframe-popup:** HTTPS URL + title + size selector

#### Visual Indicators

Hotspot list shows action type icon:
- 🔗 Navigation
- 🌐 External Link
- 💬 Tooltip
- 📝 Text Popup
- 🖼️ Image Popup
- 🎥 Video Popup
- 🎬 Iframe Popup

**Files to Modify:**
- `src/pages/ConfigEditor.tsx`
- `src/pages/ConfigEditor.css`

---

### Phase 4: Presentation Mode Features

**Goal:** Add keyboard shortcuts and hotspot reveal functionality

#### PresentationContext

Create `src/context/PresentationContext.tsx`:
```typescript
interface PresentationState {
  hotspotsRevealed: boolean;
  toggleHotspots: () => void;
}

// Keyboard handler: 'H' toggles hotspot visibility
```

#### Reveal Mode Visual Design

**When 'H' pressed:**
- All hotspots show visible outline + fill
- Labels appear above each hotspot
- Pulse animation draws attention
- Easy identification for live presentations

**CSS Implementation:**
```css
.hotspot.revealed {
  fill: rgba(130, 70, 175, 0.2);
  stroke: var(--temenos-energy-violet);
  stroke-width: 2;
  animation: pulse-reveal 2s ease-in-out infinite;
}

.hotspot-label {
  background: var(--temenos-warm-blue);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  animation: slideIn 0.3s ease-out;
}
```

#### Label Positioning

Smart positioning based on shape:
- **Rectangle:** Centered above top edge
- **Circle:** Above at top
- **Polygon:** At calculated centroid

**Files to Create:**
- `src/context/PresentationContext.tsx`
- `src/components/ImageMap/HotspotLabel.tsx`

**Files to Modify:**
- `src/components/ImageMap/ImageMap.tsx`
- `src/components/ImageMap/ImageMap.css`
- `src/App.tsx`

---

### Phase 5: Visual Editor - Core Drawing

**Goal:** Implement visual hotspot creation with multi-shape drawing

#### Architecture

```
┌─────────────────────────────────────────┐
│        HotspotEditor Component          │
│  ┌───────────────────────────────────┐  │
│  │    DrawingCanvas (SVG Overlay)    │  │
│  │  • Mouse/touch event tracking     │  │
│  │  • Real-time preview              │  │
│  │  • Pixel → percentage conversion  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    EditorToolbar                  │  │
│  │  • Shape selector                 │  │
│  │  • Mode: Draw | Edit | View       │  │
│  │  • Delete/Duplicate controls      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### Coordinate Conversion (Critical)

```typescript
function pixelToPercentage(
  pixelX: number,
  pixelY: number,
  imageElement: HTMLImageElement
): { x: number; y: number } {
  const rect = imageElement.getBoundingClientRect();
  const x = ((pixelX - rect.left) / rect.width) * 100;
  const y = ((pixelY - rect.top) / rect.height) * 100;

  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y))
  };
}
```

#### Drawing Workflows

**Rectangle:**
1. `mousedown`: Capture start (x, y)
2. `mousemove`: Calculate width/height from cursor
3. `mouseup`: Finalize

**Circle:**
1. `mousedown`: Set center (cx, cy)
2. `mousemove`: Calculate radius from center to cursor
3. `mouseup`: Finalize

**Polygon:**
1. `click`: Add point to array
2. `mousemove`: Preview line from last point
3. `double-click` or `Enter`: Complete polygon

**Files to Create:**
- `src/components/ImageMap/HotspotEditor.tsx`
- `src/components/ImageMap/DrawingCanvas.tsx`
- `src/components/ImageMap/EditorToolbar.tsx`
- `src/utils/coordinateUtils.ts`

---

### Phase 6: Visual Editor - Edit Mode

**Goal:** Enable visual editing of existing hotspots

#### Edit Operations

- **Select:** Click hotspot to select
- **Move:** Drag entire hotspot
- **Resize:**
  - Rectangles: Drag corner/edge handles
  - Circles: Drag radius handle
  - Polygons: Drag individual points
- **Delete:** Delete key or button
- **Duplicate:** Ctrl+D

#### Visual Feedback

- Selected hotspot shows colored outline
- Edit handles at key points (circles)
- Hover states on handles
- Ghosted preview during drag

**Files to Modify:**
- `src/components/ImageMap/HotspotEditor.tsx`
- `src/components/ImageMap/DrawingCanvas.tsx`

---

### Phase 7: Visual Editor Integration

**Goal:** Integrate visual editor into ConfigEditor

#### Implementation

Add to ConfigEditor:
```typescript
<button onClick={() => setShowVisualEditor(true)}>
  🎨 Visual Editor
</button>

{showVisualEditor && (
  <div className="modal-overlay">
    <div className="modal-content modal-fullscreen">
      <HotspotEditor
        imageSrc={selectedPage.image}
        hotspots={selectedPage.hotspots}
        onSave={(newHotspots) => {
          updatePage(selectedPageIndex, { hotspots: newHotspots });
          setShowVisualEditor(false);
        }}
        onCancel={() => setShowVisualEditor(false)}
      />
    </div>
  </div>
)}
```

**Files to Modify:**
- `src/pages/ConfigEditor.tsx`
- `src/pages/ConfigEditor.css`

---

### Phase 8: Polish & Refinement

**Goal:** Production-ready UX and edge case handling

#### Tasks

1. Loading states for images in modals
2. Error handling for iframe failures
3. Tooltip positioning (avoid screen edges)
4. Hotspot preview in ConfigEditor list
5. Performance optimization (React.memo, debounce)
6. Mobile responsiveness
7. Touch device support for visual editor
8. Accessibility improvements

---

## Implementation Order

### Recommended Approach: MVP First (16-20 hours)

**Week 1:**
1. **Phase 1:** Data model foundation (2-3 hours)
2. **Phase 2:** Action system with modals (4-5 hours)
3. **Phase 4:** Presentation mode (2-3 hours)
4. **Phase 3:** ConfigEditor updates (3-4 hours)
5. **Phase 8:** Critical polish (2-3 hours)

**Result:** Fully functional multi-action hotspot system with keyboard shortcuts

**Week 2 (Optional Enhancement):**
6. **Phase 5:** Visual editor drawing (6-8 hours)
7. **Phase 6:** Visual editor editing (4-5 hours)
8. **Phase 7:** Visual editor integration (2-3 hours)

**Result:** Complete visual hotspot creation workflow

### Alternative: Complete Feature Set (26-35 hours)
Implement all phases in sequence for full system at once.

---

## Critical Files Summary

### Must Modify (Foundation)
1. `src/types/presentation.types.ts` - Core type definitions
2. `src/utils/configLoader.ts` - Migration logic
3. `src/components/ImageMap/ImageMap.tsx` - Main component
4. `src/components/ImageMap/HotspotRegion.tsx` - Interaction logic
5. `src/pages/ConfigEditor.tsx` - Configuration UI

### Must Create (New Features)
6. `src/components/Modals/HotspotModal.tsx` - Modal system
7. `src/components/Modals/[Content].tsx` - Content renderers
8. `src/context/PresentationContext.tsx` - Keyboard shortcuts
9. `src/components/ImageMap/HotspotEditor.tsx` - Visual editor (Phase 5+)

---

## Key Technical Decisions

### Why Percentage Coordinates Work
- SVG `viewBox="0 0 100 100"` creates normalized space
- `preserveAspectRatio="none"` allows SVG to stretch
- Coordinates automatically scale with container
- No resize calculations needed - pure CSS/SVG

### Security Considerations
- HTTPS-only for iframes
- Sandbox attributes: `allow-scripts allow-same-origin allow-forms`
- `noopener,noreferrer` for external links
- URL validation before rendering

### Performance Strategy
- React.memo for hotspot components
- Debounce mousemove events in editor (16ms)
- Lazy load iframe content
- Optimize re-renders with proper state structure

### Accessibility
- Keyboard navigation (Tab, Enter, Space)
- ARIA labels and roles
- Focus management in modals
- Screen reader support

---

## Success Criteria

✅ **Backward Compatibility:** All existing configs work without modification
✅ **Multiple Action Types:** Support all 7 action types specified (navigation, external-link, tooltip, text-popup, image-popup, video-popup, iframe-popup)
✅ **PNG Image Support:** Users work with PNG screenshots - SVG overlay handles hotspots
✅ **Visual Creation:** Users can create hotspots by drawing on PNG images
✅ **Presentation Mode:** 'H' key reveals all hotspots with labels
✅ **Security:** HTTPS validation and sandboxing for embedded content
✅ **UX:** Intuitive, fast, and accessible for both creation and presentation

---

## Notes

- The existing percentage-based system is ideal - no architectural changes needed
- Visual editor is the most complex feature but highest UX impact
- Phases can be deployed independently for incremental value
- Temenos brand colors maintained throughout (purple, teal, blue)
- **Users work with PNG screenshots** - no SVG creation knowledge required
- Video formats supported: MP4, WebM for broad browser compatibility
- **This plan should be stored in a specification folder** for documentation purposes
