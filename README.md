# Interactive Technical Presentation System

An interactive, configuration-driven presentation system for exploring technical concepts through clickable diagrams. Built with React, TypeScript, and Vite, featuring Temenos brand colors.

## Features

- **🎨 Visual Configuration Editor**: Edit pages, upload images, and create hotspots using an intuitive UI - no JSON editing required!
- **📦 Page Backup & Restore**: Backup pages before removing them, restore when needed with automatic parent handling
- **📤 Export/Import Presentations**: Export to internal library or download as ZIP, import from library or upload ZIP files
- **🌐 Cross-System Sharing**: Share presentations via ZIP files, transfer between installations
- **Interactive Clickable Images**: Click on regions of technical diagrams to navigate deeper into concepts
- **Multiple Hotspot Shapes**: Support for rectangles, circles, and polygons
- **Dual Configuration Methods**: Use visual editor OR edit JSON directly
- **Auto-Hide Navigation**: Clean full-screen presentation with mouse-activated menus
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Temenos Branding**: Professional color scheme throughout
- **Dynamic Routing**: Automatic route generation from configuration
- **Breadcrumb Navigation**: Clear hierarchy and easy navigation back up
- **Hot Module Replacement**: Instant updates during development
- **File-based Images**: Simply replace image files or upload via UI

## Table of Contents

- [Installation](#installation)
  - [Option 1: WSL (Linux)](#option-1-wsl-windows-subsystem-for-linux)
  - [Option 2: Native Windows](#option-2-native-windows)
- [Quick Start](#quick-start)
- [Visual Configuration Editor](#visual-configuration-editor) ⭐ NEW!
- [Configuration Guide](#configuration-guide)
  - [Adding New Pages](#adding-new-pages)
  - [Defining Hotspots](#defining-hotspots)
  - [Replacing Images](#replacing-images)
- [Temenos Brand Colors](#temenos-brand-colors)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [Documentation Files](#documentation-files)

---

## Installation

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Option 1: WSL (Windows Subsystem for Linux)

**Recommended for better Node.js performance and Linux compatibility**

#### Step 1: Ensure WSL is Set Up

```bash
# From Windows PowerShell (if WSL not installed)
wsl --install
```

#### Step 2: Install Node.js in WSL

```bash
# Open WSL terminal
# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### Step 3: Clone and Install

```bash
cd /home/sserniguet/technical-overview
npm install
```

#### Step 4: Run Development Servers

**Start both servers at once:**
```bash
npm run dev:all
```

**OR start separately:**
```bash
# Terminal 1
npm run dev        # Frontend at http://localhost:5173

# Terminal 2
npm run server     # API at http://localhost:3001
```

#### Step 5: Access from Windows Browser

- **Presentation**: http://localhost:5173
- **Config Editor**: Click ⚙️ Config button or go to http://localhost:5173/config

WSL automatically forwards ports to Windows.

**Benefits of WSL:**
- Native Linux performance
- Better compatibility with Node.js ecosystem
- Consistent with production Linux environments
- Access files from both Windows and Linux

**Accessing Files from Windows:**
Navigate to: `\\wsl$\Ubuntu\home\sserniguet\technical-overview`

---

### Option 2: Native Windows

**Simpler setup if you prefer Windows native tools**

#### Step 1: Install Node.js

1. Download from https://nodejs.org (LTS version 18+)
2. Run installer with default options
3. Verify installation:

```powershell
node --version
npm --version
```

#### Step 2: Clone and Install

```powershell
cd C:\path\to\technical-overview
npm install
```

#### Step 3: Run Development Servers

**Start both servers at once:**
```powershell
npm run dev:all
```

**OR start separately (two PowerShell windows):**
```powershell
# Window 1
npm run dev        # Frontend at http://localhost:5173

# Window 2
npm run server     # API at http://localhost:3001
```

#### Step 4: Access in Browser

- **Presentation**: http://localhost:5173
- **Config Editor**: Click ⚙️ Config button or go to http://localhost:5173/config

**Benefits of Native Windows:**
- Direct file system access
- Simpler setup
- Native Windows tools and editors
- No VM overhead

---

## Quick Start

### 1. Start the Development Servers

**Two servers are required:**

**Option A: Start Both Servers at Once (Recommended)**
```bash
npm run dev:all
```

**Option B: Start Separately**
```bash
# Terminal 1 - Frontend (Vite)
npm run dev

# Terminal 2 - Backend API (for Config Editor)
npm run server
```

**What's Running:**
- ✅ **Frontend**: http://localhost:5173 - Your presentation
- ✅ **Backend API**: http://localhost:3001 - Config editor API

**Note**: The frontend works standalone, but you need the API server to use the visual configuration editor.

### 2. Explore the Demo

Navigate through the sample pages:
- **System Overview** - Main landing page with clickable architecture and data flow
- **System Architecture** - Detailed component view
- **Data Flow** - Data pipeline visualization
- **Shapes Demo** - Examples of all hotspot types

### 3. Use the Visual Configuration Editor

1. Move mouse to top of screen → Click **⚙️ Config** button
2. Opens in new tab - arrange side-by-side with presentation
3. Add/edit pages, upload images, create hotspots
4. Click **💾 Save Configuration** → See changes instantly!

**OR** Edit configuration manually:

1. Add your images to `public/images/`
2. Update `src/config/presentation.json`
3. The site automatically updates with Hot Module Replacement

---

## Visual Configuration Editor

**NEW!** Edit your presentation visually without touching JSON files!

### Accessing the Editor

1. Start both servers: `npm run dev:all`
2. Open presentation: http://localhost:5173
3. Move mouse to top → Click **⚙️ Config** button
4. Editor opens in new tab

### What You Can Do

- ✅ **Add/Edit Pages**: Create new pages with forms
- ✅ **Upload Images**: Drag & drop image files
- ✅ **Select Images**: Choose from dropdown of uploaded images
- ✅ **Create Hotspots**: Add clickable regions visually
- ✅ **Choose Shapes**: Rectangle, Circle, or Polygon from dropdown
- ✅ **Set Coordinates**: Use number inputs (auto-validated 0-100)
- ✅ **Link Pages**: Select target pages from dropdown
- ✅ **Backup Pages**: Archive pages with images before removing
- ✅ **Restore Backups**: Bring back archived pages with automatic parent handling
- ✅ **Export to Library**: Export selected pages to internal storage
- ✅ **Export to External**: Download presentations as ZIP files
- ✅ **Import from Library**: Import from internal storage
- ✅ **Import from External**: Upload and import ZIP files from anywhere
- ✅ **Cross-System Transfer**: Share presentations between installations
- ✅ **Save & Preview**: Instant refresh in presentation window

### Features

- **User-Friendly Forms**: No JSON syntax to remember
- **Image Preview**: See selected images before saving
- **Dropdown Lists**: All options pre-populated
- **Validation**: Coordinates auto-checked
- **Live Preview**: Arrange windows side-by-side to see changes instantly
- **Upload Support**: Add new images without file system access

### Full Guide

See **CONFIG_EDITOR_GUIDE.md** for complete documentation including:
- Step-by-step tutorials
- Coordinate system explained
- Tips & best practices
- Troubleshooting guide

---

## Configuration Guide

**Note**: You can edit configuration using the visual editor above OR manually edit the JSON file.

All content is managed through a single JSON file: `src/config/presentation.json`

### Adding New Pages

Add a new page object to the `pages` array:

```json
{
  "id": "my-new-page",
  "path": "/my-new-page",
  "title": "My New Page",
  "description": "Description of what this page shows",
  "image": "/images/my-image.svg",
  "parent": "home",
  "showInNav": true,
  "hotspots": []
}
```

**Configuration Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the page |
| `path` | string | Yes | URL route (e.g., "/architecture") |
| `title` | string | Yes | Page title shown in navigation and header |
| `description` | string | No | Subtitle shown below the title |
| `image` | string | Yes | Path to image file relative to `/public` |
| `parent` | string | No | ID of parent page for breadcrumbs |
| `showInNav` | boolean | Yes | Show in top navigation menu |
| `hotspots` | array | Yes | Array of clickable regions (can be empty) |

### Defining Hotspots

Hotspots are clickable regions on your images. All coordinates are **percentage-based (0-100)** for responsive scaling.

#### Rectangle Hotspot

```json
{
  "id": "backend-services",
  "shape": "rect",
  "coords": {
    "x": 10,
    "y": 20,
    "width": 30,
    "height": 40
  },
  "targetPage": "/architecture/backend",
  "label": "Backend Services",
  "description": "Click to explore backend architecture"
}
```

#### Circle Hotspot

```json
{
  "id": "database",
  "shape": "circle",
  "coords": {
    "cx": 50,
    "cy": 50,
    "r": 15
  },
  "targetPage": "/data/database",
  "label": "Database Layer"
}
```

#### Polygon Hotspot (Custom Shapes)

```json
{
  "id": "api-gateway",
  "shape": "polygon",
  "coords": {
    "points": "30,10 50,20 50,40 30,50 10,40 10,20"
  },
  "targetPage": "/api-gateway",
  "label": "API Gateway"
}
```

**Hotspot Properties:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `shape` | string | Yes | "rect", "circle", or "polygon" |
| `coords` | object | Yes | Shape-specific coordinates (see below) |
| `targetPage` | string | Yes | Route to navigate to when clicked |
| `label` | string | Yes | Accessible label for screen readers |
| `description` | string | No | Additional context (not currently displayed) |

**Coordinate Systems:**

**Rectangle:**
- `x`: Left edge (0-100%)
- `y`: Top edge (0-100%)
- `width`: Width (0-100%)
- `height`: Height (0-100%)

**Circle:**
- `cx`: Center X position (0-100%)
- `cy`: Center Y position (0-100%)
- `r`: Radius (0-100%)

**Polygon:**
- `points`: Space-separated "x,y" pairs (e.g., "10,10 20,20 30,10")

### Finding Hotspot Coordinates

**Method 1: Browser DevTools**

1. Open your image in the browser
2. Right-click → Inspect
3. Use DevTools to measure pixel positions
4. Convert to percentages:
   - `x% = (pixelX / imageWidth) × 100`
   - `y% = (pixelY / imageHeight) × 100`

**Method 2: Image Editor**

1. Open image in editor (Photoshop, GIMP, etc.)
2. Use selection tools to define regions
3. Note pixel coordinates
4. Convert to percentages using formula above

**Example:**
- Image size: 1200px × 800px
- Region starts at pixel (120, 160)
- Region size: 300px × 200px

Calculations:
- `x = (120 / 1200) × 100 = 10%`
- `y = (160 / 800) × 100 = 20%`
- `width = (300 / 1200) × 100 = 25%`
- `height = (200 / 800) × 100 = 25%`

### Replacing Images

**Simple Replacement (Same Filename):**

1. Replace the file in `public/images/` with your new image
2. Keep the same filename
3. The site auto-updates via HMR

**New Image:**

1. Add your image to `public/images/`
2. Update the `image` property in `presentation.json`:
   ```json
   "image": "/images/your-new-image.svg"
   ```

**Supported Formats:**
- SVG (recommended for diagrams)
- PNG
- JPG/JPEG
- WebP

**Image Best Practices:**
- **Recommended size**: 1200px × 800px
- **Keep aspect ratio consistent** across pages
- **Optimize file size** for faster loading
- **Use SVG** for technical diagrams when possible
- **Name files descriptively**: `system-architecture.svg` not `img1.svg`

---

## Temenos Brand Colors

The application uses the official Temenos color palette:

### Color Palette

```css
--temenos-warm-blue: #283275     /* 40% - Primary */
--temenos-energy-violet: #8246af  /* 20% - Secondary */
--temenos-renewal-green: #5cb8b2  /* 20% - Tertiary */
--temenos-white: #ffffff          /* 10% - Background */
--temenos-light-blue: #c8d9f1     /* 10% - Subtle */
```

### Usage Strategy

- **Warm Blue (#283275)**: Navigation bar, headers, footer, primary text
- **Energy Violet (#8246af)**: Hotspot hover effects, active navigation, links
- **Renewal Green (#5cb8b2)**: Hotspot borders on hover, breadcrumb accents, CTAs
- **White (#ffffff)**: Main content background, text on dark backgrounds
- **Light Blue (#c8d9f1)**: Breadcrumb background, subtle section backgrounds

### Customizing Colors

To change colors, edit `src/index.css`:

```css
:root {
  --temenos-warm-blue: #YOUR_COLOR;
  --temenos-energy-violet: #YOUR_COLOR;
  /* etc. */
}
```

---

## Project Structure

```
technical-overview/
├── public/
│   ├── images/              # Current presentation images (SVG, PNG, JPG)
│   ├── backups/             # Page backups (created when backing up pages)
│   └── exports/             # Exported presentations (created when exporting)
├── src/
│   ├── components/
│   │   ├── ImageMap/       # Clickable image component
│   │   ├── Navigation/     # TopNav and Breadcrumbs
│   │   └── Layout/         # Page layout wrapper
│   ├── pages/
│   │   ├── PresentationPage.tsx
│   │   └── ConfigEditor.tsx    # Visual configuration editor
│   ├── types/
│   │   └── presentation.types.ts
│   ├── utils/
│   │   └── configLoader.ts
│   ├── context/
│   │   └── ConfigContext.tsx
│   ├── config/
│   │   └── presentation.json    # ⭐ Main configuration file
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Global styles & Temenos colors
├── server.js                # API server for config editor
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Development

### Available Commands

```bash
# Start both servers at once (RECOMMENDED)
npm run dev:all

# Start frontend only
npm run dev

# Start API server only (for config editor)
npm run server

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Two-Server Architecture

The application uses two servers during development:

1. **Frontend (Vite)** - Port 5173
   - Serves the presentation
   - Hot Module Replacement
   - Works standalone

2. **Backend API** - Port 3001
   - Required for visual config editor
   - Saves configuration changes
   - Handles image uploads
   - Manages page backups
   - Handles presentation export/import (library and ZIP)

**Use `npm run dev:all` to start both automatically!**

### Development Workflow

1. **Start both servers**: `npm run dev:all`
2. **Edit content**:
   - **Visual Editor**: Click ⚙️ Config button → Edit in UI
   - **Manual**: Modify `src/config/presentation.json`
3. **Add images**:
   - **Upload**: Use config editor's file upload
   - **Manual**: Place files in `public/images/`
4. **Auto-reload**: Changes reflect immediately via HMR
5. **Test**: Check http://localhost:5173

### Hot Module Replacement (HMR)

The development server automatically reloads when you:
- Update configuration JSON
- Modify component files
- Change CSS styles
- Replace images (if same filename)

---

## Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized build in the `dist/` folder:
- Minified JavaScript and CSS
- Optimized images
- Production-ready static files

### Preview Production Build

```bash
npm run preview
```

Opens the production build at http://localhost:4173

### Deployment Options

**Static Hosting Services:**

1. **GitHub Pages**
   ```bash
   npm run build
   # Deploy dist/ folder to gh-pages branch
   ```

2. **Netlify**
   - Connect your Git repository
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Vercel**
   - Connect repository
   - Framework preset: Vite
   - Auto-deploys on git push

4. **AWS S3 + CloudFront**
   - Upload `dist/` contents to S3 bucket
   - Configure CloudFront distribution
   - Enable static website hosting

---

## Troubleshooting

### Config Editor Shows "Loading configuration..."

**Problem**: Config editor page stuck on loading screen

**Solution**:
1. **API server not running** - Most common cause
   ```bash
   # Start API server
   npm run server

   # OR start both servers
   npm run dev:all
   ```
2. Check browser console (F12) for errors
3. Verify API server is running: http://localhost:3001/api/config
4. Refresh the config editor page after starting API

### Images Not Loading

**Problem**: Images show "Unable to load image" error

**Solutions**:
1. Verify image path starts with `/images/` in JSON
2. Check file exists in `public/images/`
3. Ensure filename matches exactly (case-sensitive)
4. Clear browser cache and hard reload (Ctrl+Shift+R)

### Hotspots Not Appearing

**Problem**: No clickable regions on image

**Solutions**:
1. Verify `hotspots` array is not empty in JSON
2. Check coordinates are within 0-100 range
3. Ensure `shape` is "rect", "circle", or "polygon"
4. Validate JSON syntax (no trailing commas)

### Navigation Not Working

**Problem**: Clicking hotspots doesn't navigate

**Solutions**:
1. Check `targetPage` path exists in configuration
2. Verify `path` values start with `/`
3. Look for console errors (F12 → Console)
4. Ensure each page has a unique `id` and `path`

### Configuration Errors

**Problem**: "Invalid configuration" error on load

**Solutions**:
1. Validate JSON syntax at https://jsonlint.com
2. Ensure required fields are present:
   - `id`, `path`, `title`, `image`, `showInNav`
3. Check `parent` references point to existing page IDs
4. Verify `hotspots` is an array (can be empty: `[]`)

### Development Server Won't Start

**Problem**: Port already in use or module errors

**Solutions**:
```bash
# Kill process on port 5173
# Linux/WSL:
lsof -ti:5173 | xargs kill -9

# Windows PowerShell:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### WSL File Access Issues

**Problem**: Can't access files from Windows

**Solution**:
Access WSL files from Windows at:
```
\\wsl$\Ubuntu\home\sserniguet\technical-overview
```

Or access from WSL:
```bash
cd /mnt/c/path/to/your/folder
```

---

## Tips & Best Practices

### Configuration Tips

✅ **DO:**
- Use descriptive IDs: `"system-architecture"` not `"page1"`
- Keep paths RESTful: `"/architecture/backend"` not `"/arch_back"`
- Add descriptions for clarity
- Test hotspots before deploying
- Use consistent naming conventions

❌ **DON'T:**
- Use spaces in IDs or paths
- Create circular parent references
- Use duplicate IDs or paths
- Forget to set `showInNav`
- Leave required fields empty

### Image Tips

✅ **DO:**
- Use SVG for scalable diagrams
- Optimize images before uploading
- Use consistent dimensions
- Include clear visual boundaries
- Test on different screen sizes

❌ **DON'T:**
- Use huge uncompressed files
- Mix drastically different aspect ratios
- Forget alt text (uses `title`)
- Use special characters in filenames

### Hotspot Tips

✅ **DO:**
- Make hotspots large enough to click easily
- Provide visual cues in the image itself
- Test on mobile devices
- Use descriptive labels
- Cover logical sections of the diagram

❌ **DON'T:**
- Make tiny hotspots (hard to click)
- Overlap hotspots excessively
- Use coordinates outside 0-100 range
- Forget to test navigation flow

---

## Documentation Files

This project includes comprehensive documentation:

| File | Purpose | When to Read |
|------|---------|--------------|
| **README.md** | Main documentation (this file) | Start here for overview and reference |
| **QUICK_START.md** | Fast 5-minute setup guide | When you want to get started immediately |
| **CONFIG_EDITOR_GUIDE.md** | Visual editor complete guide | When using the configuration editor |
| **CHANGELOG.md** | Recent updates and feature history | To see what's new and recently added |
| **FEATURES_SUMMARY.md** | Complete feature list | For detailed feature documentation |
| **CONFIGURATION_EXAMPLES.md** | JSON configuration samples | When building custom configurations manually |
| **CUSTOMIZATION_CHECKLIST.md** | Step-by-step customization | When replacing demo with your content |
| **PROJECT_SUMMARY.md** | Feature overview & statistics | For project overview and capabilities |
| **DOCUMENTATION_INDEX.md** | Guide to all documentation | To find the right document quickly |

**Recommended reading order:**
1. **README.md** (this file) - Get familiar with the system
2. **QUICK_START.md** - Get it running quickly
3. **CONFIG_EDITOR_GUIDE.md** - Learn the visual editor
4. **CHANGELOG.md** - See latest features (backup, export/import, ZIP files)
5. **FEATURES_SUMMARY.md** - Complete feature documentation
6. **CONFIGURATION_EXAMPLES.md** - See examples and patterns

---

## License

This project was created with Claude Code. Customize and use as needed for your organization.

## Support

For issues or questions:
1. Check this README and other documentation files
2. Review **CONFIG_EDITOR_GUIDE.md** for config editor issues
3. Review **QUICK_START.md** for common problems
4. Check browser console for errors (F12)
5. Verify both servers are running (`npm run dev:all`)

---

**Built with:**
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Routing
- Temenos Brand Colors - Professional styling

---

**Ready to customize?**
- **Visual Editor**: Run `npm run dev:all` → Click ⚙️ Config → Edit visually!
- **Manual**: Edit `src/config/presentation.json` and add images to `public/images/`

**Both servers running?** → **http://localhost:5173** 🚀
