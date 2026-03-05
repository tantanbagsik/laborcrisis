import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/models/Job';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const job = await Job.findById(id);
    if (job) {
      return NextResponse.json(job);
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    
    const job = await Job.findByIdAndUpdate(id, body, { new: true });
    if (job) {
      return NextResponse.json(job);
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const job = await Job.findByIdAndDelete(id);
    if (job) {
      return NextResponse.json({ message: 'Job removed' });
    } else {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
