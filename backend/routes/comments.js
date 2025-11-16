import express from 'express';
import Comment from '../Models/comment.js';

const router = express.Router();

// List all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a comment
router.post('/', async (req, res) => {
    const { authorId, authorName, text } = req.body;
    if (!authorId || !authorName || !text) return res.status(400).json({ error: 'Missing fields' });
    try {
        const c = new Comment({ authorId, authorName, text, likes: [] });
        await c.save();
        res.status(201).json(c);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a comment (only text)
router.put('/:id', async (req, res) => {
    const { text } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Not found' });
        comment.text = text || comment.text;
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Toggle like
router.post('/:id/like', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Not found' });
        const idx = comment.likes.findIndex(id => id.toString() === userId);
        if (idx === -1) comment.likes.push(userId);
        else comment.likes.splice(idx, 1);
        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
