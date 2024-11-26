import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const mongoString = process.env.DATABASE_URL

export const connect = async () => {
    try {
        const conn = await mongoose.connect(mongoString, {});
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Detener el proceso si falla la conexión
    }
};
