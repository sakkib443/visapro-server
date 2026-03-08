import express from 'express';
import { Ticket } from './ticket.model';

const router = express.Router();

// GET all tickets (sorted by latest)
router.get('/', async (_req: any, res: any) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: tickets });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET single ticket by ID
router.get('/:id', async (req: any, res: any) => {
    try {
        const ticket = await Ticket.findById(req.params.id).lean();
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, data: ticket });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST create new ticket
router.post('/', async (req: any, res: any) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json({ success: true, data: ticket });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// PUT update ticket
router.put('/:id', async (req: any, res: any) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        res.json({ success: true, data: ticket });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// DELETE ticket
router.delete('/:id', async (req: any, res: any) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Ticket deleted' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export const TicketRoutes = router;
