'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const { user, isAdmin, isEmployer, isWorker, loading, logout } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetchJobs();
      if (isWorker) {
        fetchMyApplications();
      }
    }
  }, [user, isWorker]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs?limit=5');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/applications?workerId=me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">LaborCrisis</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.name} 
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  isAdmin ? 'bg-red-100 text-red-600' : 
                  isEmployer ? 'bg-blue-100 text-blue-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {user.role}
                </span>
              </span>
              {isAdmin && (
                <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {isAdmin ? 'Admin Dashboard' : isEmployer ? 'Employer Dashboard' : 'Worker Dashboard'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {isWorker && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">My Applications</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{applications.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {applications.filter((a: any) => a.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Hired</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {applications.filter((a: any) => a.status === 'hired').length}
                </p>
              </div>
            </>
          )}

          {isEmployer && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">My Jobs</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {jobs.filter((j: any) => j.employer?._id === user._id).length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {jobs.reduce((acc: number, j: any) => acc + (j.applications?.length || 0), 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {jobs.filter((j: any) => j.status === 'active').length}
                </p>
              </div>
            </>
          )}

          {isAdmin && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                <Link href="/admin/users" className="text-3xl font-bold text-blue-600 mt-2 hover:text-blue-800">
                  View in Admin
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">Manage Jobs</h3>
                <Link href="/admin/jobs" className="text-3xl font-bold text-green-600 mt-2 hover:text-green-800">
                  Go to Admin
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-700">View Applications</h3>
                <Link href="/admin/applications" className="text-3xl font-bold text-purple-600 mt-2 hover:text-purple-800">
                  Go to Admin
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Jobs</h2>
              <Link href="/jobs" className="text-blue-600 hover:text-blue-800">View All</Link>
            </div>
            <div className="space-y-4">
              {jobs.slice(0, 5).map((job: any) => (
                <div key={job._id} className="border-b pb-3">
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    job.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isWorker && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Applications</h2>
              </div>
              <div className="space-y-4">
                {applications.slice(0, 5).map((app: any) => (
                  <div key={app._id} className="border-b pb-3">
                    <h3 className="font-medium">{app.job?.title}</h3>
                    <p className="text-sm text-gray-500">{app.job?.company}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      app.status === 'hired' ? 'bg-green-100 text-green-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-gray-500">No applications yet</p>
                )}
              </div>
            </div>
          )}

          {isEmployer && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link href="/post-a-job" className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Post a New Job
                </Link>
                <Link href="/jobs" className="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
                  Browse Workers
                </Link>
              </div>
            </div>
          )}

          {isWorker && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link href="/jobs" className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
