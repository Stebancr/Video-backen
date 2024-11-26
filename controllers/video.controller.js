import Video from "../models/video.js";
import User from "../models/user.js";
import multer from 'multer';
import { PutObjectCommand, GetObjectCommand  } from '@aws-sdk/client-s3';
//import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from "../config/s3.js";
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const storage = multer.memoryStorage();
const bucketName = process.env.AWS_BUCKET_NAME;

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Límite de 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

export const uploadVideo = async (req, res) => {
  try {
    const { title, user } = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    // Validations
    if (!title || !videoFile || !thumbnailFile || !user) {
      throw new Error('Se requieren el usuario, el título, el video y la miniatura');
    }
    const userExists = await User.findById(user).catch((err) => {
      console.error("Error:", err.message);
    });
    if (!userExists) {
        return res.status(400).json({ error: 'El usuario no existe' });
    }
    // Prepare video upload
    const videoKey = `${crypto.randomUUID()}-${videoFile.originalname}`;
    const thumbnailKey = `${crypto.randomUUID()}-${thumbnailFile.originalname}`;
    const videoCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: videoKey,
      Body: videoFile.buffer,
      ContentType: videoFile.mimetype,
    });
    const thumbnailCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: thumbnailKey,
      Body: thumbnailFile.buffer,
      ContentType: thumbnailFile.mimetype,
    });
    // Make upload
    await Promise.all([s3Client.send(videoCommand), s3Client.send(thumbnailCommand)]);
    // Submit on mongo
    const videoData = {
      title: title,
      thumbnail: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`,
      url: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${videoKey}`,
      user: userExists._id,
      uploadedAt: new Date().toISOString(),
    }
    const video = new Video(videoData);
    const newVideoData = await video.save();

    res.status(200).json({
      message: 'Archivos subidos exitosamente',
      data: newVideoData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir el video" });
  }
};

export const viewVideo = async (req, res) => {
  const { videoId } = req.params;
  const { title } = req.query;
  try {
    if (videoId) {
      const video = await Video.findById(videoId);
      res.status(200).json(video);
    } else {
      let filters = {};
      if (title) {
        filters = {title: { $regex: title, $options: 'i' } }
      } 
      const videos = await Video.find(filters);
      res.status(200).json(videos);
    }
  } catch (error) {
    console.error("Error al Obtener videos:", error);
    throw new Error("Error al Obtener videos");
  }
};
