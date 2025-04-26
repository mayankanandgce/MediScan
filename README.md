Project Overview
This repository currently consists of two core files:

1️⃣ server.js – The backend implementation 2️⃣ index.html – The frontend interface (still under development)

Backend (server.js)
The backend is built using Node.js and integrates two key libraries: ✅ Jimp (v0.22.8) – A JavaScript image processing library used for enhancing image contrast and clarity before OCR. ✅ Tesseract.js – An OCR engine that extracts text from images.

Before running the local server, ensure both dependencies are installed:

bash
npm install jimp@0.22.8 tesseract.js
💡 Note: Some versions of Jimp may cause compatibility issues. The latest stable version is Jimp v1.6.0. If needed, consider upgrading for better performance.

Frontend (index.html)
The frontend is currently in development and serves as the user interface for uploading images and displaying extracted text. It will interact with the backend via fetch API to send images and retrieve OCR-processed text dynamically.

This setup enables seamless image processing and text extraction, making it a robust foundation for an OCR-powered web application. 🚀
