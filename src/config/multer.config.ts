import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  
  fileFilter: function (req, file, cb) {
    console.log(`Processing file: ${file.originalname}`);
    
    const filetypes = /jpeg|jpg|png|webp/; // Added webp support
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      console.log(`✅ File accepted: ${file.originalname}`);
      return cb(null, true);
    } else {
      console.log(`❌ File rejected: ${file.originalname} - Invalid format`);
      return cb(new Error(`Only .png, .jpg, .jpeg and .webp formats allowed! Received: ${file.mimetype}`));
    }
  },
  
  limits: { 
    fileSize: 1024 * 1024 * 5, // 5MB limit
    files: 10, // Maximum 10 files
  },
});

// Middleware to handle upload completion
export const handleUploadSuccess = (req:any, res:any, next:any) => {
  if (req.files && req.files.length > 0) {
    console.log(`🎉 Successfully uploaded ${req.files.length} file(s)`);
    req.files.forEach((file:any) => {
      console.log(`📁 Uploaded: ${file.filename} (${file.size} bytes)`);
    });
  }
  next();
};

export default upload;
