import express, { Request, Response } from 'express';
import multer from 'multer';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
});

router.post('/', upload.single('pdf'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
        }

        console.log('📄 PDF received:', req.file.originalname, req.file.size, 'bytes');

        const pdfParse = require('pdf-parse');
        const data = await pdfParse(req.file.buffer);

        console.log('✅ PDF extracted:', data.numpages, 'pages,', data.text.length, 'chars');

        return res.status(200).json({
            success: true,
            message: 'PDF text extracted successfully',
            data: {
                text: data.text,
                numPages: data.numpages,
                info: data.info || {},
            },
        });
    } catch (error: any) {
        console.error('❌ PDF Extract Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to extract PDF text',
            error: error.message,
        });
    }
});

export const PdfExtractRoutes = router;
