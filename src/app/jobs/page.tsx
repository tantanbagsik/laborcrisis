"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function JobsContent() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("type") || "");
  const [salaryRange, setSalaryRange] = useState(searchParams.get("salary") || "");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (location) params.location = location;
      if (jobType) params.type = jobType;
      if (salaryRange) params.salary = salaryRange;
      
      const data = await api.getJobs(params);
      if (data && data.length > 0) {
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to apply");
      window.location.href = "/login";
      return;
    }
    alert("Application submitted!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-500 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img 
              alt="Labor Crisis logo" 
              className="h-10 w-auto md:h-12"
              src="https://laborcrisisbetav2.vercel.app/labor-crisis-logo-01.svg"
            />
            <span className="text-[24px] md:text-[28px] lg:text-[32px] tracking-[0.2em] leading-none text-black relative -translate-y-1">
              LABOR CRISIS
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-3">
              <a href="/post-a-job" className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">
                Post a Job
              </a>
              <a href="/jobs" className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                Find Jobs
              </a>
            </div>
            <a href="/login" className="text-sm font-medium text-gray-900 hover:text-red-800">Login</a>
          </nav>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </select>
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No jobs found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job: any) => (
                <div key={job._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <p className="text-red-600 font-medium">{job.company}</p>
                    </div>
                    <button
                      onClick={() => handleApply(job._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700"
                    >
                      Apply Now
                    </button>
                  </div>
                  <div className="mt-4 flex gap-4 text-gray-600">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.jobType}</span>
                    {job.salary && <span>💰 {job.salary}</span>}
                  </div>
                  <p className="mt-4 text-gray-600 line-clamp-2">{job.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 Labor Crisis Pte. Ltd. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}
