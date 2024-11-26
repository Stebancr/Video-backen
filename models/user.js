import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
}, { versionKey: false });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Solo encripta si la contraseña ha sido modificada
  const saltRounds = 10; // Número de saltos para el hash
  const hash = await bcrypt.hash(this.password, saltRounds);
  this.password = hash; // Reemplaza la contraseña en texto plano por el hash
  next();
});

export default mongoose.model('User', UserSchema);
