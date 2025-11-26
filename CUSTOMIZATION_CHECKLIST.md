# Customization Checklist

Use this checklist when adding your own technical diagrams and content.

## 📋 Pre-Customization

- [ ] Application running successfully (`npm run dev`)
- [ ] Visited http://localhost:5173 and saw demo content
- [ ] Reviewed `README.md`
- [ ] Reviewed `QUICK_START.md`
- [ ] Backed up original `src/config/presentation.json`

---

## 🎨 Step 1: Prepare Your Images

- [ ] Images created/exported
- [ ] Recommended format: SVG (or PNG/JPG)
- [ ] Consistent dimensions across all images
- [ ] Suggested size: 1200px × 800px
- [ ] Files optimized for web
- [ ] Descriptive filenames (e.g., `system-architecture.svg`)

**Image Locations**:
- [ ] All images placed in `public/images/` directory
- [ ] Filenames use lowercase and hyphens (no spaces)
- [ ] Test: Can you see the image at `http://localhost:5173/images/your-file.svg`?

---

## 📝 Step 2: Plan Your Navigation Structure

Draw or write out your page hierarchy:

```
Example:
Home
├── Architecture
│   ├── Frontend
│   └── Backend
├── Data Flow
│   ├── Ingestion
│   ├── Processing
│   └── Storage
└── Deployment
```

**Planning Questions**:
- [ ] What's your main landing page?
- [ ] What are your top-level sections? (these go in navigation)
- [ ] What are your detail pages? (these are clicked from diagrams)
- [ ] What's the logical parent-child relationship?

---

## 🔧 Step 3: Update Configuration

### Create Your Configuration

- [ ] Open `src/config/presentation.json`
- [ ] Start with home page configuration
- [ ] Add top-level navigation pages
- [ ] Add detail pages

### For Each Page, Verify:

- [ ] Unique `id` (use descriptive names: `"system-architecture"`)
- [ ] Unique `path` (URL path: `"/architecture"`)
- [ ] Descriptive `title` (shown in nav and header)
- [ ] Optional `description` (subtitle)
- [ ] Correct `image` path (must start with `/images/`)
- [ ] `parent` ID exists (if not a top-level page)
- [ ] `showInNav` is `true` for main sections, `false` for details
- [ ] `hotspots` array exists (can be empty: `[]`)

### For Each Hotspot, Verify:

- [ ] Unique `id` within the page
- [ ] Valid `shape`: `"rect"`, `"circle"`, or `"polygon"`
- [ ] Coordinates within 0-100 range
- [ ] `targetPage` path exists in configuration
- [ ] Descriptive `label` for accessibility

---

## 🎯 Step 4: Define Hotspot Coordinates

For each clickable region on your images:

### Rectangle Coordinates

- [ ] Measured top-left corner position (x, y)
- [ ] Measured width and height
- [ ] Converted to percentages (0-100)
- [ ] Added to configuration

**Formula**:
```
x% = (pixelX / imageWidth) × 100
y% = (pixelY / imageHeight) × 100
width% = (pixelWidth / imageWidth) × 100
height% = (pixelHeight / imageHeight) × 100
```

### Circle Coordinates

- [ ] Measured center point (cx, cy)
- [ ] Measured radius
- [ ] Converted to percentages
- [ ] Added to configuration

### Polygon Coordinates

- [ ] Identified all corner points
- [ ] Converted each point to percentages
- [ ] Created points string: `"x1,y1 x2,y2 x3,y3"`
- [ ] Added to configuration

---

## ✅ Step 5: Test Your Configuration

### JSON Validation

- [ ] JSON syntax is valid (https://jsonlint.com)
- [ ] No trailing commas
- [ ] All quotes are double quotes (`"` not `'`)
- [ ] All arrays and objects properly closed

### Page Testing

- [ ] Home page loads
- [ ] All navigation links work
- [ ] Each page shows correct image
- [ ] Breadcrumbs show correct hierarchy
- [ ] All hotspots appear on hover
- [ ] Clicking hotspots navigates correctly
- [ ] No 404 errors or broken links

### Visual Testing

- [ ] Images load quickly
- [ ] Hotspots align with visual elements
- [ ] Hover effects are visible
- [ ] Colors match Temenos branding
- [ ] Text is readable
- [ ] Navigation is intuitive

### Responsive Testing

- [ ] Desktop (>1024px) looks good
- [ ] Tablet (768-1024px) looks good
- [ ] Mobile (<768px) looks good
- [ ] Hotspots are clickable on touch devices
- [ ] Navigation works on mobile

---

## 🎨 Step 6: Customize Branding (Optional)

### If Keeping Temenos Colors:
- [ ] No changes needed!

### If Changing Colors:
- [ ] Open `src/index.css`
- [ ] Update CSS variables in `:root`
- [ ] Test that all elements look good
- [ ] Verify contrast for accessibility

```css
:root {
  --temenos-warm-blue: #YOUR_PRIMARY_COLOR;
  --temenos-energy-violet: #YOUR_SECONDARY_COLOR;
  --temenos-renewal-green: #YOUR_ACCENT_COLOR;
  --temenos-white: #FFFFFF;
  --temenos-light-blue: #YOUR_SUBTLE_COLOR;
}
```

### Update Text Content:
- [ ] Header title in `src/components/Layout/Layout.tsx`
- [ ] Footer text in `src/components/Layout/Layout.tsx`
- [ ] Page title in `index.html` (browser tab)

---

## 🧪 Step 7: Final Testing

### Functionality Tests

- [ ] All pages accessible
- [ ] All hotspots work
- [ ] Navigation flows make sense
- [ ] Breadcrumbs show correct path
- [ ] Images load correctly
- [ ] No console errors (F12 → Console)

### User Experience Tests

- [ ] Easy to understand where to click
- [ ] Visual feedback on hover is clear
- [ ] Navigation is intuitive
- [ ] Content hierarchy makes sense
- [ ] Mobile experience is good

### Performance Tests

- [ ] Pages load quickly
- [ ] Transitions are smooth
- [ ] No lag on hotspot hover
- [ ] Images are optimized

---

## 🚀 Step 8: Prepare for Deployment

### Clean Up

- [ ] Remove unused demo images from `public/images/`
- [ ] Remove unused pages from `presentation.json`
- [ ] Remove demo/test content
- [ ] Update README with your specific info (optional)

### Build Test

```bash
npm run build
npm run preview
```

- [ ] Build completes without errors
- [ ] Preview works at http://localhost:4173
- [ ] All functionality works in production build
- [ ] Images load in production build

### Pre-Deployment Checklist

- [ ] All content is final
- [ ] All links tested
- [ ] Configuration validated
- [ ] Performance acceptable
- [ ] Mobile tested
- [ ] Browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Ready to deploy!

---

## 📦 Deployment Options

Choose your deployment platform:

### Option 1: GitHub Pages
- [ ] Repository connected
- [ ] `dist/` folder deployed
- [ ] Custom domain configured (optional)

### Option 2: Netlify
- [ ] Account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Site deployed

### Option 3: Vercel
- [ ] Account created
- [ ] Repository connected
- [ ] Automatic deployments enabled
- [ ] Site live

### Option 4: AWS S3
- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] `dist/` contents uploaded
- [ ] CloudFront configured (optional)

---

## 🎉 Post-Deployment

- [ ] Production URL accessible
- [ ] All pages load
- [ ] All hotspots work
- [ ] Images load correctly
- [ ] Performance is good
- [ ] Mobile works
- [ ] Shared with stakeholders

---

## 📝 Maintenance Checklist

### When Adding New Content:

- [ ] Add image to `public/images/`
- [ ] Add page to `presentation.json`
- [ ] Define hotspots if needed
- [ ] Set parent relationship
- [ ] Set `showInNav` appropriately
- [ ] Test navigation flow
- [ ] Build and redeploy

### When Updating Images:

- [ ] Replace file in `public/images/`
- [ ] Keep same filename (or update JSON)
- [ ] Verify hotspots still align
- [ ] Update coordinates if needed
- [ ] Test on all devices
- [ ] Rebuild and redeploy

---

## 💡 Tips for Success

1. **Start Simple**: Begin with 2-3 pages, add more later
2. **Test Often**: Check after each change, don't wait
3. **Use SVG**: Best for technical diagrams
4. **Keep Backups**: Save working configurations
5. **Document**: Keep notes on your coordinate calculations
6. **Ask for Feedback**: Have others test the navigation
7. **Iterate**: It's okay to refine over time

---

## ⚠️ Common Pitfalls to Avoid

- ❌ Don't use absolute pixel coordinates (use percentages 0-100)
- ❌ Don't forget trailing `/` in paths: `/page` not `page/`
- ❌ Don't use spaces in IDs or filenames
- ❌ Don't create circular parent references
- ❌ Don't forget to set `showInNav`
- ❌ Don't skip testing on mobile
- ❌ Don't deploy without building first

---

## ✨ You're Ready!

Follow this checklist step by step, and you'll have your custom technical presentation running smoothly.

**Questions?** Check the `README.md` or `CONFIGURATION_EXAMPLES.md`

**Good luck!** 🚀
