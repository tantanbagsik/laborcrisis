import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Application } from '@/models/Application';

export async function GET() {
  try {
    await connectDB();
    const applications = await Application.find()
      .sort({ appliedAt: -1 })
      .populate('job', 'title company')
      .populate('worker', 'name email phone');
    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectDB();
    await Application.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Application deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    await connectDB();
    const application = await Application.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true })
      .populate('job', 'title company')
      .populate('worker', 'name email phone');
    return NextResponse.json(application);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
