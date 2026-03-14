'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Project {
  _id?: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

interface PortfolioItem {
  _id?: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function UserDashboard() {
  const { user, isAdmin, isEmployer, isWorker, loading, logout, login } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [newProject, setNewProject] = useState<Project>({ title: '', description: '', link: '', technologies: [] });
  const [newPortfolio, setNewPortfolio] = useState<PortfolioItem>({ title: '', description: '', image: '', link: '' });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchUserProfile();
      if (isWorker) {
        fetchMyApplications();
      }
    }
  }, [user, isWorker]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs?limit=5', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          console.error('Invalid jobs data:', data);
          setJobs([]);
        }
      } else {
        console.error('Failed to fetch jobs:', res.status);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setProjects([]);
        setPortfolio([]);
        setProfileLoading(false);
        return;
      }
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setPortfolio(data.portfolio || []);
      } else {
        console.error('Failed to fetch profile:', res.status);
        setProjects([]);
        setPortfolio([]);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProjects([]);
      setPortfolio([]);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setApplications([]);
        return;
      }
      const res = await fetch('/api/applications?workerId=me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          console.error('Invalid applications data:', data);
          setApplications([]);
        }
      } else {
        console.error('Failed to fetch applications:', res.status);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProjects = [...projects, { ...newProject, _id: Date.now().toString() }];
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projects: updatedProjects }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setShowProjectModal(false);
        setNewProject({ title: '', description: '', link: '', technologies: [] });
        setTechInput('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const updatedProjects = projects.filter(p => p._id !== id);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projects: updatedProjects }),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPortfolio = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedPortfolio = [...portfolio, { ...newPortfolio, _id: Date.now().toString() }];
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolio: updatedPortfolio }),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio || []);
        setShowPortfolioModal(false);
        setNewPortfolio({ title: '', description: '', image: '', link: '' });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPortfolio = portfolio.filter(p => p._id !== id);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ portfolio: updatedPortfolio }),
      });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data.portfolio || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadCV = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const cvContent = `
${user?.name}
Email: ${user?.email}
Phone: ${data.phone || 'N/A'}

SKILLS
${(data.skills || []).join(', ')}

PROJECTS
${(data.projects || []).map((p: Project) => `
${p.title}
${p.description}
Link: ${p.link}
Technologies: ${p.technologies.join(', ')}
`).join('\n')}

PORTFOLIO
${(data.portfolio || []).map((p: PortfolioItem) => `
${p.title}
${p.description}
Link: ${p.link}
`).join('\n')}
        `.trim();
        
        const blob = new Blob([cvContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.name || 'user'}-CV.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setNewProject({ ...newProject, technologies: [...newProject.technologies, techInput.trim()] });
      setTechInput('');
    }
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
                   {user.role === 'worker' ? 'Job Seeker' : user.role}
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
          {isAdmin ? 'Admin Dashboard' : isEmployer ? 'Employer Dashboard' : 'Worker / Job Seeker Dashboard'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {isWorker && (
             <>
               <div className="bg-white rounded-lg shadow p-6">
                 <h3 className="text-lg font-semibold text-gray-700">My Applications</h3>
                 <p className="text-3xl font-bold text-blue-600 mt-2">{applications.length}</p>
                 <p className="text-sm text-gray-500 mt-1">Jobs applied for</p>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                 <h3 className="text-lg font-semibold text-gray-700">Pending Review</h3>
                 <p className="text-3xl font-bold text-yellow-600 mt-2">
                   {applications.filter((a: any) => a.status === 'pending').length}
                 </p>
                 <p className="text-sm text-gray-500 mt-1">Waiting for response</p>
               </div>
               <div className="bg-white rounded-lg shadow p-6">
                 <h3 className="text-lg font-semibold text-gray-700">Hired</h3>
                 <p className="text-3xl font-bold text-green-600 mt-2">
                   {applications.filter((a: any) => a.status === 'hired').length}
                 </p>
                 <p className="text-sm text-gray-500 mt-1">Successful applications</p>
               </div>
             </>
           )}

          {isEmployer && user && (
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
                 <Link href="/jobs" className="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
                   Browse Employers
                 </Link>
                 <Link href="/post-a-job" className="block w-full text-center border border-green-600 text-green-600 py-2 rounded hover:bg-green-50">
                   Post a Job (Employer Mode)
                 </Link>
               </div>
             </div>
           )}
        </div>

        {(isWorker || (!isAdmin && !isEmployer)) && (
          <>
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                <button 
                  onClick={() => setShowProjectModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profileLoading ? (
                  <p className="text-gray-500 col-span-full">Loading...</p>
                ) : (
                  <>
                    {projects && projects.map((project) => (
                      <div key={project._id || Math.random()} className="bg-white rounded-lg shadow p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <button 
                            onClick={() => handleDeleteProject(project._id!)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies && project.technologies.map((tech: string, idx: number) => (
                            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                    {(!projects || projects.length === 0) && (
                      <p className="text-gray-500 col-span-full">No projects added yet</p>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">My Portfolio</h2>
                <button 
                  onClick={() => setShowPortfolioModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Portfolio Item
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <button 
                        onClick={() => handleDeletePortfolio(item._id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                    {item.image && (
                      <img src={item.image} alt={item.title} className="mt-2 w-full h-32 object-cover rounded" />
                    )}
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                        View Portfolio
                      </a>
                    )}
                  </div>
                ))}
                {portfolio.length === 0 && (
                  <p className="text-gray-500 col-span-full">No portfolio items added yet</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleDownloadCV}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download CV
              </button>
            </div>
          </>
        )}
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link</label>
                <input 
                  type="text" 
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technologies</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    placeholder="Press Enter to add"
                  />
                  <button 
                    type="button"
                    onClick={addTechnology}
                    className="bg-gray-200 px-4 rounded"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newProject.technologies.map((tech, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded flex items-center gap-1">
                      {tech}
                      <button onClick={() => setNewProject({ ...newProject, technologies: newProject.technologies.filter((_, i) => i !== idx) })}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>
          </div>
        </div>
      )}

      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Portfolio Item</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                  type="text" 
                  value={newPortfolio.title}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input 
                  type="text" 
                  value={newPortfolio.image}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, image: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link</label>
                <input 
                  type="text" 
                  value={newPortfolio.link}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowPortfolioModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddPortfolio}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
