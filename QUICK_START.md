# Quick Start Guide

Get your technical presentation running in 5 minutes!

## Step 1: Install & Run (2 minutes)

```bash
# Navigate to the project
cd /home/sserniguet/technical-overview

# Install dependencies (first time only)
npm install

# Start BOTH servers (recommended)
npm run dev:all
```

**OR start separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API Server (for Config Editor)
npm run server
```

**Access**:
- **Presentation**: http://localhost:5173
- **Config Editor**: Click ⚙️ Config button (needs both servers running)

---

## Step 2: Add Your First Image (1 minute)

1. Place your image in `public/images/`:
   ```bash
   # Example: copy your diagram
   cp /path/to/your/diagram.svg public/images/my-diagram.svg
   ```

2. Supported formats: SVG, PNG, JPG

---

## Step 3: Add Your Page (2 minutes)

Edit `src/config/presentation.json`:

```json
{
  "pages": [
    {
      "id": "my-page",
      "path": "/my-page",
      "title": "My Technical Diagram",
      "description": "Description of your diagram",
      "image": "/images/my-diagram.svg",
      "showInNav": true,
      "hotspots": []
    }
  ]
}
```

**Save** → Browser auto-reloads → Your page appears!

---

## Step 4: Add Clickable Region (Optional)

Add a hotspot to make part of your image clickable:

```json
{
  "id": "my-page",
  "path": "/my-page",
  "title": "My Technical Diagram",
  "image": "/images/my-diagram.svg",
  "showInNav": true,
  "hotspots": [
    {
      "id": "detail-section",
      "shape": "rect",
      "coords": {
        "x": 25,
        "y": 25,
        "width": 50,
        "height": 50
      },
      "targetPage": "/my-detail-page",
      "label": "Click for details"
    }
  ]
}
```

---

## Common First Tasks

### Replace Existing Images

```bash
# Just replace the file
cp /path/to/new-overview.svg public/images/overview.svg
```

Browser auto-reloads with new image!

### Change Navigation Title

Edit `src/config/presentation.json`:

```json
{
  "title": "Your New Title"  ← Change this
}
```

### Remove Demo Pages

Delete unwanted page objects from `presentation.json`:

```json
{
  "pages": [
    // Keep only the pages you want
    {
      "id": "home",
      ...
    }
  ]
}
```

### Change Colors

Edit `src/index.css`:

```css
:root {
  --temenos-warm-blue: #YOUR_COLOR;
  --temenos-energy-violet: #YOUR_COLOR;
  --temenos-renewal-green: #YOUR_COLOR;
}
```

---

## Next Steps

1. **Read the full README**: `README.md`
2. **See configuration examples**: `CONFIGURATION_EXAMPLES.md`
3. **Test different hotspot shapes**: Visit `/shapes-demo` in the app
4. **Build for production**: `npm run build`

---

## Using the Visual Config Editor

**NEW: Edit configuration visually without touching JSON!**

1. **Start both servers**: `npm run dev:all`
2. **Open presentation**: http://localhost:5173
3. **Move mouse to top** → Click **⚙️ Config** button
4. **Edit visually**:
   - Add/remove pages
   - Upload images
   - Create hotspots with forms
   - Set coordinates with number inputs
5. **Save** → Changes appear instantly!

**See CONFIG_EDITOR_GUIDE.md for full documentation**

---

## Need Help?

### Config Editor shows "Loading configuration..."
- **Problem**: API server not running
- **Solution**: Run `npm run dev:all` or `npm run server` in separate terminal

### Image not showing?
- Check path starts with `/images/`
- Verify file exists in `public/images/`
- Check filename matches exactly (case-sensitive)

### Hotspot not working?
- Verify coordinates are 0-100
- Check `targetPage` exists in config
- Look for JSON syntax errors

### Configuration error?
- Validate JSON at https://jsonlint.com
- Ensure all required fields present
- Check for trailing commas

### Changes not appearing after save?
- Make sure API server is running (port 3001)
- Check browser console for errors (F12)
- Try refreshing presentation tab

---

**That's it!** You're ready to create your technical presentation.

**Pro Tip**: Keep the dev server running (`npm run dev`) and edit `presentation.json` - changes appear instantly!
