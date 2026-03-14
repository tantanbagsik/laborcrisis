import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, name, email, password, role } = body;

    if (secret !== 'admin_secret_2024') {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Update password and role
      existingUser.password = password;
      if (role) existingUser.role = role;
      if (name) existingUser.name = name;
      await existingUser.save();
      
      return NextResponse.json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        message: 'User updated successfully'
      }, { status: 200 });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      phone: body.phone || '',
      skills: body.skills || []
    });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
