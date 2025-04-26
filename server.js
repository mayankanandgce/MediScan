const express = require("express");
const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");
const Tesseract = require("tesseract.js");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 5000;

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload directory");
}

// Enable CORS with more specific options for troubleshooting
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.basename(file.originalname)}`);
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Handle pre-flight requests for complex requests
app.options('/upload', cors());

// API Route: Upload Image & Process It
app.post("/upload", upload.single("image"), async (req, res) => {
  console.log("Received upload request");
  
  if (!req.file) {
    console.log("No file in request");
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File received:", req.file.filename);
  
  const imagePath = req.file.path;
  const processedPath = path.join(uploadDir, `processed_${req.file.filename}`);

  try {
    // Step 1: Preprocess Image Using Jimp
    console.log("Starting image preprocessing...");
    const image = await Jimp.read(imagePath);
    await image
      .greyscale()
      .contrast(0.5)
      .resize(1000, Jimp.AUTO)
      .writeAsync(processedPath);

    console.log("✅ Image preprocessing done! Running OCR...");

    // Step 2: Run OCR Using Tesseract.js
    const { data } = await Tesseract.recognize(processedPath, "eng", {
      logger: progress => {
        if (progress.status === 'recognizing text') {
          console.log(`OCR progress: ${progress.progress * 100}%`);
        }
      },
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      tessedit_pageseg_mode: 6,
    });

    console.log("📝 OCR completed. Text extracted length:", data.text.length);

    // Clean up the extracted text
    const cleanedText = data.text
      .split("\n")
      .filter(line => line.trim())
      .join("\n");

    // Step 3: Send Extracted Text As JSON Response
    res.json({
      status: "success",
      message: "OCR completed!",
      image_details: {
        original_file: req.file.filename,
        processed_file: path.basename(processedPath),
      },
      extracted_text: cleanedText,
    });

  } catch (error) {
    console.error("❌ Error during OCR processing:", error);
    res.status(500).json({ 
      error: "OCR processing failed",
      details: error.message 
    });
  }
});

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'OCR API is working!' });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
});
