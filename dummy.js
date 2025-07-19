const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dqxivvdnm',
  api_key: '132825274654217',
  api_secret: '4qTw-yQwBCl4U2pZVcCGVkFaLz0',
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept only image files
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// Serve HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Multiple Image Upload to Cloudinary</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-container { margin: 20px 0; }
        .error { color: red; }
        .success { color: green; }
        .image-preview { max-width: 200px; margin: 10px; }
      </style>
    </head>
    <body>
      <h1>Upload Multiple Images to Cloudinary</h1>
      <div class="form-container">
        <form action="/upload" method="POST" enctype="multipart/form-data">
          <label for="images">Select images (max 5):</label>
          <input type="file" name="images" id="images" multiple accept="image/*" required>
          <br><br>
          <input type="submit" value="Upload Images">
        </form>
      </div>
    </body>
    </html>
  `);
});

// Handle multiple image uploads
app.post('/upload', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send(`no such file is uploaded`);
    }

    // Upload images to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: 'uploads',
        resource_type: 'image',
      }),
    );

    const results = await Promise.all(uploadPromises);

    // Clean up local files
    req.files.forEach((file) => {
      fs.unlinkSync(file.path);
    });

    // Generate response with uploaded image URLs
    const imageUrls = results.map((result) => result.secure_url);

    res.send(`
      <div class="success">Images uploaded successfully!</div>
      <h2>Uploaded Images:</h2>
      ${imageUrls.map((url) => `<img src="${url}" class="image-preview" alt="Uploaded image">`).join('')}
      <br><br>
      <a href="/">Upload more images</a>
    `);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send(`
      <div class="error">Error uploading images: ${error.message}</div>
      <a href="/">Go back</a>
    `);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
