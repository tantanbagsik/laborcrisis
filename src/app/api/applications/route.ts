import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { Application } from '@/models/Application';
import { Job } from '@/models/Job';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, workerId, coverLetter, resume } = body;
    
    await connectDB();
    
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    
    const existingApplication = await Application.findOne({ job: jobId, worker: workerId });
    if (existingApplication) {
      return NextResponse.json({ message: 'Already applied to this job' }, { status: 400 });
    }
    
    const application = await Application.create({
      job: jobId,
      worker: workerId,
      coverLetter,
      resume
    });
    
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id }
    });
    
    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let workerId = searchParams.get('workerId');
    const jobId = searchParams.get('jobId');
    
    await connectDB();
    
    if (workerId === 'me') {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'laborcrisis_secret_key_2024') as { id: string };
      workerId = decoded.id;
    }
    
    if (workerId) {
      const applications = await Application.find({ worker: workerId })
        .populate('job')
        .sort({ appliedAt: -1 });
      return NextResponse.json(applications);
    }
    
    if (jobId) {
      const applications = await Application.find({ job: jobId })
        .populate('worker', 'name email phone skills')
        .sort({ appliedAt: -1 });
      return NextResponse.json(applications);
    }
    
    return NextResponse.json({ message: 'Missing workerId or jobId' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
