"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const jobCategories = [
  { name: "Marketing & Communication", jobs: 60, icon: "01" },
  { name: "Design & Development", jobs: 120, icon: "02" },
  { name: "Human Resource & Development", jobs: 200, icon: "03" },
  { name: "Finance & Management", jobs: 357, icon: "04" },
  { name: "Customer Support Care", jobs: 450, icon: "05" },
  { name: "Business & Consulting", jobs: 41, icon: "06" },
  { name: "Project Management", jobs: 85, icon: "07" },
  { name: "Armforce Guide & Security", jobs: 62, icon: "08" },
  { name: "Health Care & Medical", jobs: 52, icon: "09" },
];

const testimonials = [
  {
    quote: "As someone supporting my family, time matters. Labor Crisis connected me to an employer who needed staff immediately. I appreciate how fast everything moved.",
    name: "Carlos M.",
    role: "Warehouse Supervisor",
  },
  {
    quote: "I was looking for a stable role with growth. Labor Crisis matched me with a company that values training and development.",
    name: "Aisha R.",
    role: "Customer Support Specialist",
  },
  {
    quote: "After months of searching on my own, Labor Crisis introduced me to the right hiring manager in just a few days.",
    name: "Kenji S.",
    role: "Project Engineer",
  },
  {
    quote: "I wanted a job that fit my schedule and my values. Labor Crisis helped me find a school where I feel truly supported.",
    name: "Maya L.",
    role: "Preschool Teacher",
  },
  {
    quote: "Events hiring can be unpredictable, but Labor Crisis kept me updated with new roles and made every application feel easy.",
    name: "Victor T.",
    role: "Events Manager",
  },
];

const clientLogos = [
  { name: "Client 1", id: "01" },
  { name: "Client 2", id: "02" },
  { name: "Client 3", id: "03" },
  { name: "Client 4", id: "04" },
  { name: "Client 5", id: "05" },
  { name: "Client 6", id: "06" },
  { name: "Client 7", id: "07" },
  { name: "Client 8", id: "08" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [salaryRange, setSalaryRange] = useState("");
  const [email, setEmail] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await fetch('/api/jobs/featured');
      const jobs = await res.json();
      if (jobs && jobs.length > 0) {
        setFeaturedJobs(jobs);
      } else {
        setFeaturedJobs(getDefaultJobs());
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setFeaturedJobs(getDefaultJobs());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultJobs = () => [
    { title: "PRODUCT DESIGNER", company: "NESTLE BUSINESS SERVICES AOA INC", location: "Manila, Philippines", type: "Hybrid", salary: "$600/month" },
    { title: "RECEPTIONIST (BEAUTY INDUSTRY)", company: "PRIVATE ADVERTISER", location: "Singapore", type: "Full time", salary: "$2,500–3,500/month (SGD)" },
    { title: "PROJECT ENGINEER (ELECTRICAL)", company: "ALWAYS HIRED PTE. LTD.", location: "Central Region, Singapore", type: "Full time", salary: "$4,000–5,000/month (SGD)" },
    { title: "ACCOUNTANT", company: "FELCOR PETROLEUM PTE LTD", location: "Central Region, Singapore", type: "Full time", salary: "$4,000–5,300/month (SGD)" },
    { title: "PRESCHOOL TEACHERS", company: "WORKPLUS RECRUITMENT CENTRE PTE LTD", location: "Singapore", type: "Full time", salary: "$3,000–4,000/month (SGD)" },
    { title: "EVENTS MANAGER", company: "NANYANG TECHNOLOGICAL UNIVERSITY", location: "Pioneer, West Region, Singapore", type: "Hybrid", salary: "$4,000–5,300/month (SGD)" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    if (jobType) params.set("type", jobType);
    if (salaryRange) params.set("salary", salaryRange);
    window.location.href = `/jobs?${params.toString()}`;
  };

  const handlePostJob = () => {
    window.location.href = "/post-a-job";
  };

  const handleApplyJob = (jobId: string, jobTitle: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to apply for jobs");
      window.location.href = "/login";
      return;
    }
    alert(`Applying for ${jobTitle}. This would redirect to the application form.`);
  };

  const handleUploadCV = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to upload your CV");
      window.location.href = "/login";
      return;
    }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`CV uploaded: ${file.name}. We will match you with suitable jobs!`);
      }
    };
    input.click();
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}! You will receive job updates.`);
      setEmail("");
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
              width="60" 
              height="60" 
              className="h-10 w-auto md:h-12"
              src="https://laborcrisisbetav2.vercel.app/labor-crisis-logo-01.svg"
            />
            <span className="text-[24px] md:text-[28px] lg:text-[32px] tracking-[0.2em] leading-none text-black relative -translate-y-1">
              LABOR CRISIS
            </span>
          </a>
          
          <nav className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6">
              <div className="relative">
                <button 
                  onClick={() => setShowHowItWorks(!showHowItWorks)}
                  className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-gray-900 hover:text-red-700"
                >
                  How it Works
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m7 6 5 5 5-5"></path>
                    <path d="m7 13 5 5 5-5"></path>
                  </svg>
                </button>
                {showHowItWorks && (
                  <div className="absolute left-0 mt-2 w-40 rounded-md border border-gray-200 bg-white py-2 text-sm shadow-lg">
                    <a href="#for-employers" onClick={() => setShowHowItWorks(false)} className="block px-3 py-1.5 hover:bg-gray-50">For Clients</a>
                    <a href="#for-workers" onClick={() => setShowHowItWorks(false)} className="block px-3 py-1.5 hover:bg-gray-50">For Service Providers</a>
                  </div>
                )}
              </div>
              <a href="#pricing" className="text-sm font-medium text-black hover:text-red-800">Pricing</a>
            </div>
            
            <div className="flex items-stretch gap-6">
              <div className="flex items-center gap-3">
                <a href="/post-a-job" className="rounded-full border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-all duration-300">
                  Post a Job
                </a>
                <a href="/jobs" className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-all duration-300">
                  Find Jobs
                </a>
              </div>
              <div className="w-px self-stretch bg-gray-200" aria-hidden="true"></div>
              <div className="flex items-center">
                <a href="/login" className="text-sm font-medium text-gray-900 hover:text-red-800 transition-all duration-300">Login</a>
              </div>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex cursor-pointer list-none items-center justify-center rounded-md border border-gray-300 p-2 md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-900">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-3 text-sm shadow-lg md:hidden">
            <a href="#how-it-works" onClick={() => setShowMobileMenu(false)} className="block py-1.5 text-gray-900 hover:text-red-800">How it Works</a>
            <a href="#pricing" onClick={() => setShowMobileMenu(false)} className="block py-1.5 text-gray-900 hover:text-red-800">Pricing</a>
            <div className="my-3 border-t border-gray-200"></div>
            <a href="/post-a-job" onClick={() => setShowMobileMenu(false)} className="mb-2 block rounded-full border border-red-600 px-4 py-2 text-center text-sm font-semibold text-red-600 hover:bg-red-50">Post a Job</a>
            <a href="/jobs" onClick={() => setShowMobileMenu(false)} className="mb-2 block rounded-full bg-red-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-700">Find Jobs</a>
            <a href="/login" onClick={() => setShowMobileMenu(false)} className="block text-sm font-medium text-gray-900 hover:text-red-800">Login</a>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative w-full overflow-hidden text-white">
          <div className="pointer-events-none absolute -z-10 inset-x-0 bottom-0 h-[320px] sm:h-[360px] lg:inset-0 lg:h-full">
            <img 
              alt="City skyline" 
              decoding="async" 
              className="h-full w-full object-cover object-bottom lg:object-[50%_65%]"
              src="https://laborcrisisbetav2.vercel.app/hero-light-new.webp"
            />
          </div>
          
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-5 pt-10 pb-16 md:px-6 lg:px-8 lg:pt-24 lg:pb-24">
            <div className={`max-w-3xl text-center transition-all duration-700 ${!loading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="block text-gray-900">When Labor is Critical,</span>
                <span className="mt-2 block text-[#E61E25]">We Deliver</span>
              </h1>
            </div>

            <div className={`mt-12 flex w-full justify-center transition-all duration-700 delay-200 ${!loading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <form onSubmit={handleSearch} className="w-full max-w-4xl rounded-[40px] bg-[#E5E5E5] px-5 pt-6 pb-8 flex flex-col gap-4 lg:justify-center shadow-xl" action="/jobs" method="GET">
                <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-[18px] text-neutral-900 shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center text-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </span>
                  <input 
                    id="q" 
                    type="text" 
                    placeholder="Enter job, position, etc." 
                    className="flex-1 border-none bg-transparent text-[18px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3.5 text-[18px] text-neutral-900 shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center text-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </span>
                  <input 
                    id="location" 
                    type="text" 
                    placeholder="Enter location" 
                    className="flex-1 border-none bg-transparent text-[18px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="flex-1">
                    <div className="relative rounded-xl bg-white px-5 py-3.5 text-[18px] text-neutral-900 shadow-sm">
                      <select 
                        id="type" 
                        name="type" 
                        className="w-full appearance-none border-none bg-transparent pr-7 text-[18px] text-neutral-900 focus:outline-none focus:ring-0"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                      >
                        <option value="full-time">Full time</option>
                        <option value="part-time">Part time</option>
                        <option value="contract">Contract</option>
                        <option value="temporary">Temporary</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-900">
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative rounded-xl bg-white px-5 py-3.5 text-[18px] text-neutral-900 shadow-sm">
                      <select 
                        id="salary" 
                        name="salary" 
                        className="w-full appearance-none border-none bg-transparent pr-7 text-[18px] text-neutral-900 focus:outline-none focus:ring-0"
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                      >
                        <option value="">Salary range</option>
                        <option value="below-2k">Below $2,000</option>
                        <option value="2k-4k">$2,000 – $4,000</option>
                        <option value="4k-6k">$4,000 – $6,000</option>
                        <option value="6k-plus">$6,000+</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-900">
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2">
                  <button 
                    type="submit" 
                    className="rounded-xl bg-[#E61E25] py-3.5 text-center text-[18px] font-semibold text-white shadow-sm hover:bg-[#cc151c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Search Jobs
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePostJob} 
                    className="rounded-xl border border-[#009D8C] bg-transparent py-3.5 text-center text-[18px] font-semibold text-[#009D8C] hover:bg-[#009D8C] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    Post a Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Job Categories */}
        <section id="workforce-solutions" className="bg-[#e5e7eb] py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-[24px] font-semibold leading-tight text-gray-900 md:text-[28px] lg:text-[32px]">
                Fast, Focused <span className="text-[#E61E25]">Workforce Solutions</span>
              </h2>
            </div>
            
            {/* Desktop Categories Grid */}
            <div className="mt-10 hidden md:grid gap-y-8 md:mt-12 md:grid-cols-2 md:gap-x-10 md:gap-y-10 lg:grid-cols-3">
              {jobCategories.map((category, index) => (
                <article 
                  key={index}
                  className="lc-category-card flex w-full flex-col justify-center rounded-4xl px-5 py-20 min-h-[255px] bg-white text-gray-900 shadow-[0_10px_30px_rgba(15,23,42,0.12)] cursor-pointer hover:shadow-[0_20px_40px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-2"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: !loading ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                    opacity: !loading ? 1 : 0
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      <img 
                        alt={category.name} 
                        loading="lazy" 
                        width="180" 
                        height="180" 
                        className="lc-category-icon h-28 w-28 object-contain transition-transform duration-300 hover:scale-110"
                        src={`https://laborcrisisbetav2.vercel.app/job-categories-section-${category.icon}.svg`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[15px] font-semibold leading-snug md:text-[16px] lg:text-[17px]">{category.name}</h3>
                      <p className="mt-2 text-[11px] text-gray-500 md:text-[12px]">{category.jobs} Jobs Available</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Mobile Categories Grid */}
            <div className="mt-[50px] grid grid-cols-3 gap-x-[10px] gap-y-0 md:hidden">
              {jobCategories.slice(0, 6).map((category, index) => (
                <article 
                  key={index} 
                  className="lc-category-card relative mb-[20px] flex flex-col items-center rounded-[20px] w-[100px] h-[100px] bg-[#eee] hover:bg-gray-200 transition-colors duration-300"
                >
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[20px]">
                    <div className="relative w-[60px] h-[60px]">
                      <img 
                        alt={category.name} 
                        loading="lazy" 
                        width="60" 
                        height="60" 
                        className="lc-category-icon w-full h-full object-contain"
                        src={`https://laborcrisisbetav2.vercel.app/job-categories-section-${category.icon}.svg`}
                      />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 translate-x-1.5 -translate-y-1.5">
                    <div className="bg-[#339989] rounded-full w-6.75 h-6.75 flex items-center justify-center">
                      <p className="font-semibold text-[10px] leading-normal text-white">{category.jobs}</p>
                    </div>
                  </div>
                  <div className="absolute top-26.25 flex flex-col items-center w-full">
                    <p className="font-medium text-[10px] leading-normal text-[#3d3737] text-center capitalize">{category.name.split(' & ')[0]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section id="featured-jobs" className="bg-[#EEEEEE] py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-[32px] md:text-[40px] lg:text-[48px] font-medium text-gray-900">
                <span className="text-[#E61E25]">FEATURED</span> <span>JOBS</span>
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              {featuredJobs.map((job, index) => (
                <article 
                  key={index}
                  className="flex flex-col justify-between rounded-[20px] bg-white px-8 py-8 md:px-10 md:py-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 min-h-[280px]"
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animation: !loading ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                    opacity: !loading ? 1 : 0
                  }}
                >
                  <header className="space-y-2">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold tracking-wide text-gray-900">{job.title}</h3>
                    <p className="text-base md:text-lg font-normal uppercase tracking-wide text-gray-900">{job.company}</p>
                  </header>
                  
                  <dl className="mt-6 space-y-2 text-base md:text-lg text-gray-700">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <dd>{job.location}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-900 flex-shrink-0" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <dd>{job.type}</dd>
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 flex-shrink-0" aria-hidden="true">
                        <line x1="12" x2="12" y1="2" y2="22"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <dd>{job.salary}</dd>
                    </div>
                  </dl>
                  
                  <button 
                    onClick={() => handleApplyJob(job._id || job.title, job.title)}
                    className="mt-8 w-full rounded-full bg-[#E61E25] py-3 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-[#cc151c] hover:shadow-lg hover:-translate-y-1"
                  >
                    Apply Now
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="reviews" className="bg-white py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[24px] font-semibold leading-tight text-gray-900 md:text-[28px] lg:text-[32px]">
                Reviews of People<br />Who Have Found<br />Jobs Through Labor Crisis
              </h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: !loading ? 'fadeInUp 0.6s ease-out forwards' : 'none',
                    opacity: !loading ? 1 : 0
                  }}
                >
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#E61E25" className="opacity-20">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload CV Section */}
        <section id="upload-cv" className="relative overflow-hidden bg-[#E61E25] py-16 md:py-20 lg:py-24">
          <div className="absolute inset-0 opacity-10">
            <img 
              alt="CV upload background" 
              className="h-full w-full object-cover"
              src="https://laborcrisisbetav2.vercel.app/upload-cv-section.webp"
            />
          </div>
          <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 md:px-6 lg:flex-row lg:px-8">
            <div className="flex-1 text-white text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4 md:text-4xl lg:text-5xl">
                Upload Your Latest CV.<br />Get Matched Faster at<br />Labor Crisis
              </h2>
              <p className="text-red-100 mb-8 text-lg">
                Upload your most recent CV and let our smart matching system connect you with roles that fit your skills, experience, and availability. Whether you&apos;re actively searching or open to new opportunities, Labor Crisis helps employers find you—faster, smarter, and with less hassle.
              </p>
              <button 
                onClick={handleUploadCV}
                className="inline-block rounded-full bg-white px-8 py-4 text-lg font-semibold text-[#E61E25] transition-all duration-300 hover:bg-gray-100 hover:shadow-xl hover:scale-105"
              >
                Upload your CV
              </button>
            </div>
            <div className="flex-1 w-full">
              <div className="relative w-full h-64 md:h-80 lg:h-96 bg-red-400 rounded-2xl flex items-center justify-center overflow-hidden">
                <img 
                  alt="Professional" 
                  className="absolute inset-0 h-full w-full object-cover opacity-50"
                  src="https://laborcrisisbetav2.vercel.app/upload-cv-section.webp"
                />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E61E25" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" x2="12" y1="3" y2="15"></line>
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-lg">Click to upload your CV</p>
                  <p className="text-red-100 text-sm mt-2">PDF, DOC, DOCX up to 5MB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clients Section */}
        <section id="company-sponsors" className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                More than 5,000 Clients with us
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-8">
              {[...clientLogos, ...clientLogos, ...clientLogos].map((client, index) => (
                <div 
                  key={index} 
                  className="group flex h-20 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  <img 
                    alt={client.name}
                    className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    src={`https://laborcrisisbetav2.vercel.app/client-${client.id}.svg`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section id="newsletter" className="bg-gray-50 py-16 md:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
            <h2 className="text-2xl font-bold mb-4 md:text-3xl">
              Never Want to Miss<br />Any Job News?
            </h2>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto mt-8">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[#E61E25] text-white rounded-full font-medium hover:bg-[#cc151c] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  alt="Labor Crisis logo" 
                  width="60" 
                  height="60" 
                  className="h-10 w-auto"
                  src="https://laborcrisisbetav2.vercel.app/labor-crisis-logo-01.svg"
                />
                <span className="text-xl font-bold tracking-[0.2em]">LABOR CRISIS</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Labor Crisis Pte. Ltd. is a Singapore-based employment platform connecting employers with skilled and dependable talent across labor-critical roles. We help businesses respond quickly to workforce demands while empowering job seekers with real opportunities that matter.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/jobs" className="hover:text-white transition-colors">Jobs</a></li>
                <li><a href="/post-a-job" className="hover:text-white transition-colors">Employers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Labor Crisis Pte. Ltd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
