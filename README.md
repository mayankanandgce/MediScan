# OCR Web Application (MediScan)

A web-based Optical Character Recognition (OCR) application that extracts text from images using Tesseract.js with image preprocessing capabilities.

## 🚀 Features

- ✅ Upload images through a simple web interface
- ✅ Automatic image preprocessing to enhance OCR accuracy
- ✅ Text extraction from various image formats
- ✅ Real-time display of extracted text
- ✅ Simple and intuitive user interface

## 📋 System Requirements

- Node.js (v14 or later)
- npm (v6 or later)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mayankanandgce/MediScan
   cd mediScan
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `upload` directory in the project root:
   ```bash
   mkdir upload
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the application:
   - Open `http://localhost:5000` in your web browser
   - Or serve the index.html through a local web server

## 🛠️ Technology Stack

### Backend (server.js)

- **Express.js** - Web server framework
- **Multer** - File upload handling
- **Jimp (v0.22.8)** - Image preprocessing
  - Greyscale conversion
  - Contrast enhancement
  - Image resizing
- **Tesseract.js** - OCR engine for text extraction
- **CORS** - Cross-Origin Resource Sharing support

### Frontend (index.html)

- **HTML5/CSS3** - Structure and styling
- **JavaScript** - Client-side interactions
- **Fetch API** - AJAX requests to backend

## 🖥️ How It Works

1. User uploads an image through the web interface
2. Backend receives the image and stores it temporarily
3. Image preprocessing is applied using Jimp:
   - Conversion to greyscale
   - Contrast enhancement (0.5)
   - Resizing to optimal dimensions
4. Preprocessed image is sent to Tesseract.js for OCR
5. Extracted text is returned to the frontend and displayed to the user

## ⚠️ Common Issues and Troubleshooting

### CORS Issues

If accessing the frontend directly from the filesystem (`file://`), you may encounter CORS errors. To resolve:

- Serve the frontend through a basic HTTP server
  ```bash
  npx http-server -p 8080
  ```
  Then visit `http://localhost:8080`

- Or modify the backend CORS settings to allow null origin:
  ```javascript
  app.use(cors({
    origin: ['http://localhost:8080', 'null'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  }));
  ```

### Jimp Version Compatibility

The project currently uses Jimp v0.22.8. For better performance and fewer issues, consider upgrading to the latest stable version (v1.6.0):

```bash
npm uninstall jimp
npm install jimp@1.6.0
```

## 📁 Project Structure

```
├── server.js          # Backend implementation
├── index.html         # Frontend interface
├── upload/            # Temporary storage for uploaded images
├── package.json       # Project dependencies
└── README.md          # Project documentation
```


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Developed with ❤️ by Mayank Anand
