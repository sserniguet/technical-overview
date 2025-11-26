# Configuration Examples

This guide provides real-world examples for configuring your technical presentation.

## Table of Contents

- [Basic Page Setup](#basic-page-setup)
- [Navigation Hierarchy](#navigation-hierarchy)
- [Hotspot Examples](#hotspot-examples)
- [Complete Configuration](#complete-configuration)
- [Common Patterns](#common-patterns)

---

## Basic Page Setup

### Simple Page with No Hotspots

```json
{
  "id": "about",
  "path": "/about",
  "title": "About Our System",
  "description": "Overview of our technical architecture",
  "image": "/images/about.svg",
  "showInNav": true,
  "hotspots": []
}
```

### Page with Single Hotspot

```json
{
  "id": "overview",
  "path": "/",
  "title": "System Overview",
  "image": "/images/overview.svg",
  "showInNav": true,
  "hotspots": [
    {
      "id": "details",
      "shape": "rect",
      "coords": {
        "x": 25,
        "y": 25,
        "width": 50,
        "height": 50
      },
      "targetPage": "/details",
      "label": "Click for details"
    }
  ]
}
```

---

## Navigation Hierarchy

### Parent-Child Relationship

```json
{
  "pages": [
    {
      "id": "home",
      "path": "/",
      "title": "Home",
      "image": "/images/home.svg",
      "showInNav": true,
      "hotspots": [
        {
          "id": "architecture",
          "shape": "rect",
          "coords": { "x": 10, "y": 10, "width": 40, "height": 40 },
          "targetPage": "/architecture",
          "label": "Architecture"
        }
      ]
    },
    {
      "id": "architecture",
      "path": "/architecture",
      "title": "Architecture",
      "image": "/images/architecture.svg",
      "parent": "home",
      "showInNav": true,
      "hotspots": [
        {
          "id": "backend",
          "shape": "rect",
          "coords": { "x": 20, "y": 20, "width": 30, "height": 30 },
          "targetPage": "/architecture/backend",
          "label": "Backend"
        }
      ]
    },
    {
      "id": "backend",
      "path": "/architecture/backend",
      "title": "Backend Services",
      "image": "/images/backend.svg",
      "parent": "architecture",
      "showInNav": false,
      "hotspots": []
    }
  ]
}
```

**Breadcrumb Trail**: Home / Architecture / Backend Services

---

## Hotspot Examples

### Rectangle Hotspots

**Full Width Section**:
```json
{
  "id": "header",
  "shape": "rect",
  "coords": {
    "x": 0,
    "y": 0,
    "width": 100,
    "height": 20
  },
  "targetPage": "/header-details",
  "label": "Header Section"
}
```

**Centered Square**:
```json
{
  "id": "center",
  "shape": "rect",
  "coords": {
    "x": 25,
    "y": 25,
    "width": 50,
    "height": 50
  },
  "targetPage": "/center",
  "label": "Center Content"
}
```

**Three Columns**:
```json
{
  "hotspots": [
    {
      "id": "left-column",
      "shape": "rect",
      "coords": { "x": 5, "y": 20, "width": 28, "height": 60 },
      "targetPage": "/left",
      "label": "Left Section"
    },
    {
      "id": "middle-column",
      "shape": "rect",
      "coords": { "x": 36, "y": 20, "width": 28, "height": 60 },
      "targetPage": "/middle",
      "label": "Middle Section"
    },
    {
      "id": "right-column",
      "shape": "rect",
      "coords": { "x": 67, "y": 20, "width": 28, "height": 60 },
      "targetPage": "/right",
      "label": "Right Section"
    }
  ]
}
```

### Circle Hotspots

**Center Circle**:
```json
{
  "id": "core",
  "shape": "circle",
  "coords": {
    "cx": 50,
    "cy": 50,
    "r": 20
  },
  "targetPage": "/core",
  "label": "Core System"
}
```

**Multiple Circles (Service Nodes)**:
```json
{
  "hotspots": [
    {
      "id": "service-1",
      "shape": "circle",
      "coords": { "cx": 25, "cy": 50, "r": 10 },
      "targetPage": "/service-1",
      "label": "Service 1"
    },
    {
      "id": "service-2",
      "shape": "circle",
      "coords": { "cx": 50, "cy": 50, "r": 10 },
      "targetPage": "/service-2",
      "label": "Service 2"
    },
    {
      "id": "service-3",
      "shape": "circle",
      "coords": { "cx": 75, "cy": 50, "r": 10 },
      "targetPage": "/service-3",
      "label": "Service 3"
    }
  ]
}
```

### Polygon Hotspots

**Diamond Shape**:
```json
{
  "id": "decision",
  "shape": "polygon",
  "coords": {
    "points": "50,10 90,50 50,90 10,50"
  },
  "targetPage": "/decision",
  "label": "Decision Point"
}
```

**Hexagon**:
```json
{
  "id": "hex",
  "shape": "polygon",
  "coords": {
    "points": "50,5 85,25 85,75 50,95 15,75 15,25"
  },
  "targetPage": "/hexagon",
  "label": "Hexagonal Component"
}
```

**Arrow Pointing Right**:
```json
{
  "id": "next",
  "shape": "polygon",
  "coords": {
    "points": "10,30 60,30 60,20 90,50 60,80 60,70 10,70"
  },
  "targetPage": "/next",
  "label": "Next Step"
}
```

---

## Complete Configuration

### Multi-Level Technical Documentation

```json
{
  "pages": [
    {
      "id": "home",
      "path": "/",
      "title": "Technical Architecture",
      "description": "Comprehensive overview of our system",
      "image": "/images/main-architecture.svg",
      "showInNav": true,
      "hotspots": [
        {
          "id": "frontend-section",
          "shape": "rect",
          "coords": { "x": 5, "y": 15, "width": 28, "height": 70 },
          "targetPage": "/frontend",
          "label": "Frontend Architecture"
        },
        {
          "id": "backend-section",
          "shape": "rect",
          "coords": { "x": 36, "y": 15, "width": 28, "height": 70 },
          "targetPage": "/backend",
          "label": "Backend Services"
        },
        {
          "id": "database-section",
          "shape": "rect",
          "coords": { "x": 67, "y": 15, "width": 28, "height": 70 },
          "targetPage": "/database",
          "label": "Data Layer"
        }
      ]
    },
    {
      "id": "frontend",
      "path": "/frontend",
      "title": "Frontend Architecture",
      "description": "React-based single page application",
      "image": "/images/frontend-detail.svg",
      "parent": "home",
      "showInNav": true,
      "hotspots": [
        {
          "id": "components",
          "shape": "circle",
          "coords": { "cx": 30, "cy": 40, "r": 15 },
          "targetPage": "/frontend/components",
          "label": "Component Library"
        },
        {
          "id": "state",
          "shape": "circle",
          "coords": { "cx": 70, "cy": 40, "r": 15 },
          "targetPage": "/frontend/state",
          "label": "State Management"
        }
      ]
    },
    {
      "id": "frontend-components",
      "path": "/frontend/components",
      "title": "Component Library",
      "description": "Reusable UI components",
      "image": "/images/components.svg",
      "parent": "frontend",
      "showInNav": false,
      "hotspots": []
    },
    {
      "id": "frontend-state",
      "path": "/frontend/state",
      "title": "State Management",
      "description": "Application state handling",
      "image": "/images/state-management.svg",
      "parent": "frontend",
      "showInNav": false,
      "hotspots": []
    },
    {
      "id": "backend",
      "path": "/backend",
      "title": "Backend Services",
      "description": "Microservices architecture",
      "image": "/images/backend-detail.svg",
      "parent": "home",
      "showInNav": true,
      "hotspots": [
        {
          "id": "api-gateway",
          "shape": "rect",
          "coords": { "x": 10, "y": 10, "width": 35, "height": 25 },
          "targetPage": "/backend/api-gateway",
          "label": "API Gateway"
        },
        {
          "id": "microservices",
          "shape": "rect",
          "coords": { "x": 10, "y": 40, "width": 35, "height": 25 },
          "targetPage": "/backend/microservices",
          "label": "Microservices"
        },
        {
          "id": "message-queue",
          "shape": "rect",
          "coords": { "x": 55, "y": 25, "width": 35, "height": 25 },
          "targetPage": "/backend/messaging",
          "label": "Message Queue"
        }
      ]
    },
    {
      "id": "database",
      "path": "/database",
      "title": "Data Layer",
      "description": "Database architecture and data flow",
      "image": "/images/database-detail.svg",
      "parent": "home",
      "showInNav": true,
      "hotspots": [
        {
          "id": "primary-db",
          "shape": "circle",
          "coords": { "cx": 50, "cy": 30, "r": 12 },
          "targetPage": "/database/primary",
          "label": "Primary Database"
        },
        {
          "id": "cache",
          "shape": "circle",
          "coords": { "cx": 30, "cy": 60, "r": 10 },
          "targetPage": "/database/cache",
          "label": "Cache Layer"
        },
        {
          "id": "replica",
          "shape": "circle",
          "coords": { "cx": 70, "cy": 60, "r": 10 },
          "targetPage": "/database/replica",
          "label": "Read Replica"
        }
      ]
    }
  ]
}
```

---

## Common Patterns

### Pattern 1: Landing Page with Grid Layout

**Image**: 4 equal quadrants
```json
{
  "hotspots": [
    {
      "id": "top-left",
      "shape": "rect",
      "coords": { "x": 5, "y": 5, "width": 40, "height": 40 },
      "targetPage": "/feature-1",
      "label": "Feature 1"
    },
    {
      "id": "top-right",
      "shape": "rect",
      "coords": { "x": 55, "y": 5, "width": 40, "height": 40 },
      "targetPage": "/feature-2",
      "label": "Feature 2"
    },
    {
      "id": "bottom-left",
      "shape": "rect",
      "coords": { "x": 5, "y": 55, "width": 40, "height": 40 },
      "targetPage": "/feature-3",
      "label": "Feature 3"
    },
    {
      "id": "bottom-right",
      "shape": "rect",
      "coords": { "x": 55, "y": 55, "width": 40, "height": 40 },
      "targetPage": "/feature-4",
      "label": "Feature 4"
    }
  ]
}
```

### Pattern 2: Process Flow (Left to Right)

```json
{
  "hotspots": [
    {
      "id": "step-1",
      "shape": "rect",
      "coords": { "x": 5, "y": 30, "width": 18, "height": 40 },
      "targetPage": "/step-1",
      "label": "Step 1: Input"
    },
    {
      "id": "step-2",
      "shape": "rect",
      "coords": { "x": 28, "y": 30, "width": 18, "height": 40 },
      "targetPage": "/step-2",
      "label": "Step 2: Process"
    },
    {
      "id": "step-3",
      "shape": "rect",
      "coords": { "x": 51, "y": 30, "width": 18, "height": 40 },
      "targetPage": "/step-3",
      "label": "Step 3: Transform"
    },
    {
      "id": "step-4",
      "shape": "rect",
      "coords": { "x": 74, "y": 30, "width": 21, "height": 40 },
      "targetPage": "/step-4",
      "label": "Step 4: Output"
    }
  ]
}
```

### Pattern 3: Hub and Spoke (Central Node with Connections)

```json
{
  "hotspots": [
    {
      "id": "central-hub",
      "shape": "circle",
      "coords": { "cx": 50, "cy": 50, "r": 15 },
      "targetPage": "/hub",
      "label": "Central Hub"
    },
    {
      "id": "spoke-north",
      "shape": "circle",
      "coords": { "cx": 50, "cy": 15, "r": 8 },
      "targetPage": "/spoke-1",
      "label": "Service 1"
    },
    {
      "id": "spoke-east",
      "shape": "circle",
      "coords": { "cx": 85, "cy": 50, "r": 8 },
      "targetPage": "/spoke-2",
      "label": "Service 2"
    },
    {
      "id": "spoke-south",
      "shape": "circle",
      "coords": { "cx": 50, "cy": 85, "r": 8 },
      "targetPage": "/spoke-3",
      "label": "Service 3"
    },
    {
      "id": "spoke-west",
      "shape": "circle",
      "coords": { "cx": 15, "cy": 50, "r": 8 },
      "targetPage": "/spoke-4",
      "label": "Service 4"
    }
  ]
}
```

### Pattern 4: Layered Architecture (Vertical Layers)

```json
{
  "hotspots": [
    {
      "id": "presentation-layer",
      "shape": "rect",
      "coords": { "x": 10, "y": 5, "width": 80, "height": 18 },
      "targetPage": "/presentation",
      "label": "Presentation Layer"
    },
    {
      "id": "business-layer",
      "shape": "rect",
      "coords": { "x": 10, "y": 28, "width": 80, "height": 18 },
      "targetPage": "/business",
      "label": "Business Logic Layer"
    },
    {
      "id": "data-access-layer",
      "shape": "rect",
      "coords": { "x": 10, "y": 51, "width": 80, "height": 18 },
      "targetPage": "/data-access",
      "label": "Data Access Layer"
    },
    {
      "id": "database-layer",
      "shape": "rect",
      "coords": { "x": 10, "y": 74, "width": 80, "height": 18 },
      "targetPage": "/database",
      "label": "Database Layer"
    }
  ]
}
```

---

## Tips for Creating Effective Configurations

### Coordinate Tips

1. **Start from the top-left corner** (0,0) and work your way across
2. **Leave margins** - Don't go all the way to edges (5% margin recommended)
3. **Keep regions proportional** to the visual elements in your image
4. **Test on different screen sizes** - coordinates scale proportionally

### Organization Tips

1. **Group related pages** together in the JSON
2. **Use consistent naming**: `feature-name` not `featName`
3. **Comment your intentions** (JSON doesn't support comments, but keep notes separately)
4. **Start simple** - Add one hotspot, test, then add more

### Validation Checklist

Before deploying:
- [ ] All `id` values are unique
- [ ] All `path` values are unique and start with `/`
- [ ] All `targetPage` values point to existing paths
- [ ] `parent` references point to existing page IDs
- [ ] All `showInNav` values are boolean (true/false)
- [ ] Coordinates are within 0-100 range
- [ ] Image files exist in `public/images/`
- [ ] JSON syntax is valid (no trailing commas)

---

**Need more examples?** Check the `src/config/presentation.json` file for the working demo configuration!
