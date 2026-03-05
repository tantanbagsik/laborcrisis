import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';

export async function GET() {
  try {
    await connectDB();
    
    const totalUsers = await User.countDocuments();
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const totalEmployers = await User.countDocuments({ role: 'employer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });
    
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const hiredApplications = await Application.countDocuments({ status: 'hired' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).populate('employer', 'name');
    const recentApplications = await Application.find().sort({ appliedAt: -1 }).limit(5)
      .populate('job', 'title')
      .populate('worker', 'name');
    
    return NextResponse.json({
      users: { total: totalUsers, workers: totalWorkers, employers: totalEmployers, admins: totalAdmins },
      jobs: { total: totalJobs, active: activeJobs, closed: closedJobs },
      applications: { 
        total: totalApplications, 
        pending: pendingApplications, 
        hired: hiredApplications,
        rejected: rejectedApplications 
      },
      recentUsers,
      recentJobs,
      recentApplications
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
