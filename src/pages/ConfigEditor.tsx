import { useState, useEffect, useRef } from 'react';
import { PageConfig, PresentationConfig, HotspotRegion, HotspotActionType } from '../types/presentation.types';
import { HotspotEditor } from '../components/VisualEditor/HotspotEditor';
import './ConfigEditor.css';

const API_BASE = 'http://localhost:3001/api';

interface Backup {
  name: string;
  config: PageConfig;
  createdAt: string;
}

interface ExportedPresentation {
  name: string;
  pageCount: number;
  title: string;
  createdAt: string;
}

export function ConfigEditor() {
  const [config, setConfig] = useState<PresentationConfig | null>(null);
  const [selectedPageIndex, setSelectedPageIndex] = useState<number | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [showBackupsModal, setShowBackupsModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
  const [exportName, setExportName] = useState('');
  const [exportedPresentations, setExportedPresentations] = useState<ExportedPresentation[]>([]);
  const [selectedImport, setSelectedImport] = useState<string | null>(null);

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

  const backupPage = async (index: number) => {
    if (!config) return;

    const page = config.pages[index];
    const backupName = prompt('Enter a name for this backup:', page.id);

    if (!backupName) return;

    try {
      const response = await fetch(`${API_BASE}/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageConfig: page,
          backupName: backupName
        })
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('success', `Page backed up as: ${data.backupName}`);

        // Remove the page from config after successful backup
        const newPages = config.pages.filter((_, i) => i !== index);
        setConfig({ ...config, pages: newPages });

        if (selectedPageIndex === index) {
          setSelectedPageIndex(null);
        } else if (selectedPageIndex !== null && selectedPageIndex > index) {
          setSelectedPageIndex(selectedPageIndex - 1);
        }
      } else {
        showMessage('error', 'Failed to backup page');
      }
    } catch (error) {
      showMessage('error', 'Failed to backup page');
    }
  };

  const loadBackups = async () => {
    try {
      const response = await fetch(`${API_BASE}/backups`);
      const data = await response.json();
      setBackups(data);
    } catch (error) {
      showMessage('error', 'Failed to load backups');
    }
  };

  const restoreBackup = async (backupName: string) => {
    if (!config) return;

    try {
      // Get the backup config to check if parent exists
      const backup = backups.find(b => b.name === backupName);
      if (!backup) return;

      // Check if the parent page still exists in the current config
      const parentExists = backup.config.parent
        ? config.pages.some(p => p.id === backup.config.parent)
        : true;

      const response = await fetch(`${API_BASE}/restore-backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backupName: backupName,
          parentExists: parentExists
        })
      });

      if (response.ok) {
        const data = await response.json();
        const restoredPage = data.pageConfig;

        // Add the restored page to the config
        setConfig({
          ...config,
          pages: [...config.pages, restoredPage]
        });

        showMessage('success', 'Backup restored successfully');
        setShowBackupsModal(false);
        setSelectedBackup(null);
      } else {
        showMessage('error', 'Failed to restore backup');
      }
    } catch (error) {
      showMessage('error', 'Failed to restore backup');
    }
  };

  const deleteBackup = async (backupName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the backup "${backupName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/backup/${encodeURIComponent(backupName)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('success', 'Backup deleted successfully');
        loadBackups(); // Refresh the list
        setSelectedBackup(null);
      } else {
        showMessage('error', 'Failed to delete backup');
      }
    } catch (error) {
      showMessage('error', 'Failed to delete backup');
    }
  };

  const loadExportedPresentations = async () => {
    try {
      const response = await fetch(`${API_BASE}/exported-presentations`);
      const data = await response.json();
      setExportedPresentations(data);
    } catch (error) {
      showMessage('error', 'Failed to load exported presentations');
    }
  };

  const togglePageSelection = (pageId: string) => {
    const newSelection = new Set(selectedPageIds);

    if (newSelection.has(pageId)) {
      // Deselect this page and all its children
      const removePageAndChildren = (id: string) => {
        newSelection.delete(id);
        const children = config?.pages.filter(p => p.parent === id) || [];
        children.forEach(child => removePageAndChildren(child.id));
      };
      removePageAndChildren(pageId);
    } else {
      // Select this page and all its children
      const addPageAndChildren = (id: string) => {
        newSelection.add(id);
        const children = config?.pages.filter(p => p.parent === id) || [];
        children.forEach(child => addPageAndChildren(child.id));
      };
      addPageAndChildren(pageId);
    }

    setSelectedPageIds(newSelection);
  };

  const exportPresentation = async (deleteAfter: boolean) => {
    if (!exportName.trim()) {
      showMessage('error', 'Presentation name is required');
      return;
    }

    if (selectedPageIds.size === 0) {
      showMessage('error', 'Please select at least one page to export');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/export-presentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageIds: Array.from(selectedPageIds),
          presentationName: exportName,
          deleteAfterExport: deleteAfter
        })
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('success', data.message);
        setShowExportModal(false);
        setExportName('');
        setSelectedPageIds(new Set());

        // Reload config if pages were deleted
        if (deleteAfter) {
          await loadConfig();
        }
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to export presentation');
      }
    } catch (error) {
      showMessage('error', 'Failed to export presentation');
    }
  };

  const exportToDownload = async () => {
    if (!exportName.trim()) {
      showMessage('error', 'Presentation name is required');
      return;
    }

    if (selectedPageIds.size === 0) {
      showMessage('error', 'Please select at least one page to export');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/export-presentation-zip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageIds: Array.from(selectedPageIds),
          presentationName: exportName
        })
      });

      if (response.ok) {
        // Download the ZIP file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportName}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showMessage('success', `Presentation downloaded as ${exportName}.zip`);
        setShowExportModal(false);
        setExportName('');
        setSelectedPageIds(new Set());
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to export presentation');
      }
    } catch (error) {
      showMessage('error', 'Failed to export presentation');
    }
  };

  const importPresentation = async () => {
    if (!selectedImport) {
      showMessage('error', 'Please select a presentation to import');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/import-presentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentationName: selectedImport
        })
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('success', `${data.message} - ${data.importedPages} pages imported`);
        setShowImportModal(false);
        setSelectedImport(null);
        await loadConfig();
        await loadImages();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to import presentation');
      }
    } catch (error) {
      showMessage('error', 'Failed to import presentation');
    }
  };

  const handleZipImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('zipFile', file);

    try {
      const response = await fetch(`${API_BASE}/import-presentation-zip`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('success', `${data.message} - ${data.importedPages} pages imported`);
        setShowImportModal(false);
        await loadConfig();
        await loadImages();
      } else {
        const error = await response.json();
        showMessage('error', error.error || 'Failed to import ZIP file');
      }
    } catch (error) {
      showMessage('error', 'Failed to import ZIP file');
    }

    // Reset file input
    event.target.value = '';
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
      actionType: 'navigation',
      targetPage: config.pages[0]?.path || '/',
      label: 'New Hotspot',
      content: {}
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

  // Helper function to calculate the depth of a page based on its parent hierarchy
  const getPageDepth = (pageId: string, depth = 0): number => {
    if (depth > 10) return 0; // Prevent infinite loops
    const page = config.pages.find(p => p.id === pageId);
    if (!page || !page.parent) return depth;
    return getPageDepth(page.parent, depth + 1);
  };

  // Helper function to organize pages hierarchically
  const organizePages = () => {
    const result: Array<{ page: PageConfig; index: number; depth: number }> = [];
    const addedIds = new Set<string>();

    const addPageWithChildren = (pageId: string | null, currentDepth = 0) => {
      // Find all pages with this parent (or no parent if pageId is null)
      const children = config.pages
        .map((page, index) => ({ page, index }))
        .filter(({ page }) => {
          const parent = page.parent || null;
          return parent === pageId && !addedIds.has(page.id);
        });

      children.forEach(({ page, index }) => {
        addedIds.add(page.id);
        result.push({ page, index, depth: currentDepth });
        // Recursively add children
        addPageWithChildren(page.id, currentDepth + 1);
      });
    };

    // Start with root pages (pages with no parent)
    addPageWithChildren(null, 0);

    // Add any orphaned pages at the end (pages whose parent doesn't exist)
    config.pages.forEach((page, index) => {
      if (!addedIds.has(page.id)) {
        const depth = getPageDepth(page.id);
        result.push({ page, index, depth });
        addedIds.add(page.id);
      }
    });

    return result;
  };

  const organizedPages = organizePages();
  const selectedPage = selectedPageIndex !== null ? config.pages[selectedPageIndex] : null;

  return (
    <div className="config-editor">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleAddPageImage}
      />
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip,application/zip"
        style={{ display: 'none' }}
        onChange={handleZipImport}
      />

      <header className="config-editor-header">
        <h1>Configuration Editor</h1>
        <div className="config-editor-actions">
          <button
            className="btn-export"
            onClick={() => {
              setSelectedPageIds(new Set());
              setExportName('');
              setShowExportModal(true);
            }}
          >
            📤 Export
          </button>
          <button
            className="btn-import"
            onClick={() => {
              loadExportedPresentations();
              setSelectedImport(null);
              setShowImportModal(true);
            }}
          >
            📥 Import
          </button>
          <button
            className="btn-backup-list"
            onClick={() => {
              loadBackups();
              setShowBackupsModal(true);
            }}
          >
            📦 Backups
          </button>
          <button className="btn-save" onClick={saveConfig} disabled={saving}>
            {saving ? 'Saving...' : '💾 Save'}
          </button>
          <a href="/" target="_blank" className="btn-preview">
            🔍 Preview
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
              {organizedPages.map(({ page, index, depth }) => (
                <li
                  key={page.id}
                  className={`page-item ${selectedPageIndex === index ? 'active' : ''}`}
                  style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
                  onClick={() => setSelectedPageIndex(index)}
                >
                  <div className="page-item-content">
                    {depth > 0 && <span className="hierarchy-indicator">└─</span>}
                    <strong>{page.title}</strong>
                    <small>{page.path}</small>
                  </div>
                  <button
                    className="btn-backup-small"
                    onClick={(e) => {
                      e.stopPropagation();
                      backupPage(index);
                    }}
                    title="Backup this page"
                  >
                    📦
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
                  <div className="button-group">
                    <button className="btn-visual-editor" onClick={() => setShowVisualEditor(true)}>
                      ✏️ Visual Editor
                    </button>
                    <button className="btn-add" onClick={() => addHotspot(selectedPageIndex!)}>
                      + Add Hotspot
                    </button>
                  </div>
                </div>

                {selectedPage.hotspots.map((hotspot, hotspotIndex) => {
                  // Get icon for hotspot type
                  const getHotspotIcon = (actionType: HotspotActionType) => {
                    switch (actionType) {
                      case 'navigation': return '🔗';
                      case 'external-link': return '🌐';
                      case 'tooltip': return '💬';
                      case 'text-popup': return '📝';
                      case 'image-popup': return '🖼️';
                      case 'video-popup': return '🎥';
                      case 'iframe-popup': return '🎬';
                      default: return '❓';
                    }
                  };

                  return (
                  <div key={hotspot.id} className="hotspot-editor">
                    <div className="hotspot-header">
                      <strong>{getHotspotIcon(hotspot.actionType)} Hotspot: {hotspot.label}</strong>
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
                        <label>Action Type</label>
                        <select
                          value={hotspot.actionType}
                          onChange={(e) => {
                            const actionType = e.target.value as HotspotActionType;
                            updateHotspot(selectedPageIndex!, hotspotIndex, {
                              actionType,
                              content: hotspot.content || {}
                            });
                          }}
                        >
                          <option value="navigation">🔗 Navigate to Page</option>
                          <option value="external-link">🌐 External Link</option>
                          <option value="tooltip">💬 Tooltip (Hover)</option>
                          <option value="text-popup">📝 Text Popup</option>
                          <option value="image-popup">🖼️ Image Popup</option>
                          <option value="video-popup">🎥 Video Popup</option>
                          <option value="iframe-popup">🎬 Iframe Demo</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditional fields based on action type */}
                    {hotspot.actionType === 'navigation' && (
                      <div className="form-group">
                        <label>Target Page</label>
                        <select
                          value={hotspot.targetPage || ''}
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
                    )}

                    {hotspot.actionType === 'external-link' && (
                      <div className="form-group">
                        <label>External URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com"
                          value={hotspot.content?.url || ''}
                          onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                            content: { ...hotspot.content, url: e.target.value }
                          })}
                        />
                      </div>
                    )}

                    {(hotspot.actionType === 'tooltip' || hotspot.actionType === 'text-popup') && (
                      <>
                        <div className="form-group">
                          <label>Text Content</label>
                          <textarea
                            rows={4}
                            placeholder="Enter text content..."
                            value={hotspot.content?.text || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, text: e.target.value }
                            })}
                          />
                        </div>
                        {hotspot.actionType === 'text-popup' && (
                          <>
                            <div className="form-group">
                              <label>Popup Title</label>
                              <input
                                type="text"
                                placeholder="Optional title"
                                value={hotspot.content?.popupTitle || ''}
                                onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                  content: { ...hotspot.content, popupTitle: e.target.value }
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>Popup Size</label>
                              <select
                                value={hotspot.content?.popupWidth || 'medium'}
                                onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                  content: { ...hotspot.content, popupWidth: e.target.value as any }
                                })}
                              >
                                <option value="small">Small (600px)</option>
                                <option value="medium">Medium (900px)</option>
                                <option value="large">Large (1200px)</option>
                                <option value="fullscreen">Fullscreen</option>
                              </select>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {hotspot.actionType === 'image-popup' && (
                      <>
                        <div className="form-group">
                          <label>Image URL</label>
                          <input
                            type="text"
                            placeholder="/images/example.png"
                            value={hotspot.content?.imageSrc || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, imageSrc: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Image Alt Text</label>
                          <input
                            type="text"
                            placeholder="Description of image"
                            value={hotspot.content?.imageAlt || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, imageAlt: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Popup Title</label>
                          <input
                            type="text"
                            placeholder="Optional title"
                            value={hotspot.content?.popupTitle || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupTitle: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Popup Size</label>
                          <select
                            value={hotspot.content?.popupWidth || 'large'}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupWidth: e.target.value as any }
                            })}
                          >
                            <option value="small">Small (600px)</option>
                            <option value="medium">Medium (900px)</option>
                            <option value="large">Large (1200px)</option>
                            <option value="fullscreen">Fullscreen</option>
                          </select>
                        </div>
                      </>
                    )}

                    {hotspot.actionType === 'video-popup' && (
                      <>
                        <div className="form-group">
                          <label>Video URL (MP4/WebM)</label>
                          <input
                            type="text"
                            placeholder="/videos/demo.mp4"
                            value={hotspot.content?.videoSrc || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, videoSrc: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Video Poster (Thumbnail)</label>
                          <input
                            type="text"
                            placeholder="/images/video-thumb.png (optional)"
                            value={hotspot.content?.videoPoster || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, videoPoster: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={hotspot.content?.videoAutoplay || false}
                              onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                                content: { ...hotspot.content, videoAutoplay: e.target.checked }
                              })}
                            />
                            {' '}Autoplay when modal opens
                          </label>
                        </div>
                        <div className="form-group">
                          <label>Popup Title</label>
                          <input
                            type="text"
                            placeholder="Optional title"
                            value={hotspot.content?.popupTitle || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupTitle: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Popup Size</label>
                          <select
                            value={hotspot.content?.popupWidth || 'large'}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupWidth: e.target.value as any }
                            })}
                          >
                            <option value="small">Small (600px)</option>
                            <option value="medium">Medium (900px)</option>
                            <option value="large">Large (1200px)</option>
                            <option value="fullscreen">Fullscreen</option>
                          </select>
                        </div>
                      </>
                    )}

                    {hotspot.actionType === 'iframe-popup' && (
                      <>
                        <div className="form-group">
                          <label>Iframe URL (HTTPS only)</label>
                          <input
                            type="url"
                            pattern="https://.*"
                            placeholder="https://example.com/demo"
                            value={hotspot.content?.iframeSrc || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, iframeSrc: e.target.value }
                            })}
                          />
                          <small>Only HTTPS URLs are allowed for security</small>
                        </div>
                        <div className="form-group">
                          <label>Iframe Title</label>
                          <input
                            type="text"
                            placeholder="Demo environment"
                            value={hotspot.content?.iframeTitle || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, iframeTitle: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Popup Title</label>
                          <input
                            type="text"
                            placeholder="Optional title"
                            value={hotspot.content?.popupTitle || ''}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupTitle: e.target.value }
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Popup Size</label>
                          <select
                            value={hotspot.content?.popupWidth || 'fullscreen'}
                            onChange={(e) => updateHotspot(selectedPageIndex!, hotspotIndex, {
                              content: { ...hotspot.content, popupWidth: e.target.value as any }
                            })}
                          >
                            <option value="small">Small (600px)</option>
                            <option value="medium">Medium (900px)</option>
                            <option value="large">Large (1200px)</option>
                            <option value="fullscreen">Fullscreen</option>
                          </select>
                        </div>
                      </>
                    )}

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
                );
                })}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select a page from the sidebar to edit</p>
            </div>
          )}
        </main>
      </div>

      {showBackupsModal && (
        <div className="modal-overlay" onClick={() => setShowBackupsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Backups</h2>
              <button className="btn-close" onClick={() => setShowBackupsModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {backups.length === 0 ? (
                <p className="no-backups">No backups found</p>
              ) : (
                <div className="backups-list">
                  {backups.map((backup) => (
                    <div
                      key={backup.name}
                      className={`backup-item ${selectedBackup === backup.name ? 'selected' : ''}`}
                      onClick={() => setSelectedBackup(backup.name)}
                    >
                      <div className="backup-info">
                        <strong>{backup.name}</strong>
                        {backup.config && (
                          <div className="backup-details">
                            <small>Page: {backup.config.title}</small>
                            <small>Path: {backup.config.path}</small>
                            {backup.config.parent && (
                              <small>Parent: {backup.config.parent}</small>
                            )}
                            <small>Created: {new Date(backup.createdAt).toLocaleString()}</small>
                          </div>
                        )}
                      </div>
                      <div className="backup-actions">
                        <button
                          className="btn-restore"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreBackup(backup.name);
                          }}
                        >
                          ↩️ Restore
                        </button>
                        <button
                          className="btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBackup(backup.name);
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Export Presentation</h2>
              <button className="btn-close" onClick={() => setShowExportModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Presentation Name *</label>
                <input
                  type="text"
                  value={exportName}
                  onChange={(e) => setExportName(e.target.value)}
                  placeholder="Enter presentation name..."
                  className="export-name-input"
                />
                <small>This name will be used for the export folder</small>
              </div>

              <div className="form-group">
                <label>Select Pages to Export ({selectedPageIds.size} selected)</label>
                <div className="export-pages-list">
                  {organizePages().map(({ page, depth }) => (
                    <div
                      key={page.id}
                      className="export-page-item"
                      style={{ paddingLeft: `${1 + depth * 1.5}rem` }}
                    >
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedPageIds.has(page.id)}
                          onChange={() => togglePageSelection(page.id)}
                        />
                        {depth > 0 && <span className="hierarchy-indicator">└─</span>}
                        <span className="page-title">{page.title}</span>
                        <span className="page-path">{page.path}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <div className="export-buttons-group">
                  <h4>Export to Library:</h4>
                  <div className="button-row">
                    <button
                      className="btn-export-action"
                      onClick={() => exportPresentation(false)}
                      disabled={!exportName.trim() || selectedPageIds.size === 0}
                    >
                      📤 To Library
                    </button>
                    <button
                      className="btn-export-delete"
                      onClick={() => exportPresentation(true)}
                      disabled={!exportName.trim() || selectedPageIds.size === 0}
                    >
                      📤 To Library & Delete
                    </button>
                  </div>
                </div>
                <div className="export-buttons-group">
                  <h4>Export to External:</h4>
                  <div className="button-row">
                    <button
                      className="btn-download"
                      onClick={exportToDownload}
                      disabled={!exportName.trim() || selectedPageIds.size === 0}
                    >
                      💾 Download ZIP
                    </button>
                  </div>
                  <small>Downloads a ZIP file you can save anywhere on your computer</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Import Presentation</h2>
              <button className="btn-close" onClick={() => setShowImportModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="import-section">
                <h3>Import from Library</h3>
                {exportedPresentations.length === 0 ? (
                  <p className="no-backups">No exported presentations found in library</p>
                ) : (
                  <>
                    <div className="import-list">
                      {exportedPresentations.map((presentation) => (
                        <div
                          key={presentation.name}
                          className={`import-item ${selectedImport === presentation.name ? 'selected' : ''}`}
                          onClick={() => setSelectedImport(presentation.name)}
                        >
                          <div className="import-info">
                            <strong>{presentation.name}</strong>
                            <div className="import-details">
                              <small>Pages: {presentation.pageCount}</small>
                              <small>Created: {new Date(presentation.createdAt).toLocaleString()}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn-import-action"
                      onClick={importPresentation}
                      disabled={!selectedImport}
                    >
                      📥 Import from Library
                    </button>
                  </>
                )}
              </div>

              <div className="import-divider">OR</div>

              <div className="import-section">
                <h3>Import from External File</h3>
                <p className="import-description">
                  Upload a ZIP file containing a presentation exported from this or another system
                </p>
                <button
                  className="btn-import-file"
                  onClick={() => zipInputRef.current?.click()}
                >
                  📁 Choose ZIP File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVisualEditor && selectedPageIndex !== null && config && (
        <div className="modal-overlay-fullscreen">
          <HotspotEditor
            imageUrl={config.pages[selectedPageIndex].image}
            initialHotspots={config.pages[selectedPageIndex].hotspots}
            onSave={(updatedHotspots) => {
              updatePage(selectedPageIndex, { hotspots: updatedHotspots });
              saveConfig();
            }}
            onSaveAndClose={(updatedHotspots) => {
              updatePage(selectedPageIndex, { hotspots: updatedHotspots });
              setShowVisualEditor(false);
              saveConfig();
            }}
            onCancel={() => setShowVisualEditor(false)}
          />
        </div>
      )}
    </div>
  );
}
