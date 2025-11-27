# Changelog

## Latest Updates - Session 2 (2025-11-27)

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
