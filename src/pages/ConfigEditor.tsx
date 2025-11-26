import { useState, useEffect, useRef } from 'react';
import { PageConfig, PresentationConfig, HotspotRegion } from '../types/presentation.types';
import './ConfigEditor.css';

const API_BASE = 'http://localhost:3001/api';

export function ConfigEditor() {
  const [config, setConfig] = useState<PresentationConfig | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfig();
    loadImages();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_BASE}/config`);
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      showMessage('error', 'Failed to load configuration');
    }
  };

  const loadImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/images`);
      const data = await response.json();
      setAvailableImages(data.map((img: any) => img.url));
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const saveConfig = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        showMessage('success', 'Configuration saved! Changes will appear in the main window.');
      } else {
        showMessage('error', 'Failed to save configuration');
      }
    } catch (error) {
      showMessage('error', 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const addPage = () => {
    // Trigger file upload dialog
    fileInputRef.current?.click();
  };

  const handleAddPageImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !config) return;

    // Upload the image first
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newImageUrl = data.imageUrl;

        // Reload images list
        await loadImages();

        // Extract filename without extension for IDs
        const imageName = file.name.replace(/\.[^/.]+$/, '');
        const cleanName = imageName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

        // Create page with the uploaded image
        const newPage: PageConfig = {
          id: cleanName,
          path: `/${cleanName}`,
          title: imageName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Page for ${imageName}`,
          image: newImageUrl,
          showInNav: true,
          hotspots: []
        };

        setConfig({
          ...config,
          pages: [...config.pages, newPage]
        });
        setSelectedPageIndex(config.pages.length);

        showMessage('success', `Page created with image: ${data.filename}`);
      } else {
        showMessage('error', 'Failed to upload image');
      }
    } catch (error) {
      showMessage('error', 'Failed to upload image');
    }

    // Reset the input
    event.target.value = '';
  };

  const deletePage = (index: number) => {
    if (!config) return;
    if (!confirm('Are you sure you want to delete this page?')) return;

    const newPages = config.pages.filter((_, i) => i !== index);
    setConfig({ ...config, pages: newPages });

    if (selectedPageIndex === index) {
      setSelectedPageIndex(null);
    } else if (selectedPageIndex !== null && selectedPageIndex > index) {
      setSelectedPageIndex(selectedPageIndex - 1);
    }
  };

  const updatePage = (index: number, updates: Partial<PageConfig>) => {
    if (!config) return;

    const newPages = [...config.pages];
    newPages[index] = { ...newPages[index], ...updates };
    setConfig({ ...config, pages: newPages });
  };

  const addHotspot = (pageIndex: number) => {
    if (!config) return;

    const newHotspot: HotspotRegion = {
      id: `hotspot-${Date.now()}`,
      shape: 'rect',
      coords: { x: 25, y: 25, width: 50, height: 50 },
      targetPage: config.pages[0]?.path || '/',
      label: 'New Hotspot'
    };

    const newPages = [...config.pages];
    newPages[pageIndex] = {
      ...newPages[pageIndex],
      hotspots: [...newPages[pageIndex].hotspots, newHotspot]
    };
    setConfig({ ...config, pages: newPages });
  };

  const updateHotspot = (pageIndex: number, hotspotIndex: number, updates: Partial<HotspotRegion>) => {
    if (!config) return;

    const newPages = [...config.pages];
    const newHotspots = [...newPages[pageIndex].hotspots];
    newHotspots[hotspotIndex] = { ...newHotspots[hotspotIndex], ...updates };
    newPages[pageIndex] = { ...newPages[pageIndex], hotspots: newHotspots };
    setConfig({ ...config, pages: newPages });
  };

  const deleteHotspot = (pageIndex: number, hotspotIndex: number) => {
    if (!config) return;

    const newPages = [...config.pages];
    newPages[pageIndex] = {
      ...newPages[pageIndex],
      hotspots: newPages[pageIndex].hotspots.filter((_, i) => i !== hotspotIndex)
    };
    setConfig({ ...config, pages: newPages });
  };

  const handleImageReplacement = async (event: React.ChangeEvent<HTMLInputElement>, currentImagePath: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Extract filename from current image path
    const currentFilename = currentImagePath.split('/').pop();
    if (!currentFilename) return;

    if (!confirm(`This will replace the existing image file "${currentFilename}". All pages using this image will show the new version. Continue?`)) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('replaceFilename', currentFilename);

    try {
      const response = await fetch(`${API_BASE}/upload-image`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showMessage('success', `Image "${currentFilename}" replaced successfully! Refresh the page to see changes.`);
        // Trigger a reload of images to update cache
        setTimeout(() => loadImages(), 500);
      } else {
        showMessage('error', 'Failed to replace image');
      }
    } catch (error) {
      showMessage('error', 'Failed to replace image');
    }

    // Reset the input
    event.target.value = '';
  };

  if (!config) {
    return <div className="config-editor-loading">Loading configuration...</div>;
  }

  const selectedPage = selectedPageIndex !== null ? config.pages[selectedPageIndex] : null;

  return (
    <div className="config-editor">
      {/* Hidden file input for adding pages with images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAddPageImage}
      />

      <header className="config-editor-header">
        <h1>Configuration Editor</h1>
        <div className="config-editor-actions">
          <button className="btn-save" onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Configuration'}
          </button>
          <a href="/" target="_blank" className="btn-preview">
            🔍 Open Presentation
          </a>
        </div>
      </header>

      {message && (
        <div className={`config-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="config-editor-content">
        <aside className="config-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-header">
              <h2>Pages ({config.pages.length})</h2>
              <button className="btn-add" onClick={addPage}>+ Add Page</button>
            </div>
            <ul className="pages-list">
              {config.pages.map((page, index) => (
                <li
                  key={page.id}
                  className={`page-item ${selectedPageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedPageIndex(index)}
                >
                  <div className="page-item-content">
                    <strong>{page.title}</strong>
                    <small>{page.path}</small>
                  </div>
                  <button
                    className="btn-delete-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(index);
                    }}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        <main className="config-main">
          {selectedPage ? (
            <div className="page-editor">
              <h2>Edit Page: {selectedPage.title}</h2>

              <div className="form-section">
                <h3>Page Properties</h3>

                <div className="form-group">
                  <label>Page ID</label>
                  <input
                    type="text"
                    value={selectedPage.id}
                    onChange={(e) => updatePage(selectedPageIndex!, { id: e.target.value })}
                  />
                  <small>Unique identifier (no spaces, lowercase recommended)</small>
                </div>

                <div className="form-group">
                  <label>URL Path</label>
                  <input
                    type="text"
                    value={selectedPage.path}
                    onChange={(e) => updatePage(selectedPageIndex!, { path: e.target.value })}
                  />
                  <small>Must start with / (e.g., /my-page)</small>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={selectedPage.title}
                    onChange={(e) => updatePage(selectedPageIndex!, { title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={selectedPage.description || ''}
                    onChange={(e) => updatePage(selectedPageIndex!, { description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Image</label>
                  <select
                    value={selectedPage.image}
                    onChange={(e) => updatePage(selectedPageIndex!, { image: e.target.value })}
                  >
                    {availableImages.map((img) => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>
                  {selectedPage.image && (
                    <>
                      <div className="image-preview">
                        <img src={selectedPage.image} alt="Preview" />
                      </div>
                      <div className="image-actions">
                        <label className="btn-change-image">
                          🔄 Change Image (Replace File)
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageReplacement(e, selectedPage.image)}
                          />
                        </label>
                        <small>Upload a new version of this image. The filename stays the same, only the file content changes.</small>
                      </div>
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label>Parent Page</label>
                  <select
                    value={selectedPage.parent || ''}
                    onChange={(e) => updatePage(selectedPageIndex!, {
                      parent: e.target.value || undefined
                    })}
                  >
                    <option value="">None (Top Level)</option>
                    {config.pages
                      .filter((p) => p.id !== selectedPage.id)
                      .map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedPage.showInNav}
                      onChange={(e) => updatePage(selectedPageIndex!, { showInNav: e.target.checked })}
                    />
                    Show in Navigation
                  </label>
                  <small>Display this page in the top navigation menu</small>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <h3>Hotspots ({selectedPage.hotspots.length})</h3>
                  <button className="btn-add" onClick={() => addHotspot(selectedPageIndex!)}>
                    + Add Hotspot
                  </button>
                </div>

                {selectedPage.hotspots.map((hotspot, hotspotIndex) => (
                  <div key={hotspot.id} className="hotspot-editor">
                    <div className="hotspot-header">
                      <strong>Hotspot: {hotspot.label}</strong>
                      <button
                        className="btn-delete-small"
                        onClick={() => deleteHotspot(selectedPageIndex!, hotspotIndex)}
                      >
                        × Delete
                      </button>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Label</label>
                        <input
                          type="text"
                          value={hotspot.label}
                          onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                            label: e.target.value
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Shape</label>
                        <select
                          value={hotspot.shape}
                          onChange={(e) => {
                            const shape = e.target.value as 'rect' | 'circle' | 'polygon';
                            let newCoords = hotspot.coords;

                            // Set default coordinates based on shape
                            if (shape === 'rect') {
                              newCoords = { x: 25, y: 25, width: 50, height: 50 };
                            } else if (shape === 'circle') {
                              newCoords = { cx: 50, cy: 50, r: 20 };
                            } else if (shape === 'polygon') {
                              newCoords = { points: '50,10 90,50 50,90 10,50' };
                            }

                            updateHotspot(selectedPageIndex!, hotspotIndex, {
                              shape,
                              coords: newCoords
                            });
                          }}
                        >
                          <option value="rect">Rectangle</option>
                          <option value="circle">Circle</option>
                          <option value="polygon">Polygon</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Target Page</label>
                        <select
                          value={hotspot.targetPage}
                          onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                            targetPage: e.target.value
                          })}
                        >
                          {config.pages.map((page) => (
                            <option key={page.id} value={page.path}>
                              {page.title} ({page.path})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="coords-editor">
                      <h4>Coordinates (0-100%)</h4>
                      {hotspot.shape === 'rect' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label>X</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.x || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, x: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Y</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.y || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, y: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Width</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.width || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, width: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Height</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.height || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, height: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>
                      )}

                      {hotspot.shape === 'circle' && (
                        <div className="form-row">
                          <div className="form-group">
                            <label>Center X</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.cx || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, cx: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Center Y</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.cy || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, cy: Number(e.target.value) }
                              })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Radius</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={hotspot.coords.r || 0}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                coords: { ...hotspot.coords, r: Number(e.target.value) }
                              })}
                            />
                          </div>
                        </div>
                      )}

                      {hotspot.shape === 'polygon' && (
                        <div className="form-group">
                          <label>Points (x1,y1 x2,y2 ...)</label>
                          <textarea
                            value={hotspot.coords.points || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              coords: { points: e.target.value }
                            })}
                            rows={3}
                          />
                          <small>Format: "50,10 90,50 50,90 10,50" (space-separated x,y pairs)</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a page from the sidebar to edit</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
