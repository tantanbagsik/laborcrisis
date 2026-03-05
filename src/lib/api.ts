const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  register: async (userData: any) => {
    const res = await fetch(`${API_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...userData, action: 'register' }),
    });
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...credentials, action: 'login' }),
    });
    return res.json();
  },

  getMe: async (token: string) => {
    const res = await fetch(`${API_URL}/api/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updateProfile: async (token: string, data: any) => {
    const res = await fetch(`${API_URL}/api/auth`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getJobs: async (params: any = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/jobs?${queryString}`);
    return res.json();
  },

  getJob: async (id: string) => {
    const res = await fetch(`${API_URL}/api/jobs/${id}`);
    return res.json();
  },

  getFeaturedJobs: async () => {
    const res = await fetch(`${API_URL}/api/jobs/featured`);
    return res.json();
  },

  createJob: async (token: string, jobData: any) => {
    const res = await fetch(`${API_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });
    return res.json();
  },

  applyForJob: async (token: string, applicationData: any) => {
    const res = await fetch(`${API_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });
    return res.json();
  },

  getMyApplications: async (token: string) => {
    const res = await fetch(`${API_URL}/api/applications?workerId=me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

export default API_URL;
