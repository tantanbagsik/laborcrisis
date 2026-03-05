"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
    jobType: "full-time",
    workType: "onsite",
    category: "Marketing & Communication",
  });

  const categories = [
    "Marketing & Communication",
    "Design & Development",
    "Human Resource & Development",
    "Finance & Management",
    "Customer Support Care",
    "Business & Consulting",
    "Project Management",
    "Armforce Guide & Security",
    "Health Care & Medical",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to post a job");
        router.push("/login");
        return;
      }

      const jobPayload = {
        ...jobData,
        requirements: jobData.requirements.split(",").map((r) => r.trim()),
      };

      const result = await api.createJob(token, jobPayload);
      
      if (result._id) {
        alert("Job posted successfully!");
        router.push("/jobs");
      } else {
        alert(result.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job");
    } finally {
      setLoading(false);
    }
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

      {/* Post Job Form */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Post a Job</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="e.g. Product Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  value={jobData.company}
                  onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="e.g. Nestle Business Services"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={jobData.location}
                  onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="e.g. Manila, Philippines"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={jobData.category}
                    onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type *</label>
                  <select
                    value={jobData.jobType}
                    onChange={(e) => setJobData({ ...jobData, jobType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                  <select
                    value={jobData.workType}
                    onChange={(e) => setJobData({ ...jobData, workType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="text"
                    value={jobData.salary}
                    onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. $4,000/month"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={5}
                  required
                  placeholder="Describe the job responsibilities..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma separated)</label>
                <input
                  type="text"
                  value={jobData.requirements}
                  onChange={(e) => setJobData({ ...jobData, requirements: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. 3+ years experience, Bachelor's degree"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Job"}
              </button>
            </form>
          </div>
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
