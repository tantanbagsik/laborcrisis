import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/models/Job';

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(6);
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
