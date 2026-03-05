'use client';

import { useEffect, useState } from 'react';

export default function AdminApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/applications`);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/applications?id=${id}`, { method: 'DELETE' });
      fetchApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/applications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchApplications();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredApps = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'reviewing': return 'bg-blue-100 text-blue-600';
      case 'interview': return 'bg-purple-100 text-purple-600';
      case 'hired': return 'bg-green-100 text-green-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Applications Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Applications</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="interview">Interview</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredApps.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{app.job?.title}</div>
                  <div className="text-sm text-gray-500">{app.job?.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{app.worker?.name}</div>
                  <div className="text-sm text-gray-500">{app.worker?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {app.worker?.phone || '-'}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApps.length === 0 && (
          <div className="text-center py-8 text-gray-500">No applications found</div>
        )}
      </div>
    </div>
  );
}
