# Changelog

## Latest Updates - Session 5 (2025-11-28)

### 🎨 UI/UX Improvements

**Enhanced Visual Editor and Configuration Editor Button Styling:**

#### Visual Editor Toolbar Updates
- **Separated Save Functionality**: Split the single Save button into two distinct actions:
  - **💾 Save** (Blue) - Saves changes without closing the editor, allowing continuous editing
  - **✅ Save & Close** (Green) - Saves changes and closes the editor in one action
  - **❌ Cancel** (Red) - Closes without saving (unchanged)
- Updated `EditorToolbar.tsx` to support both `onSave` and `onSaveAndClose` callbacks
- Updated `HotspotEditor.tsx` to handle separate save operations
- Updated `ConfigEditor.tsx` to provide appropriate callbacks for each action

#### Configuration Editor Button Visibility Fix
- **Fixed Invisible Buttons**: Resolved issue where "Visual Editor" and "Add Hotspot" buttons had white text on white background
- Changed both buttons from purple/blue to **green gradient** (`#4caf50` → `#45a049`)
- Added `!important` CSS rules to ensure proper styling override
- Enhanced hover effects with shadow animations
- Applied to buttons in Hotspots section: `.section-header .button-group`

**Files Modified:**
- `src/components/VisualEditor/EditorToolbar.tsx` - Added onSaveAndClose prop and button
- `src/components/VisualEditor/EditorToolbar.css` - Added .btn-save-close styles
- `src/components/VisualEditor/HotspotEditor.tsx` - Implemented handleSaveAndClose
- `src/pages/ConfigEditor.tsx` - Updated HotspotEditor callbacks
- `src/pages/ConfigEditor.css` - Fixed button visibility with green gradient and specific selectors

---

## Session 4 (2025-11-28)

### ✨ Visual Hotspot Editor (Phases 5-7)

**Complete visual drawing system for creating and editing hotspots directly on images!**

#### Visual Editor Features

**Draw Mode - Create Hotspots by Drawing:**
- **Rectangle Drawing**: Click and drag to create rectangular hotspots
- **Circle Drawing**: Click center point, then drag to set radius
- **Polygon Drawing**: Click to add points, double-click to finish shape
- Real-time preview while drawing
- Automatic coordinate conversion (pixel to percentage)
- Smart validation (minimum sizes, bounds checking)

**Edit Mode - Modify Existing Hotspots:**
- **Select**: Click any hotspot to select it
- **Move**: Drag selected hotspot to new position
- **Resize Rectangles**: Drag handles to resize (all 8 directions)
- **Resize Circles**: Drag radius handle to adjust size
- **Edit Polygon Points**: Drag individual polygon vertices
- **Delete**: Press DELETE or BACKSPACE key
- **Duplicate**: Press CTRL+D (CMD+D on Mac)

**View Mode - Preview Only:**
- See all hotspots without editing
- Safe viewing mode

**User Interface:**
- Fullscreen editor with dark theme
- Interactive toolbar with mode switching
- Shape selector (Rectangle, Circle, Polygon)
- Real-time hints and instructions
- Keyboard shortcuts displayed
- Save/Cancel buttons
- Visual feedback (selections, highlights, previews)

#### Technical Implementation

**Phase 5 - Core Drawing System:**

Created comprehensive drawing infrastructure:

```
src/utils/coordinateUtils.ts
```
- `pixelToPercentage()` - Convert mouse coords to percentage (0-100)
- `percentageToPixel()` - Reverse conversion for rendering
- `getMousePosition()` - Helper for mouse event handling
- `distance()` - Calculate distance between points
- `roundCoords()` - Round coordinates to decimal places
- `parsePolygonPoints()` / `stringifyPolygonPoints()` - Polygon data handling
- `getPolygonCentroid()` - Calculate polygon center for labels

```
src/components/VisualEditor/EditorToolbar.tsx + .css
```
- Mode switcher (Draw/Edit/View) with visual feedback
- Shape selector with emoji icons
- Contextual hints based on active tool
- Save/Cancel actions
- Responsive design

```
src/components/VisualEditor/DrawingCanvas.tsx + .css
```
- SVG overlay system (viewBox="0 0 100 100")
- Mouse event handlers (down, move, up, double-click)
- Drawing state management
- Preview rendering for active drawing
- Hotspot rendering with selection states
- Polygon point tracking and preview lines
- Auto-sizing to image dimensions

**Phase 6 - Edit Functionality:**

```
src/components/VisualEditor/HotspotEditor.tsx + .css
```
- Main editor component orchestrating all features
- Edit state management (dragging, resizing, point editing)
- Keyboard shortcut handlers (DELETE, CTRL+D)
- Move hotspot implementation
- Resize rectangle with 8-direction handles
- Resize circle with radius handle
- Edit polygon vertices individually
- Delete and duplicate operations
- Smart coordinate bounds checking
- Offset duplication (prevents exact overlaps)

**Phase 7 - Integration:**

```
src/pages/ConfigEditor.tsx (modified)
```
- Added "✏️ Visual Editor" button in Hotspots section
- Button group layout (Visual Editor + Add Hotspot)
- Modal state management
- Fullscreen modal integration
- Auto-save on hotspot changes
- Pass current page image and hotspots to editor

```
src/pages/ConfigEditor.css (modified)
```
- `.modal-overlay-fullscreen` - Fullscreen black background
- `.btn-visual-editor` - Gradient button with hover effects
- `.button-group` - Flex layout for multiple buttons
- Responsive styles

#### New Components Created

```
src/components/VisualEditor/
├── HotspotEditor.tsx          - Main editor component (state management)
├── HotspotEditor.css          - Editor styles
├── EditorToolbar.tsx          - Toolbar with mode/shape/actions
├── EditorToolbar.css          - Toolbar styles
├── DrawingCanvas.tsx          - SVG canvas with drawing logic
└── DrawingCanvas.css          - Canvas styles

src/utils/
└── coordinateUtils.ts         - Coordinate conversion utilities
```

#### Key Features

- **Zero Manual Coordinate Entry**: Draw everything visually
- **Responsive by Design**: Percentage-based coordinates scale perfectly
- **Intuitive Controls**: Familiar drawing tools (like image editors)
- **Keyboard Shortcuts**: Power user efficiency
- **Real-time Feedback**: See exactly what you're creating
- **Non-destructive**: Cancel button discards changes
- **Auto-save**: Save button immediately persists to config

#### User Experience Improvements

- No more guessing coordinates!
- See hotspots while drawing
- Visual selection with gold highlights
- Contextual instructions in toolbar
- Error prevention (bounds checking, minimum sizes)
- Smooth animations and transitions
- Dark theme reduces eye strain

#### Statistics - Session 4

- **New Components**: 3 (HotspotEditor, EditorToolbar, DrawingCanvas)
- **New Utilities**: 1 file with 8+ helper functions
- **New CSS Files**: 3
- **Code Added**: ~1,200 lines
- **Files Modified**: 3 (ConfigEditor.tsx, ConfigEditor.css, FEATURES_SUMMARY.md)
- **Integration Points**: 1 (Visual Editor button in ConfigEditor)

---

## Previous Updates - Session 3 (2025-11-27)

### 🎯 Enhanced Hotspot System with Multiple Action Types

**Completely revamped hotspot functionality with 7 different interaction types:**

#### New Hotspot Action Types

1. **🔗 Navigation** - Navigate to other pages (classic behavior, backward compatible)
2. **🌐 External Link** - Open URLs in new tabs with security
3. **💬 Tooltip** - Show quick information on hover (no click required)
4. **📝 Text Popup** - Display detailed text content in modals
5. **🖼️ Image Popup** - Show images in modals with loading states
6. **🎥 Video Popup** - Play videos with HTML5 player (MP4/WebM)
7. **🎬 Iframe Popup** - Embed live demos securely (HTTPS-only)

#### Presentation Mode Feature

**Press 'H' key during presentations to reveal all hotspots!**

- Animated labels appear above each hotspot
- Pulse animation highlights clickable areas
- Perfect for live demonstrations
- Toggle on/off with keyboard shortcut
- Smart label positioning based on shape type

#### Technical Implementation

**Phase 1 - Data Model:**
- New `HotspotActionType` type with 7 action types
- `HotspotContent` interface for action-specific data
- 100% backward compatibility - existing configs work unchanged
- Automatic migration: old hotspots default to 'navigation' type

**Phase 2 - Action System:**
- `HotspotModal` component with dynamic content rendering
- Content renderers: `TextContent`, `ImageContent`, `VideoContent`, `IframeContent`
- `HotspotTooltip` for hover interactions
- Action dispatcher in `ImageMap` component
- Modal styles with Temenos branding
- HTTPS-only validation for iframe security

**Phase 3 - ConfigEditor:**
- Action type selector with emoji indicators
- Conditional form fields per action type
- Visual icons in hotspot headers
- Popup size options (small/medium/large/fullscreen)
- URL validation and security warnings

**Phase 4 - Presentation Context:**
- `PresentationContext` with global keyboard handler
- `HotspotLabel` component with smart positioning
- Reveal mode CSS with pulse animations
- Integration in App.tsx provider chain

#### New Components Created

```
src/components/
├── Modals/
│   ├── HotspotModal.tsx         - Main modal wrapper
│   ├── TextContent.tsx          - Text renderer
│   ├── ImageContent.tsx         - Image renderer with loading
│   ├── VideoContent.tsx         - HTML5 video player
│   ├── IframeContent.tsx        - Sandboxed iframe
│   └── Modals.css               - Modal styling
├── ImageMap/
│   ├── HotspotTooltip.tsx       - Hover tooltip
│   └── HotspotLabel.tsx         - Reveal mode labels
└── context/
    └── PresentationContext.tsx  - Keyboard handler & state
```

#### Security Features

- **HTTPS-only** for iframe sources
- **Sandbox attributes** for iframe isolation
- **noopener,noreferrer** for external links
- **URL validation** before rendering
- **Referrer policy** enforcement

#### User Experience

- **Loading states** for images and iframes
- **Error handling** for failed content
- **Tooltip positioning** avoids screen edges
- **Keyboard accessibility** throughout
- **ARIA labels** for screen readers
- **Responsive design** for all screen sizes

#### Configuration Examples

```json
{
  "actionType": "video-popup",
  "content": {
    "videoSrc": "/videos/demo.mp4",
    "videoPoster": "/images/thumb.png",
    "videoAutoplay": false,
    "popupTitle": "Product Demo",
    "popupWidth": "large"
  }
}
```

### 📝 Documentation Updates

**README.md:**
- Added enhanced hotspot system to Features section
- Added presentation mode keyboard shortcut guide
- Added 7 hotspot type examples with JSON
- Updated action type reference table
- Added "Using During Presentations" section

**specification/enhanced-hotspot-system-plan.md:**
- Complete implementation plan (stored for reference)
- Architecture decisions documented
- Phase-by-phase breakdown
- Technical insights and patterns

**CONFIG_EDITOR_GUIDE.md:**
- (To be updated with action type configuration)

### 🎨 Visual Enhancements

- Action type emojis in ConfigEditor headers
- Pulse animations for revealed hotspots
- Gradient backgrounds for modals and labels
- Smooth transitions and cubic-bezier easing
- Temenos brand colors throughout

### 📊 Statistics - Session 3

- **New TypeScript Types**: 3 (HotspotActionType, HotspotContent, updated HotspotRegion)
- **New Components**: 9 (5 modal content + 2 overlay + 2 context)
- **New Context Providers**: 1 (PresentationContext)
- **Code Added**: ~1,800 lines
- **Files Modified**: 10+
- **Files Created**: 10
- **Backward Compatible**: 100% ✅

---

## Previous Updates - Session 2 (2025-11-27)

### 🌐 External Export & Import via ZIP Files

**New capability to export/import presentations as downloadable ZIP files:**

- **Export to External**: Download presentations as ZIP files to save anywhere
- **Import from External**: Upload ZIP files from local computer
- **Cross-Platform Compatible**: Share presentations between different installations
- **Offline Backups**: Store presentations outside the project folder

**UI Changes:**
- Export modal reorganized with two sections:
  - "Export to Library" (internal storage)
  - "Export to External" (download ZIP)
- Import modal reorganized with two sections:
  - "Import from Library" (internal storage)
  - "Import from External File" (upload ZIP)

**API Endpoints:**
- `POST /api/export-presentation-zip` - Generate and download ZIP file
- `POST /api/import-presentation-zip` - Upload and process ZIP file

**Technical Implementation:**
- Uses JSZip library for ZIP file creation/extraction
- In-memory ZIP generation (no temp files for export)
- Automatic cleanup of uploaded files
- Stream-based file download
- Same conflict resolution as library imports

**ZIP File Structure:**
```
presentation-name.zip
├── presentation.json
└── images/
    ├── image1.png
    ├── image2.svg
    └── ...
```

**Use Cases:**
- Share presentations via email or file sharing
- Create external backups on USB drives or cloud storage
- Transfer presentations between different systems
- Archive presentations with version control
- Collaborate with team members offline

### 📦 New Dependencies

- **jszip** (^3.10.1) - ZIP file handling for exports/imports

---

## Previous Updates - Session 1 (2025-11-27)

### 🎯 Major Features Added

#### 1. Page Backup & Restore System

**Replaces page deletion with a safer backup approach:**

- **Backup Pages**: Instead of deleting, pages are archived with their images
- **Restore Backups**: Bring back archived pages anytime
- **Smart Parent Handling**: Automatically handles missing parent pages on restore
- **Delete Backups**: Permanently remove backups when no longer needed

**UI Changes:**
- Delete button (×) replaced with Backup button (📦) in sidebar
- New "📦 Backups" button in header
- Backup modal shows all backups with restore/delete options

**API Endpoints:**
- `POST /api/backup` - Backup a page with its image
- `GET /api/backups` - List all backups
- `POST /api/restore-backup` - Restore a backup
- `DELETE /api/backup/:name` - Delete a backup

**File Structure:**
```
public/backups/
└── {backup-name}/
    ├── config.json
    └── {image-file}
```

#### 2. Presentation Export & Import System

**Export selected pages to standalone presentations:**

- **Export Presentation**: Create standalone presentation packages
- **Import Presentation**: Merge exported presentations back
- **Hierarchy-Aware Selection**: Auto-select/deselect child pages with parents
- **Export & Delete**: Clean up current presentation after export
- **Smart Conflict Resolution**: Auto-rename conflicting IDs and images

**UI Changes:**
- New "📤 Export" button in header
- New "📥 Import" button in header
- Export modal with page selection tree
- Import modal with presentation list

**API Endpoints:**
- `POST /api/export-presentation` - Export selected pages
- `GET /api/exported-presentations` - List exported presentations
- `POST /api/import-presentation` - Import a presentation

**File Structure:**
```
public/exports/
└── {presentation-name}/
    ├── presentation.json
    └── images/
        └── {image-files}
```

**Key Features:**
- Parent-child auto-selection in export
- Unique name generation for duplicates
- Image cleanup when using "Export and Delete"
- ID conflict resolution on import
- Merge presentations (doesn't replace current)

### 📝 Documentation Updates

**README.md:**
- Added backup/restore features to Features section
- Added export/import features to Features section
- Updated project structure with new folders
- Updated two-server architecture description

**CONFIG_EDITOR_GUIDE.md:**
- Added comprehensive backup/restore guide
- Added export/import workflow documentation
- Added 4 example workflows
- Updated API endpoints section
- Updated file locations with storage philosophy
- Added technical details about new features

### 🗂️ File Organization Strategy

**Efficient Image Management:**
- `public/images/` - Only current presentation images
- `public/backups/` - Backed up pages with their images
- `public/exports/` - Exported presentations with their images

This keeps the main presentation lean while preserving archived content.

### 🔧 Technical Implementation

**Backend (server.js):**
- 7 new API endpoints for backup/export/import
- Unique name generation utility (Windows-style numbering)
- Smart image cleanup on export-and-delete
- Conflict resolution for imports

**Frontend (ConfigEditor.tsx):**
- 3 new modals (Backups, Export, Import)
- Hierarchy-aware page selection logic
- State management for selections
- Enhanced UI with new buttons

**Styling (ConfigEditor.css):**
- Modal styles for all new dialogs
- Export/import button styles
- Page selection checkboxes
- Responsive design for mobile

### 🚀 Use Cases

1. **Safe Experimentation**: Backup pages before major changes
2. **Content Organization**: Split large presentations into focused topics
3. **Content Reuse**: Export common pages for use across presentations
4. **Collaboration**: Share exported presentations as packages
5. **Version Control**: Keep backups of different versions

### 📊 Statistics - Session 2

- **New API Endpoints**: 2 (ZIP export/import)
- **New Dependencies**: 1 (jszip)
- **UI Updates**: Enhanced export/import modals
- **Code Added**: ~200 lines (backend + frontend)

### 📊 Statistics - Session 1

- **New API Endpoints**: 7 (backup/restore, export/import)
- **New UI Components**: 3 modals
- **New Features**: 2 major systems
- **Code Added**: ~700 lines (backend + frontend)
- **Documentation Updated**: 2 files significantly enhanced

### 📊 Cumulative Statistics

- **Total New API Endpoints**: 9
- **Total New Features**: 3 major systems
- **Total Code Added**: ~900 lines
- **New Dependencies**: 1 (jszip)
- **Documentation Files**: 3 (README, CONFIG_EDITOR_GUIDE, CHANGELOG)

---

## Previous Features

### Core Presentation System
- Interactive clickable images with hotspots
- Multiple hotspot shapes (rect, circle, polygon)
- Responsive design with Temenos branding
- Hierarchical page navigation
- Breadcrumb navigation

### Visual Configuration Editor
- Page management (add, edit, configure)
- Image upload and management
- Hotspot creation and editing
- Live preview with auto-reload
- Form-based editing (no JSON required)

### Development Infrastructure
- Two-server architecture (Vite + API)
- Hot Module Replacement
- TypeScript type safety
- React Router for navigation
- Express API server
