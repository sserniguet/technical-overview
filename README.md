# Interactive Technical Presentation System

An interactive, configuration-driven presentation system for exploring technical concepts through clickable diagrams. Built with React, TypeScript, and Vite, featuring Temenos brand colors.

## Features

- **Interactive Clickable Images**: Click on regions of technical diagrams to navigate deeper into concepts
- **Multiple Hotspot Shapes**: Support for rectangles, circles, and polygons
- **JSON Configuration**: Easy content management without touching code
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Temenos Branding**: Professional color scheme throughout
- **Dynamic Routing**: Automatic route generation from configuration
- **Breadcrumb Navigation**: Clear hierarchy and easy navigation back up
- **File-based Images**: Simply replace image files to update content

## Table of Contents

- [Installation](#installation)
  - [Option 1: WSL (Linux)](#option-1-wsl-windows-subsystem-for-linux)
  - [Option 2: Native Windows](#option-2-native-windows)
- [Quick Start](#quick-start)
- [Configuration Guide](#configuration-guide)
  - [Adding New Pages](#adding-new-pages)
  - [Defining Hotspots](#defining-hotspots)
  - [Replacing Images](#replacing-images)
- [Temenos Brand Colors](#temenos-brand-colors)
- [Project Structure](#project-structure)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

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

#### Step 4: Run Development Server

```bash
npm run dev
```

#### Step 5: Access from Windows Browser

Open http://localhost:5173 in your Windows browser. WSL automatically forwards ports to Windows.

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

#### Step 3: Run Development Server

```powershell
npm run dev
```

#### Step 4: Access in Browser

Open http://localhost:5173 in your browser

**Benefits of Native Windows:**
- Direct file system access
- Simpler setup
- Native Windows tools and editors
- No VM overhead

---

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173

### 2. Explore the Demo

Navigate through the sample pages:
- **System Overview** - Main landing page with clickable architecture and data flow
- **System Architecture** - Detailed component view
- **Data Flow** - Data pipeline visualization
- **Shapes Demo** - Examples of all hotspot types

### 3. Customize with Your Content

1. Add your images to `public/images/`
2. Update `src/config/presentation.json`
3. The site automatically updates with Hot Module Replacement

---

## Configuration Guide

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
│   └── images/              # All presentation images (SVG, PNG, JPG)
├── src/
│   ├── components/
│   │   ├── ImageMap/       # Clickable image component
│   │   ├── Navigation/     # TopNav and Breadcrumbs
│   │   └── Layout/         # Page layout wrapper
│   ├── pages/
│   │   └── PresentationPage.tsx
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
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Development

### Available Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Edit content**: Modify `src/config/presentation.json`
3. **Add images**: Place files in `public/images/`
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

## License

This project was created with Claude Code. Customize and use as needed for your organization.

## Support

For issues or questions:
1. Check this README
2. Review configuration examples in `src/config/presentation.json`
3. Check browser console for errors (F12)
4. Verify JSON syntax

---

**Built with:**
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Routing
- Temenos Brand Colors - Professional styling

---

**Ready to customize?** Start by editing `src/config/presentation.json` and adding your images to `public/images/`!
