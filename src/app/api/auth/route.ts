import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'laborcrisis_secret_key_2024';

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    await connectDB();

    if (action === 'register') {
      const { name, email, password, phone, role, skills } = body;
      
      const userExists = await User.findOne({ email });
      if (userExists) {
        return NextResponse.json({ message: 'User already exists' }, { status: 400 });
      }
      
      const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'worker',
        skills: skills || []
      });
      
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
      }, { status: 201 });
    }

    if (action === 'login') {
      const { email, password } = body;
      
      const user = await User.findOne({ email });
      
      if (user && (await user.matchPassword(password))) {
        return NextResponse.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          skills: user.skills,
          token: generateToken(user._id.toString())
        });
      } else {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    await connectDB();
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
  }
}
