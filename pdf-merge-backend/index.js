require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const libre = require('libreoffice-convert');

// Yeni konfigürasyon
libre.convertAsync = require('util').promisify(libre.convert);

// Windows için özel yol ayarı
if (process.platform === 'win32') {
    const possiblePaths = [
        'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe',
        'C:\\Program Files\\LibreOffice\\App\\libreoffice\\program\\soffice.exe',
        'C:\\Program Files\\LibreOffice\\LibreOffice\\program\\soffice.exe',
        process.env.LOCALAPPDATA + '\\Programs\\LibreOffice\\program\\soffice.exe'
    ];

    const existingPath = possiblePaths.find(path => {
        const exists = fs.existsSync(path);
        console.log(`Checking path: ${path} - ${exists ? 'Found' : 'Not found'}`);
        return exists;
    });
    
    if (existingPath) {
        libre.convert.soffice = existingPath;
        console.log('LibreOffice found at:', existingPath);
    } else {
        console.error('LibreOffice not found in common locations! Please install LibreOffice from https://www.libreoffice.org/download/download/');
    }
}

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

if (!fs.existsSync('temp')) {
    fs.mkdirSync('temp');
}

const app = express();
app.use(cors());

// PDF için multer konfigürasyonu
const pdfStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const pdfUpload = multer({
  storage: pdfStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: pdfFilter
});

// DOCX için multer konfigürasyonu
const docxStorage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const docxFilter = (req, file, cb) => {
  if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.mimetype === 'application/msword') {
    cb(null, true);
  } else {
    cb(new Error('Only Word documents (.doc, .docx) are allowed'), false);
  }
};

const docxUpload = multer({
  storage: docxStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: docxFilter
});

// PDF merge endpoint - ESKİ ÇALIŞAN HALİ
app.post('/merge', pdfUpload.array('pdfs', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({
                error: 'Please upload at least 2 PDF files.'
            });
        }

        const mergedPdf = await PDFDocument.create();

        for (const file of req.files) {
            const pdfBytes = await fsPromises.readFile(file.path);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save();
        const outputPath = path.join(__dirname, 'temp', `${Date.now()}_merged.pdf`);
        await fsPromises.writeFile(outputPath, mergedPdfFile);

        res.download(outputPath, 'merged.pdf', async (err) => {
            try {
                // Cleanup
                for (const file of req.files) {
                    await fsPromises.unlink(file.path);
                }
                await fsPromises.unlink(outputPath);
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        });
    } catch (error) {
        console.error('PDF merge error:', error);
        res.status(500).json({
            error: 'An error occurred while merging PDF files.'
        });
    }
});

// DOCX to PDF endpoint
app.post('/convert', docxUpload.single('docx'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const inputPath = req.file.path;
        const outputPath = path.join(__dirname, 'temp', `${Date.now()}_output.pdf`);
        
        const docxBuffer = await fsPromises.readFile(inputPath);
        const pdfBuffer = await libre.convertAsync(docxBuffer, '.pdf', undefined);
        
        await fsPromises.writeFile(outputPath, pdfBuffer);
        
        res.download(outputPath, 'converted.pdf', async (err) => {
            try {
                await fsPromises.unlink(inputPath);
                await fsPromises.unlink(outputPath);
            } catch (cleanupError) {
                console.error('Error cleaning up:', cleanupError);
            }
        });

    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).send('Error converting file');
    }
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size too large. Maximum size is 10MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                error: 'Too many files. Maximum is 10 files.'
            });
        }
        return res.status(400).json({
            error: 'File upload error',
            details: error.message
        });
    }
    next(error);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});