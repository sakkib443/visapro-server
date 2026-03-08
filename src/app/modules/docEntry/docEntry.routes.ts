import express from 'express';
import { DocEntry } from './docEntry.model';

const router = express.Router();

// GET all
router.get('/', async (_req: any, res: any) => {
    try {
        const docs = await DocEntry.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: docs });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET one
router.get('/:id', async (req: any, res: any) => {
    try {
        const doc = await DocEntry.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, data: doc });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create
router.post('/', async (req: any, res: any) => {
    try {
        const doc = await DocEntry.create(req.body);
        res.status(201).json({ success: true, data: doc });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT update
router.put('/:id', async (req: any, res: any) => {
    try {
        const doc = await DocEntry.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, data: doc });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req: any, res: any) => {
    try {
        await DocEntry.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Document deleted' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export const DocEntryRoutes = router;
