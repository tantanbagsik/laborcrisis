'use client';

import { useEffect, useState } from 'react';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/jobs?id=${id}`, { method: 'DELETE' });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/jobs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <tr key={job._id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.category}</div>
                </td>
                <td className="px-6 py-4">{job.company}</td>
                <td className="px-6 py-4">{job.location}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{job.jobType}</span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded ${
                      job.status === 'active' ? 'bg-green-100 text-green-600' :
                      job.status === 'closed' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">No jobs found</div>
        )}
      </div>
    </div>
  );
}
