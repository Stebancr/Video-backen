import express from 'express';
import { viewVideo, upload, uploadVideo } from '../controllers/video.controller.js';

const router = express.Router();

router.get('/view/:videoId?', viewVideo);
router.post('/upload', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]), uploadVideo);

export default router;
