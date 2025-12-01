# Configuration Editor Guide

## 🎨 Visual Configuration Editor

Your presentation now includes a powerful visual configuration editor that makes it easy to manage pages, images, and hotspots without editing JSON files directly!

## 🚀 Getting Started

### Step 1: Start Both Servers

You need to run two servers:
1. **Vite development server** (for the presentation)
2. **API server** (for saving configurations)

**Option A: Run both at once (Recommended)**
```bash
npm run dev:all
```

**Option B: Run separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend API
npm run server
```

### Step 2: Access the Configuration Editor

1. Start your presentation: http://localhost:5173
2. Move your mouse to the top of the page to show the navigation
3. Click the **⚙️ Config** button (green button on the right)
4. The editor opens in a new tab!

## 📋 Features

### ✨ What You Can Do

**Page Management:**
- ✅ Add new pages
- ✅ Edit page properties (title, description, URL path)
- ✅ Select images from dropdown
- ✅ Set parent-child relationships
- ✅ Control navigation visibility
- ✅ Backup pages (replaces delete - safer!)
- ✅ Restore backed up pages

**Hotspot Management:**
- ✅ **Visual Editor**: Draw hotspots directly on images! ⭐ NEW!
- ✅ Add hotspots to any page
- ✅ Choose shape type (Rectangle, Circle, Polygon)
- ✅ Set coordinates visually OR with forms
- ✅ Configure 7 action types (navigation, popups, tooltips, videos, iframes)
- ✅ Move and resize hotspots visually
- ✅ Delete and duplicate hotspots

**Image Management:**
- ✅ Upload new images
- ✅ Preview images
- ✅ Select from existing images
- ✅ Replace existing images

**Presentation Management:**
- ✅ Export presentations to library (internal storage)
- ✅ Export presentations to external (download ZIP)
- ✅ Import presentations from library (internal storage)
- ✅ Import presentations from external (upload ZIP)
- ✅ Hierarchy-aware page selection (auto-select children)
- ✅ Export and delete (clean up after export)
- ✅ Cross-system presentation sharing

**Configuration:**
- ✅ Save changes
- ✅ Auto-refresh presentation
- ✅ Real-time editing in separate window

## 🎯 How to Use

### Adding a New Page

1. Click **"+ Add Page"** in the sidebar
2. The new page appears in the list
3. Click the page to edit it
4. Fill in the details:
   - **Page ID**: Unique identifier (e.g., `my-page`)
   - **URL Path**: Must start with `/` (e.g., `/my-page`)
   - **Title**: Display name (e.g., "My Page")
   - **Description**: Subtitle (optional)
   - **Image**: Select from dropdown
   - **Parent Page**: Set hierarchy (optional)
   - **Show in Navigation**: Check to add to menu

5. Click **"💾 Save Configuration"**

### Adding Hotspots

You can add hotspots in two ways:
1. **Visual Editor** (Recommended) - Draw hotspots directly on images ⭐ NEW!
2. **Manual Entry** - Use forms to enter coordinates

#### Option 1: Visual Editor (Recommended) ⭐ NEW!

The easiest way to create hotspots!

1. Select a page from the sidebar
2. Scroll to the "Hotspots" section
3. Click **"✏️ Visual Editor"** button (green button)
4. The fullscreen Visual Editor opens

**Draw Mode** - Create new hotspots:
- Select a shape from the toolbar (Rectangle, Circle, or Polygon)
- **Rectangle**: Click and drag on the image to draw
- **Circle**: Click the center, then drag to set radius
- **Polygon**: Click to add points, double-click to finish
- Real-time preview shows as you draw
- Coordinates automatically calculated as percentages

**Edit Mode** - Modify existing hotspots:
- Click any hotspot to select it (turns gold)
- **Move**: Drag the hotspot to reposition
- **Resize Rectangle**: Drag corner or edge handles
- **Resize Circle**: Drag the radius handle outward/inward
- **Edit Polygon**: Drag individual vertex points
- **Delete**: Press DELETE or BACKSPACE key
- **Duplicate**: Press CTRL+D (CMD+D on Mac) to create a copy

**View Mode** - Preview only:
- See all hotspots without accidentally editing them

**Toolbar Features:**
- Mode switcher (Draw/Edit/View)
- Shape selector (Rectangle/Circle/Polygon)
- Contextual hints based on active tool
- **💾 Save** button (Blue): Saves changes without closing the editor (allows continuous editing)
- **✅ Save & Close** button (Green): Saves changes and closes the editor
- **❌ Cancel** button (Red): Discards changes and closes editor

**Keyboard Shortcuts:**
- `DELETE` or `BACKSPACE`: Delete selected hotspot
- `CTRL+D` (`CMD+D` on Mac): Duplicate selected hotspot
- `ESC`: Cancel current drawing operation

**Tips:**
- ✅ Draw rectangles at any angle, they'll auto-align
- ✅ Circles automatically snap to reasonable sizes
- ✅ For polygons, click points carefully - double-click to finish
- ✅ All coordinates are responsive (percentage-based)
- ✅ Use View Mode to safely preview without accidental edits

After creating hotspots visually, you can configure their action types (navigation, popup, tooltip, etc.) in the main Config Editor form.

#### Option 2: Manual Entry (Traditional)

1. Select a page from the sidebar
2. Scroll to the "Hotspots" section
3. Click **"+ Add Hotspot"**
4. Configure the hotspot:
   - **Label**: Descriptive name
   - **Shape**: Rectangle, Circle, or Polygon
   - **Target Page**: Where clicking goes
   - **Coordinates**: Position and size (0-100%)

5. Click **"💾 Save Configuration"**

### Hotspot Coordinate System

All coordinates use **percentages (0-100)** for responsiveness:

**Rectangle:**
- **X**: Horizontal position from left (0-100%)
- **Y**: Vertical position from top (0-100%)
- **Width**: Width of rectangle (0-100%)
- **Height**: Height of rectangle (0-100%)

**Circle:**
- **Center X**: Horizontal center position (0-100%)
- **Center Y**: Vertical center position (0-100%)
- **Radius**: Circle size (0-100%)

**Polygon:**
- **Points**: Space-separated x,y pairs
- Format: `"50,10 90,50 50,90 10,50"` (diamond)

### Uploading Images

1. Look for "Upload New Image" section in sidebar
2. Click "Choose File"
3. Select an image (JPG, PNG, SVG, GIF, WebP)
4. Image uploads automatically
5. Now available in the image dropdown for pages

### Backing Up Pages (Replaces Delete)

Instead of deleting pages permanently, you can back them up for safe keeping:

1. In the sidebar, find the page you want to backup
2. Click the **📦** icon next to the page name
3. Enter a backup name (defaults to page ID)
4. Click OK
5. The page is backed up with its image and removed from current presentation

**What happens during backup:**
- Page configuration saved to `public/backups/{name}/config.json`
- Page image copied to `public/backups/{name}/`
- Page removed from current presentation
- Can be restored later

### Restoring Backups

To bring back a backed up page:

1. Click **"📦 Backups"** button in the header
2. View list of all backups with details
3. Click on a backup to select it
4. Click **"↩️ Restore"** button
5. The page is restored to your presentation

**Automatic parent handling:**
- If the parent page still exists → parent relationship maintained
- If parent no longer exists → page restored without parent (top-level)

### Deleting Backups

To permanently delete a backup:

1. Open the Backups modal
2. Select the backup you want to delete
3. Click **"🗑️ Delete"** button
4. Confirm the deletion
5. Both the configuration and image are permanently deleted from the file system

### Exporting Presentations

Export selected pages in two ways:

#### Option 1: Export to Library (Internal Storage)

1. Click **"📤 Export"** button in the header
2. Enter a presentation name (required)
3. Select pages to export:
   - Check individual pages
   - **Selecting a parent auto-selects all its children**
   - **Deselecting a parent auto-deselects all its children**
4. Choose export method:
   - **"📤 Export"**: Exports pages, keeps them in current presentation
   - **"📤 Export and Delete"**: Exports pages AND removes them from current presentation + cleans up unused images

**What gets exported:**
- Selected pages and their configuration
- All images used by selected pages
- Stored in `public/exports/{name}/` folder
- Self-contained presentation with `presentation.json` and `images/` folder

**Export and Delete behavior:**
- Pages removed from current presentation
- Images deleted from `public/images/` if not used by remaining pages
- Keeps your current presentation lean and focused

#### Option 2: Export to External (Download ZIP)

Download presentation as a ZIP file to save anywhere on your computer:

1. Click **"📤 Export"** button in the header
2. Enter a presentation name (required)
3. Select pages to export (same as library export)
4. Click **"💾 Download ZIP"** button
5. Browser downloads `{name}.zip` to your Downloads folder

**What gets downloaded:**
- ZIP file named `{presentation-name}.zip`
- Contains `presentation.json` file
- Contains `images/` folder with all images
- Self-contained, portable package

**Use cases:**
- **Share with others**: Email or share via file services
- **External backups**: Save to USB drives, external disks, or cloud storage
- **Version control**: Keep timestamped versions outside project
- **Cross-system transfer**: Move presentations between installations
- **Offline storage**: Archive presentations anywhere

**ZIP Structure:**
```
my-presentation.zip
├── presentation.json
└── images/
    ├── architecture.png
    ├── diagram.svg
    └── ...
```

### Importing Presentations

Import presentations in two ways:

#### Option 1: Import from Library (Internal Storage)

1. Click **"📥 Import"** button in the header
2. View list of available exported presentations
3. Select the presentation you want to import
4. Click **"📥 Import Selected Presentation"**
5. Pages and images are imported into current presentation

**Smart conflict handling:**
- If page IDs conflict, automatically renamed (e.g., `page-1`, `page-2`)
- If image names conflict, unique names generated (e.g., `image (1).png`)
- All pages added to current presentation (merge, not replace)

#### Option 2: Import from External File (Upload ZIP)

Import a presentation from a ZIP file stored anywhere on your computer:

1. Click **"📥 Import"** button in the header
2. In the "Import from External File" section
3. Click **"📁 Choose ZIP File"**
4. Select a ZIP file from your computer
5. System validates, extracts, and imports the presentation

**What happens during import:**
- ZIP file validated (must contain `presentation.json`)
- Images extracted from `images/` folder
- Images copied to `public/images/` with unique names if needed
- Page IDs checked for conflicts and renamed if necessary
- All pages added to current presentation

**Supported ZIP sources:**
- Previously exported via "Download ZIP"
- Shared by colleagues or team members
- Downloaded from backup storage
- Created by other installations of this system
- Manually created (if following correct structure)

**Smart conflict handling:**
- Same as library imports
- Automatic ID renaming
- Unique image filenames
- Parent relationship preservation (if parent exists)

### Saving Changes

1. Make your edits
2. Click **"💾 Save Configuration"** (top right)
3. Success message appears
4. Vite auto-reloads the presentation
5. Switch to presentation tab to see changes

### Previewing Changes

**Method 1: Separate Windows**
1. Open presentation: http://localhost:5173
2. Open config editor: Click ⚙️ Config button
3. Arrange windows side-by-side
4. Edit → Save → See changes instantly!

**Method 2: Quick Preview Button**
- Click **"🔍 Open Presentation"** button in editor header
- Opens presentation in new tab

## 💡 Tips & Best Practices

### Page Organization

✅ **Use descriptive IDs**: `technology-overview` not `page1`
✅ **Consistent paths**: Start all paths with `/`
✅ **Set parent pages**: Creates breadcrumb navigation
✅ **Show in Nav**: Only for main sections, not detail pages

### Image Management

✅ **Use descriptive filenames**: `architecture-diagram.svg`
✅ **Optimize images**: Keep file sizes reasonable
✅ **Consistent dimensions**: Use same size for all diagrams
✅ **Prefer SVG**: Best quality at any size

### Hotspot Placement

✅ **Test coordinates**: Preview after saving
✅ **Use margins**: Don't go exactly to edges (5-95% recommended)
✅ **Match visual elements**: Align with actual diagram parts
✅ **Label clearly**: Descriptive names help maintenance

### Configuration

✅ **Save often**: Don't lose work!
✅ **Test navigation**: Click through all links
✅ **Check breadcrumbs**: Verify parent relationships
✅ **Mobile test**: Hotspots work on touch devices

## 🔧 Technical Details

### API Endpoints

The configuration editor uses these endpoints:

**Configuration:**
- `GET /api/config` - Load configuration
- `POST /api/config` - Save configuration

**Images:**
- `GET /api/images` - List available images
- `POST /api/upload-image` - Upload new image

**Backups:**
- `POST /api/backup` - Backup a page
- `GET /api/backups` - List all backups
- `POST /api/restore-backup` - Restore a backup
- `DELETE /api/backup/:name` - Delete a backup

**Export/Import (Library):**
- `POST /api/export-presentation` - Export selected pages to library
- `GET /api/exported-presentations` - List exported presentations in library
- `POST /api/import-presentation` - Import from library

**Export/Import (External):**
- `POST /api/export-presentation-zip` - Generate and download ZIP file
- `POST /api/import-presentation-zip` - Upload and process ZIP file

### File Locations

- **Configuration**: `src/config/presentation.json`
- **Images**: `public/images/` (current presentation only)
- **Backups**: `public/backups/{name}/` (page backups)
- **Exports**: `public/exports/{name}/` (exported presentations)
- **API Server**: `server.js` (port 3001)
- **Frontend**: Vite dev server (port 5173)

**Storage Philosophy:**
For efficiency, only images for the current presentation are kept in `public/images/`. Exported and backed up pages maintain their own image copies in their respective folders.

### Auto-Reload

When you save configuration:
1. API writes to `presentation.json`
2. Vite detects file change
3. HMR (Hot Module Replacement) updates
4. Presentation reloads automatically

## 🐛 Troubleshooting

### "Failed to load configuration"

**Problem**: API server not running
**Solution**: Run `npm run server` or `npm run dev:all`

### "Failed to save configuration"

**Problem**: Permission issues or API server down
**Solution**:
1. Check API server is running (port 3001)
2. Check file permissions on `src/config/presentation.json`

### Changes not appearing

**Problem**: Save didn't trigger reload
**Solution**:
1. Make sure you clicked "💾 Save Configuration"
2. Check for error messages
3. Manually refresh presentation (F5)
4. Check browser console for errors

### Image not showing in dropdown

**Problem**: Image in wrong location
**Solution**:
1. Images must be in `public/images/`
2. Refresh the config editor page
3. Check file extension is supported

### Hotspots not clickable

**Problem**: Coordinates outside image bounds
**Solution**:
1. Check coordinates are 0-100
2. Verify image path is correct
3. Test in presentation view

## 🎓 Example Workflows

### Workflow 1: Creating a New Page

1. **Upload your diagram**
   - Click "Choose File" in sidebar
   - Select your image
   - Wait for "Image uploaded" message

2. **Create the page**
   - Click "+ Add Page"
   - Fill in details:
     - ID: `cloud-architecture`
     - Path: `/cloud-architecture`
     - Title: "Cloud Architecture"
     - Description: "Our cloud infrastructure design"
     - Image: Select your uploaded image
     - Parent: None (or select parent)
     - Show in Nav: ✓ Checked

3. **Add hotspots**
   - Click "+ Add Hotspot"
   - Label: "Compute Layer"
   - Shape: Rectangle
   - Coordinates: x=20, y=30, width=30, height=20
   - Target: `/cloud/compute` (link to detail page)
   - Add more hotspots as needed

4. **Save and preview**
   - Click "💾 Save Configuration"
   - Switch to presentation tab
   - Navigate to your new page
   - Test hotspots

5. **Refine**
   - Adjust coordinates if needed
   - Update labels
   - Add more pages/hotspots
   - Save changes

### Workflow 2: Reorganizing Your Presentation

**Scenario**: You want to split your presentation into multiple focused presentations

1. **Export a subset**:
   - Click "📤 Export"
   - Name: "Security Architecture"
   - Select all security-related pages
   - Choose "Export and Delete" to clean up

2. **Export another subset**:
   - Click "📤 Export"
   - Name: "Data Pipeline"
   - Select data-related pages
   - Choose "Export and Delete"

3. **Result**:
   - Current presentation now focused on one topic
   - Other topics saved as separate presentations
   - Can import them back anytime

### Workflow 3: Backing Up Before Major Changes

**Scenario**: You want to experiment with a page but keep the original safe

1. **Backup the original**:
   - Click 📦 icon next to the page
   - Name: "original-architecture-v1"

2. **Make experimental changes**:
   - Edit the page freely
   - Try different images or hotspots
   - Save and test

3. **Decision time**:
   - **Keep changes**: Do nothing, original is safely backed up
   - **Revert**: Click "📦 Backups" → Select backup → "↩️ Restore"

### Workflow 4: Merging Presentations

**Scenario**: You have multiple presentations and want to combine them

1. **Start with one presentation** (current)
2. **Import others**:
   - Click "📥 Import"
   - Select first exported presentation
   - Click import
   - Repeat for other presentations

3. **Organize**:
   - Edit parent relationships to create hierarchy
   - Adjust navigation visibility
   - Save configuration

4. **Result**:
   - All presentations merged
   - Conflicts auto-resolved
   - Single unified presentation

### Workflow 5: Sharing Presentations with Team

**Scenario**: You want to share a presentation with a colleague

1. **Export to ZIP**:
   - Click "📤 Export"
   - Select pages to share
   - Click "💾 Download ZIP"
   - Save `presentation-name.zip`

2. **Share the file**:
   - Email the ZIP file
   - Upload to shared drive
   - Send via messaging app
   - Any file sharing method works

3. **Colleague imports**:
   - Opens their config editor
   - Click "📥 Import"
   - Click "📁 Choose ZIP File"
   - Selects your ZIP file
   - Presentation imported successfully

4. **Result**:
   - Same pages available on both systems
   - Can make independent edits
   - Can re-export and share updates

### Workflow 6: Creating External Backups

**Scenario**: You want to backup your presentation outside the project

1. **Weekly backup routine**:
   - Click "📤 Export"
   - Select all pages (or important ones)
   - Name: `backup-YYYY-MM-DD`
   - Click "💾 Download ZIP"

2. **Store safely**:
   - Copy to external USB drive
   - Upload to personal cloud storage (Dropbox, Google Drive)
   - Store on network drive
   - Keep multiple versions

3. **Restore if needed**:
   - Click "📥 Import"
   - Click "📁 Choose ZIP File"
   - Select backup file
   - Presentation restored

4. **Best practice**:
   - Keep weekly backups
   - Store in multiple locations
   - Test restore occasionally
   - Name with timestamps

## 🚀 Production Deployment

**Before deploying:**

1. Stop the API server (not needed in production)
2. Build the frontend: `npm run build`
3. Deploy only the `dist/` folder
4. Configuration is bundled in the build

**Note**: The config editor is for development only. In production, you'll need to:
- Either rebuild when config changes
- Or set up a backend API for production editing

## 📞 Need Help?

Check these resources:
- **README.md** - Main documentation
- **CONFIGURATION_EXAMPLES.md** - JSON examples
- **CUSTOMIZATION_CHECKLIST.md** - Step-by-step guide
- **Browser Console** - Press F12 to see errors

---

**Happy Editing!** 🎨
