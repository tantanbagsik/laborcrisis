import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://raypanganiban:Titankalimot08!@cluster0.oxa8u39.mongodb.net/';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'rpanganiban' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('Titankalimot08!', 10);
    
    const admin = await User.create({
      name: 'rpanganiban',
      email: 'rpanganiban',
      password: hashedPassword,
      phone: '',
      role: 'admin',
      skills: []
    });

    console.log('Admin user created:', admin);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();
