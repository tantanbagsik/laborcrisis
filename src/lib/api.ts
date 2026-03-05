const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://laborcrisis-backend.onrender.com/api";

export const api = {
  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateProfile: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Jobs
  getJobs: async (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/jobs?${queryString}`);
    return res.json();
  },

  getJob: async (id: string) => {
    const res = await fetch(`${API_URL}/jobs/${id}`);
    return res.json();
  },

  getFeaturedJobs: async () => {
    const res = await fetch(`${API_URL}/jobs/featured/list`);
    return res.json();
  },

  createJob: async (token: string, jobData: any) => {
    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    return res.json();
  },

  // Applications
  applyForJob: async (token: string, applicationData: any) => {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });
    return res.json();
  },

  getMyApplications: async (token: string) => {
    const res = await fetch(`${API_URL}/applications/worker/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default API_URL;
