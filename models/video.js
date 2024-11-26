import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
}, { versionKey: false });

export default mongoose.model("Video", VideoSchema);
