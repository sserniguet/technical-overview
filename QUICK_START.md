# Quick Start Guide

Get your technical presentation running in 5 minutes!

## Step 1: Install & Run (2 minutes)

```bash
# Navigate to the project
cd /home/sserniguet/technical-overview

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Access**: Open http://localhost:5173 in your browser

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

## Need Help?

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

---

**That's it!** You're ready to create your technical presentation.

**Pro Tip**: Keep the dev server running (`npm run dev`) and edit `presentation.json` - changes appear instantly!
