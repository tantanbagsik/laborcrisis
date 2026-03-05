'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const StatCard = ({ title, value, color, icon }: { title: string; value: number; color: string; icon: string }) => (
    <div className={`bg-white rounded-lg shadow p-6 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.users?.total || 0} color="border-l-4 border-blue-500" icon="👥" />
        <StatCard title="Total Jobs" value={stats?.jobs?.total || 0} color="border-l-4 border-green-500" icon="💼" />
        <StatCard title="Active Jobs" value={stats?.jobs?.active || 0} color="border-l-4 border-yellow-500" icon="✅" />
        <StatCard title="Applications" value={stats?.applications?.total || 0} color="border-l-4 border-purple-500" icon="📝" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Users Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Workers</span>
              <span className="font-semibold">{stats?.users?.workers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Employers</span>
              <span className="font-semibold">{stats?.users?.employers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Admins</span>
              <span className="font-semibold">{stats?.users?.admins || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Jobs Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Active</span>
              <span className="font-semibold text-green-600">{stats?.jobs?.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Closed</span>
              <span className="font-semibold text-red-600">{stats?.jobs?.closed || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Applications Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-semibold text-yellow-600">{stats?.applications?.pending || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Hired</span>
              <span className="font-semibold text-green-600">{stats?.applications?.hired || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Rejected</span>
              <span className="font-semibold text-red-600">{stats?.applications?.rejected || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {stats?.recentUsers?.map((user: any) => (
              <div key={user._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-600' : user.role === 'employer' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {stats?.recentJobs?.map((job: any) => (
              <div key={job._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${job.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
