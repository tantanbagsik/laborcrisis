import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('employer', 'name email');
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await connectDB();
    await Job.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Job deleted' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    await connectDB();
    const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
