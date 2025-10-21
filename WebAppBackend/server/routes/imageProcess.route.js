import express from 'express';
import { processImage, upload } from '../controllers/imageProcess.controller.js';

const router = express.Router();

// POST /api/process-image
router.post('/', upload.single('image'), processImage);

export default router;