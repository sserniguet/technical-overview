# Features Summary

## Complete Feature List

### 🎨 Visual Configuration Editor

**Core Editing:**
- Add new pages with forms
- Edit page properties (title, description, path, parent)
- Upload images via drag & drop
- Replace existing images
- Create and edit hotspots visually
- Choose shapes (Rectangle, Circle, Polygon)
- Set coordinates with validated inputs (0-100%)
- Link pages through dropdowns
- Real-time preview
- Auto-save with live reload

### 📦 Page Backup & Restore

**Backup System (Replaces Delete):**
- Backup pages instead of permanent deletion
- Store page configuration and image together
- Name backups for easy identification
- Auto-generate unique names if conflicts exist
- View all backups with details

**Restore System:**
- List all available backups
- Preview backup information
- One-click restore
- Smart parent handling (keeps parent if exists, removes if not)
- Preserves all page properties

**Backup Management:**
- Delete backups permanently
- View creation dates
- See page details before restore
- Organized storage in `public/backups/`

### 📤 Export System

**Export to Library (Internal):**
- Export selected pages to internal storage
- Hierarchy-aware selection (select parent = select children)
- Two modes:
  - Export only (keep in current presentation)
  - Export and delete (remove from current + clean up images)
- Stored in `public/exports/`
- List all library exports
- Quick import back to presentation

**Export to External (Download):**
- Download presentations as ZIP files
- Save anywhere on computer
- Share via email, cloud, or file sharing
- Portable, self-contained packages
- Contains:
  - `presentation.json` (configuration)
  - `images/` folder (all images)
- Perfect for:
  - Sharing with colleagues
  - External backups
  - Version control
  - Cross-system transfer

### 📥 Import System

**Import from Library (Internal):**
- View all presentations in library
- See page count and creation date
- One-click import
- Smart conflict resolution
- Merge with current presentation

**Import from External (Upload):**
- Upload ZIP files from anywhere
- Browse local file system
- Supports ZIP files from:
  - Previous exports
  - Other installations
  - Manually created (if valid structure)
- Same smart conflict resolution
- Automatic validation
- Error handling with helpful messages

### 🔧 Smart Conflict Resolution

**Automatic Handling:**
- Page ID conflicts: Auto-rename (e.g., `page-1`, `page-2`)
- Image name conflicts: Unique names (e.g., `image (1).png`)
- Parent references: Keep if exists, remove if not
- Path conflicts: Auto-adjust paths
- Always merge, never replace

### 🗂️ Storage Architecture

**Organized File System:**
```
public/
├── images/           # Current presentation only (efficient)
├── backups/          # Page backups
│   └── {name}/
│       ├── config.json
│       └── {image}
└── exports/          # Library exports
    └── {name}/
        ├── presentation.json
        └── images/
```

**Storage Philosophy:**
- Keep only current presentation images in `public/images/`
- Backups and exports maintain their own image copies
- Efficient disk usage
- Clear organization
- Easy cleanup

### 🎯 Interactive Presentation Features

**Core Presentation:**
- Clickable image maps
- Multiple hotspot shapes
- Responsive design
- Auto-hide navigation
- Breadcrumb trails
- Hierarchical page structure
- Parent-child relationships
- Temenos brand colors

**Navigation:**
- Top navigation bar (auto-hide)
- Click hotspots to navigate
- Breadcrumb navigation
- Back button
- Hierarchical structure

### 🔐 Data Management

**Configuration:**
- JSON-based configuration
- Type-safe with TypeScript
- Automatic validation
- Real-time updates
- Version control friendly

**Images:**
- Support all web formats (PNG, JPG, SVG, GIF, WebP)
- Automatic optimization
- Unique filename generation
- Cleanup of unused images (on export-and-delete)

### 🚀 Development Features

**Development Workflow:**
- Hot Module Replacement
- Two-server architecture (Vite + Express)
- TypeScript for type safety
- React Router for navigation
- REST API for config operations

**Developer Experience:**
- Clear error messages
- Comprehensive logging
- Automatic port management
- File watching
- Fast rebuilds

## API Endpoints

### Configuration
- `GET /api/config` - Load configuration
- `POST /api/config` - Save configuration

### Images
- `GET /api/images` - List available images
- `POST /api/upload-image` - Upload new image

### Backups
- `POST /api/backup` - Backup a page
- `GET /api/backups` - List all backups
- `POST /api/restore-backup` - Restore a backup
- `DELETE /api/backup/:name` - Delete a backup

### Export/Import (Library)
- `POST /api/export-presentation` - Export to library
- `GET /api/exported-presentations` - List library exports
- `POST /api/import-presentation` - Import from library

### Export/Import (External)
- `POST /api/export-presentation-zip` - Download as ZIP
- `POST /api/import-presentation-zip` - Upload ZIP file

## Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router
- CSS (with CSS Variables)

**Backend:**
- Node.js
- Express
- Multer (file uploads)
- JSZip (ZIP handling)

**Development:**
- Hot Module Replacement
- ESLint
- TypeScript checking
- Fast refresh

## Use Cases

1. **Technical Presentations**: Interactive architecture diagrams
2. **Documentation**: Visual documentation with navigation
3. **Training Materials**: Clickable learning paths
4. **Product Demos**: Interactive product tours
5. **System Design**: Architecture visualization
6. **Team Collaboration**: Share presentations as ZIP files
7. **Content Management**: Organize large presentations into focused sets
8. **Version Control**: Backup and restore different versions
9. **Cross-Team Sharing**: Transfer presentations between teams
10. **Offline Storage**: Archive presentations externally

## Key Benefits

✅ **No Manual JSON Editing**: Visual editor for everything
✅ **Safe Operations**: Backup instead of delete
✅ **Flexible Sharing**: Library and external exports
✅ **Smart Automation**: Conflict resolution, unique names
✅ **Portable**: ZIP files work anywhere
✅ **Efficient**: Only current images in main folder
✅ **Professional**: Temenos branding throughout
✅ **Type-Safe**: TypeScript for reliability
✅ **Fast**: Hot reload, optimized builds
✅ **Comprehensive**: Full documentation

## Statistics

- **Total Features**: 40+
- **API Endpoints**: 11
- **File Formats Supported**: 5 (PNG, JPG, SVG, GIF, WebP)
- **Hotspot Shapes**: 3 (Rectangle, Circle, Polygon)
- **Export Options**: 2 (Library, ZIP)
- **Import Options**: 2 (Library, ZIP)
- **Storage Locations**: 3 (images, backups, exports)
- **Dependencies**: Minimal, focused stack
