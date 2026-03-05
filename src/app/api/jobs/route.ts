import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Job } from '@/models/Job';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const type = searchParams.get('type');
    const salary = searchParams.get('salary');
    const category = searchParams.get('category');

    await connectDB();
    
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.jobType = type;
    }
    if (category) {
      query.category = category;
    }
    if (salary) {
      switch (salary) {
        case 'below-2k':
          query.salary = { $lt: '$2,000' };
          break;
        case '2k-4k':
          query.salary = { $regex: '2,000|3,000|4,000' };
          break;
        case '4k-6k':
          query.salary = { $regex: '4,000|5,000|6,000' };
          break;
        case '6k-plus':
          query.salary = { $regex: '[6-9],' };
          break;
      }
    }
    
    query.status = 'active';
    
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await connectDB();
    
    const job = await Job.create(body);
    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
