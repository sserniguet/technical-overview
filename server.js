import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate unique filename like Windows
const getUniqueFilename = (directory, originalName) => {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);

  let filename = originalName;
  let counter = 1;

  // Check if file exists, if so, append (1), (2), etc.
  while (fs.existsSync(path.join(directory, filename))) {
    filename = `${nameWithoutExt} (${counter})${ext}`;
    counter++;
  }

  return filename;
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'images');

    // Check if this is a replacement upload
    if (req.body.replaceFilename) {
      // Replace existing file - use exact same filename
      cb(null, req.body.replaceFilename);
    } else {
      // New upload - use original name with Windows-style numbering if needed
      const uniqueFilename = getUniqueFilename(uploadDir, file.originalname);
      cb(null, uniqueFilename);
    }
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get current configuration
app.get('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read configuration', message: error.message });
  }
});

// Save configuration
app.post('/api/config', (req, res) => {
  try {
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const newConfig = req.body;

    // Validate configuration structure
    if (!newConfig.pages || !Array.isArray(newConfig.pages)) {
      return res.status(400).json({ error: 'Invalid configuration structure' });
    }

    // Write to file with pretty formatting
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2), 'utf8');

    res.json({ success: true, message: 'Configuration saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save configuration', message: error.message });
  }
});

// Upload image
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = `/images/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image', message: error.message });
  }
});

// Get list of available images
app.get('/api/images', (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'public', 'images');
    const files = fs.readdirSync(imagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
    });

    const images = imageFiles.map(file => ({
      filename: file,
      url: `/images/${file}`
    }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images', message: error.message });
  }
});

// Helper function to get unique backup name
const getUniqueBackupName = (baseDir, requestedName) => {
  let backupName = requestedName;
  let counter = 1;

  while (fs.existsSync(path.join(baseDir, backupName))) {
    backupName = `${requestedName} (${counter})`;
    counter++;
  }

  return backupName;
};

// Backup a page
app.post('/api/backup', (req, res) => {
  try {
    const { pageConfig, backupName } = req.body;

    if (!pageConfig || !backupName) {
      return res.status(400).json({ error: 'Page configuration and backup name are required' });
    }

    const backupsDir = path.join(__dirname, 'public', 'backups');

    // Ensure backups directory exists
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Get unique backup name
    const uniqueBackupName = getUniqueBackupName(backupsDir, backupName);
    const backupDir = path.join(backupsDir, uniqueBackupName);

    // Create backup directory
    fs.mkdirSync(backupDir, { recursive: true });

    // Extract image filename from the page config
    const imageUrl = pageConfig.image;
    const imageFilename = imageUrl.split('/').pop();
    const sourceImagePath = path.join(__dirname, 'public', 'images', imageFilename);

    // Copy image to backup directory
    if (fs.existsSync(sourceImagePath)) {
      const destImagePath = path.join(backupDir, imageFilename);
      fs.copyFileSync(sourceImagePath, destImagePath);
    }

    // Save page configuration to backup directory
    const configPath = path.join(backupDir, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(pageConfig, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'Page backed up successfully',
      backupName: uniqueBackupName
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to backup page', message: error.message });
  }
});

// List all backups
app.get('/api/backups', (req, res) => {
  try {
    const backupsDir = path.join(__dirname, 'public', 'backups');

    // Ensure backups directory exists
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
      return res.json([]);
    }

    const backupDirs = fs.readdirSync(backupsDir).filter(file => {
      const fullPath = path.join(backupsDir, file);
      return fs.statSync(fullPath).isDirectory();
    });

    const backups = backupDirs.map(backupName => {
      const backupDir = path.join(backupsDir, backupName);
      const configPath = path.join(backupDir, 'config.json');

      let config = null;
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }

      return {
        name: backupName,
        config: config,
        createdAt: fs.statSync(backupDir).mtime
      };
    });

    // Sort by creation date (newest first)
    backups.sort((a, b) => b.createdAt - a.createdAt);

    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list backups', message: error.message });
  }
});

// Restore a backup
app.post('/api/restore-backup', (req, res) => {
  try {
    const { backupName, parentExists } = req.body;

    if (!backupName) {
      return res.status(400).json({ error: 'Backup name is required' });
    }

    const backupsDir = path.join(__dirname, 'public', 'backups');
    const backupDir = path.join(backupsDir, backupName);

    // Check if backup exists
    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    // Read backup configuration
    const configPath = path.join(backupDir, 'config.json');
    if (!fs.existsSync(configPath)) {
      return res.status(400).json({ error: 'Backup configuration not found' });
    }

    const pageConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // If parent doesn't exist, remove the parent reference
    if (!parentExists) {
      delete pageConfig.parent;
    }

    // Find image file in backup directory
    const files = fs.readdirSync(backupDir);
    const imageFile = files.find(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
    });

    if (imageFile) {
      const sourceImagePath = path.join(backupDir, imageFile);
      const imagesDir = path.join(__dirname, 'public', 'images');
      const destImagePath = path.join(imagesDir, imageFile);

      // Copy image from backup to images directory
      // Use unique filename if file already exists
      const uniqueImageName = getUniqueFilename(imagesDir, imageFile);
      const uniqueDestPath = path.join(imagesDir, uniqueImageName);
      fs.copyFileSync(sourceImagePath, uniqueDestPath);

      // Update image URL in page config
      pageConfig.image = `/images/${uniqueImageName}`;
    }

    res.json({
      success: true,
      message: 'Backup restored successfully',
      pageConfig: pageConfig
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup', message: error.message });
  }
});

// Delete a backup
app.delete('/api/backup/:name', (req, res) => {
  try {
    const backupName = req.params.name;

    if (!backupName) {
      return res.status(400).json({ error: 'Backup name is required' });
    }

    const backupsDir = path.join(__dirname, 'public', 'backups');
    const backupDir = path.join(backupsDir, backupName);

    // Check if backup exists
    if (!fs.existsSync(backupDir)) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    // Delete backup directory and all its contents
    fs.rmSync(backupDir, { recursive: true, force: true });

    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete backup', message: error.message });
  }
});

// Export presentation
app.post('/api/export-presentation', (req, res) => {
  try {
    const { pageIds, presentationName, deleteAfterExport } = req.body;

    if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
      return res.status(400).json({ error: 'Page IDs array is required' });
    }

    if (!presentationName || !presentationName.trim()) {
      return res.status(400).json({ error: 'Presentation name is required' });
    }

    const exportsDir = path.join(__dirname, 'public', 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Get unique export name
    const uniquePresentationName = getUniqueBackupName(exportsDir, presentationName.trim());
    const exportDir = path.join(exportsDir, uniquePresentationName);
    const exportImagesDir = path.join(exportDir, 'images');

    // Create export directory structure
    fs.mkdirSync(exportDir, { recursive: true });
    fs.mkdirSync(exportImagesDir, { recursive: true });

    // Read current configuration
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Filter pages to export
    const pagesToExport = config.pages.filter(page => pageIds.includes(page.id));
    const imagesCopied = new Set();

    // Copy images for exported pages
    pagesToExport.forEach(page => {
      const imageUrl = page.image;
      const imageFilename = imageUrl.split('/').pop();
      const sourceImagePath = path.join(__dirname, 'public', 'images', imageFilename);
      const destImagePath = path.join(exportImagesDir, imageFilename);

      if (fs.existsSync(sourceImagePath) && !imagesCopied.has(imageFilename)) {
        fs.copyFileSync(sourceImagePath, destImagePath);
        imagesCopied.add(imageFilename);
      }
    });

    // Create presentation configuration
    const exportConfig = {
      title: config.title || 'Exported Presentation',
      description: config.description || '',
      pages: pagesToExport
    };

    // Save export configuration
    const exportConfigPath = path.join(exportDir, 'presentation.json');
    fs.writeFileSync(exportConfigPath, JSON.stringify(exportConfig, null, 2), 'utf8');

    // If deleteAfterExport, remove pages from current presentation and delete images
    if (deleteAfterExport) {
      const remainingPages = config.pages.filter(page => !pageIds.includes(page.id));
      config.pages = remainingPages;

      // Save updated configuration
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');

      // Delete images from public/images if not used by remaining pages
      const remainingImageUrls = new Set(remainingPages.map(p => p.image.split('/').pop()));
      imagesCopied.forEach(imageFilename => {
        if (!remainingImageUrls.has(imageFilename)) {
          const imagePath = path.join(__dirname, 'public', 'images', imageFilename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    res.json({
      success: true,
      message: deleteAfterExport
        ? 'Presentation exported and deleted from current presentation'
        : 'Presentation exported successfully',
      exportName: uniquePresentationName,
      exportedPages: pagesToExport.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export presentation', message: error.message });
  }
});

// List exported presentations
app.get('/api/exported-presentations', (req, res) => {
  try {
    const exportsDir = path.join(__dirname, 'public', 'exports');

    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
      return res.json([]);
    }

    const exportDirs = fs.readdirSync(exportsDir).filter(file => {
      const fullPath = path.join(exportsDir, file);
      return fs.statSync(fullPath).isDirectory();
    });

    const exports = exportDirs.map(exportName => {
      const exportDir = path.join(exportsDir, exportName);
      const configPath = path.join(exportDir, 'presentation.json');

      let config = null;
      if (fs.existsSync(configPath)) {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      }

      return {
        name: exportName,
        pageCount: config ? config.pages.length : 0,
        title: config ? config.title : exportName,
        createdAt: fs.statSync(exportDir).mtime
      };
    });

    // Sort by creation date (newest first)
    exports.sort((a, b) => b.createdAt - a.createdAt);

    res.json(exports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list exported presentations', message: error.message });
  }
});

// Import presentation
app.post('/api/import-presentation', (req, res) => {
  try {
    const { presentationName } = req.body;

    if (!presentationName) {
      return res.status(400).json({ error: 'Presentation name is required' });
    }

    const exportsDir = path.join(__dirname, 'public', 'exports');
    const exportDir = path.join(exportsDir, presentationName);

    if (!fs.existsSync(exportDir)) {
      return res.status(404).json({ error: 'Exported presentation not found' });
    }

    // Read export configuration
    const exportConfigPath = path.join(exportDir, 'presentation.json');
    if (!fs.existsSync(exportConfigPath)) {
      return res.status(400).json({ error: 'Export configuration not found' });
    }

    const exportConfig = JSON.parse(fs.readFileSync(exportConfigPath, 'utf8'));

    // Read current configuration
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Check for ID conflicts and rename if necessary
    const existingIds = new Set(currentConfig.pages.map(p => p.id));
    const importedPages = exportConfig.pages.map(page => {
      let pageId = page.id;
      let counter = 1;

      while (existingIds.has(pageId)) {
        pageId = `${page.id}-${counter}`;
        counter++;
      }

      if (pageId !== page.id) {
        // Update references in other pages
        return { ...page, id: pageId, path: `/${pageId}` };
      }

      existingIds.add(pageId);
      return page;
    });

    // Copy images from export to public/images
    const exportImagesDir = path.join(exportDir, 'images');
    const imagesDir = path.join(__dirname, 'public', 'images');

    if (fs.existsSync(exportImagesDir)) {
      const imageFiles = fs.readdirSync(exportImagesDir);
      imageFiles.forEach(imageFile => {
        const sourceImagePath = path.join(exportImagesDir, imageFile);
        const destImagePath = path.join(imagesDir, imageFile);

        // Use unique filename if file already exists
        const uniqueImageName = getUniqueFilename(imagesDir, imageFile);
        const uniqueDestPath = path.join(imagesDir, uniqueImageName);

        fs.copyFileSync(sourceImagePath, uniqueDestPath);

        // Update image URLs in imported pages if filename changed
        if (uniqueImageName !== imageFile) {
          importedPages.forEach(page => {
            if (page.image.endsWith(imageFile)) {
              page.image = `/images/${uniqueImageName}`;
            }
          });
        }
      });
    }

    // Add imported pages to current configuration
    currentConfig.pages = [...currentConfig.pages, ...importedPages];

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), 'utf8');

    res.json({
      success: true,
      message: 'Presentation imported successfully',
      importedPages: importedPages.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import presentation', message: error.message });
  }
});

// Export presentation as downloadable ZIP
app.post('/api/export-presentation-zip', (req, res) => {
  try {
    const { pageIds, presentationName } = req.body;

    if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
      return res.status(400).json({ error: 'Page IDs array is required' });
    }

    if (!presentationName || !presentationName.trim()) {
      return res.status(400).json({ error: 'Presentation name is required' });
    }

    // Read current configuration
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Filter pages to export
    const pagesToExport = config.pages.filter(page => pageIds.includes(page.id));

    // Create presentation configuration
    const exportConfig = {
      title: config.title || 'Exported Presentation',
      description: config.description || '',
      pages: pagesToExport
    };

    // Create ZIP file
    const zip = new JSZip();

    // Add presentation.json to ZIP
    zip.file('presentation.json', JSON.stringify(exportConfig, null, 2));

    // Create images folder in ZIP
    const imagesFolder = zip.folder('images');

    // Add images to ZIP
    const imagesCopied = new Set();
    pagesToExport.forEach(page => {
      const imageUrl = page.image;
      const imageFilename = imageUrl.split('/').pop();
      const sourceImagePath = path.join(__dirname, 'public', 'images', imageFilename);

      if (fs.existsSync(sourceImagePath) && !imagesCopied.has(imageFilename)) {
        const imageData = fs.readFileSync(sourceImagePath);
        imagesFolder.file(imageFilename, imageData);
        imagesCopied.add(imageFilename);
      }
    });

    // Generate ZIP file
    zip.generateAsync({ type: 'nodebuffer' }).then(content => {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${presentationName}.zip"`);
      res.send(content);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export presentation as ZIP', message: error.message });
  }
});

// Configure multer for ZIP file uploads
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `upload-${Date.now()}.zip`);
  }
});

const zipUpload = multer({
  storage: zipStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed' || path.extname(file.originalname).toLowerCase() === '.zip') {
      return cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed!'));
    }
  }
});

// Import presentation from uploaded ZIP file
app.post('/api/import-presentation-zip', zipUpload.single('zipFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No ZIP file provided' });
    }

    const zipFilePath = req.file.path;

    // Read ZIP file
    const zipData = fs.readFileSync(zipFilePath);
    const zip = await JSZip.loadAsync(zipData);

    // Extract presentation.json
    const presentationFile = zip.file('presentation.json');
    if (!presentationFile) {
      fs.unlinkSync(zipFilePath); // Clean up
      return res.status(400).json({ error: 'Invalid presentation ZIP: missing presentation.json' });
    }

    const exportConfig = JSON.parse(await presentationFile.async('text'));

    // Read current configuration
    const configPath = path.join(__dirname, 'src', 'config', 'presentation.json');
    const currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Check for ID conflicts and rename if necessary
    const existingIds = new Set(currentConfig.pages.map(p => p.id));
    const importedPages = exportConfig.pages.map(page => {
      let pageId = page.id;
      let counter = 1;

      while (existingIds.has(pageId)) {
        pageId = `${page.id}-${counter}`;
        counter++;
      }

      if (pageId !== page.id) {
        return { ...page, id: pageId, path: `/${pageId}` };
      }

      existingIds.add(pageId);
      return page;
    });

    // Extract and save images from ZIP
    const imagesDir = path.join(__dirname, 'public', 'images');
    const imagesFolder = zip.folder('images');

    if (imagesFolder) {
      const imageFiles = [];
      imagesFolder.forEach((relativePath, file) => {
        if (!file.dir) {
          imageFiles.push({ relativePath, file });
        }
      });

      for (const { relativePath, file } of imageFiles) {
        const imageData = await file.async('nodebuffer');
        const imageFilename = path.basename(relativePath);

        // Use unique filename if file already exists
        const uniqueImageName = getUniqueFilename(imagesDir, imageFilename);
        const destImagePath = path.join(imagesDir, uniqueImageName);

        fs.writeFileSync(destImagePath, imageData);

        // Update image URLs in imported pages if filename changed
        if (uniqueImageName !== imageFilename) {
          importedPages.forEach(page => {
            if (page.image.endsWith(imageFilename)) {
              page.image = `/images/${uniqueImageName}`;
            }
          });
        }
      }
    }

    // Add imported pages to current configuration
    currentConfig.pages = [...currentConfig.pages, ...importedPages];

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), 'utf8');

    // Clean up uploaded ZIP file
    fs.unlinkSync(zipFilePath);

    res.json({
      success: true,
      message: 'Presentation imported successfully from ZIP',
      importedPages: importedPages.length
    });
  } catch (error) {
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to import presentation from ZIP', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Config API server running on http://localhost:${PORT}`);
});
