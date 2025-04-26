const express = require("express");
const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");
const Tesseract = require("tesseract.js");
const cors = require("cors"); // Added CORS for frontend access

const app = express();
const port = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: "upload/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// API Route: Upload Image & Process It
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = req.file.path;
  const processedPath = `upload/processed_${req.file.filename}`;

  try {
    // Step 1: Preprocess Image Using Jimp
    const image = await Jimp.read(imagePath);
    await image
      .greyscale()
      .contrast(0.5)
      .resize(1000, Jimp.AUTO)
      .writeAsync(processedPath);

    console.log("✅ Image preprocessing done! Running OCR...");

    // Step 2: Run OCR Using Tesseract.js
    const { data: { text } } = await Tesseract.recognize(processedPath, "eng", {
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      tessedit_pageseg_mode: 6,
    });

    console.log("📝 Extracted Text:", text);

    // Step 3: Send Extracted Text As JSON Response
    res.json({
      status: "success",
      message: "OCR completed!",
      image_details: {
        original_file: req.file.filename,
        processed_file: `processed_${req.file.filename}`,
      },
      extracted_text: text.split("\n").filter(line => line.trim()).join("\n"), // Fix: send string not array
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "OCR processing failed" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
