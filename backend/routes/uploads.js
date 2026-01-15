import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

import fs from 'fs';
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const name = `${Date.now()}-${Math.floor(Math.random()*10000)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); 

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const host = req.get('host');
  const protocol = req.protocol;
  const url = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;