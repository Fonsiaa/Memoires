import express from 'express';

const router = express.Router();

// Comments API disabled — model removed. Return 501 for all endpoints.
router.use((req, res) => {
  res.status(501).json({ error: 'Comments API is disabled on this server' });
});

export default router;
