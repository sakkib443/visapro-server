import express from 'express';
import { DocEntry } from './docEntry.model';
import { DocEntryValidation, DOC_ENTRY_FIELDS } from './docEntry.validation';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// Build an explicit, whitelisted payload from the request body so that only
// known DocEntry schema fields are ever written (prevents mass-assignment).
const pickDocEntryFields = (body: any): Record<string, unknown> => {
    const data: Record<string, unknown> = {};
    if (body && typeof body === 'object') {
        for (const key of DOC_ENTRY_FIELDS) {
            if (body[key] !== undefined) {
                data[key] = body[key];
            }
        }
    }
    return data;
};

// GET all
router.get('/', authMiddleware, authorizeRoles('admin'), async (_req: any, res: any, next: any) => {
    try {
        const docs = await DocEntry.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: docs });
    } catch (err: any) {
        next(err);
    }
});

// GET one
router.get('/:id', authMiddleware, authorizeRoles('admin'), async (req: any, res: any, next: any) => {
    try {
        const doc = await DocEntry.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, data: doc });
    } catch (err: any) {
        next(err);
    }
});

// POST create
router.post(
    '/',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(DocEntryValidation.createDocEntrySchema),
    async (req: any, res: any, next: any) => {
        try {
            const payload = pickDocEntryFields(req.body);
            const doc = await DocEntry.create(payload);
            res.status(201).json({ success: true, data: doc });
        } catch (err: any) {
            next(err);
        }
    }
);

// PUT update
router.put(
    '/:id',
    authMiddleware,
    authorizeRoles('admin'),
    validateRequest(DocEntryValidation.updateDocEntrySchema),
    async (req: any, res: any, next: any) => {
        try {
            const payload = pickDocEntryFields(req.body);
            const doc = await DocEntry.findByIdAndUpdate(req.params.id, payload, {
                new: true,
                runValidators: true,
            }).lean();
            if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
            res.json({ success: true, data: doc });
        } catch (err: any) {
            next(err);
        }
    }
);

// DELETE
router.delete('/:id', authMiddleware, authorizeRoles('admin'), async (req: any, res: any, next: any) => {
    try {
        const doc = await DocEntry.findByIdAndDelete(req.params.id);
        if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });
        res.json({ success: true, message: 'Document deleted' });
    } catch (err: any) {
        next(err);
    }
});

export const DocEntryRoutes = router;
