import { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  skills?: string[];
  projects?: any[];
  portfolio?: any[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        // Ensure the parsed user has the required fields
        if (parsedUser && parsedUser._id && parsedUser.name && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';
  const isWorker = user?.role === 'worker';

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isEmployer,
    isWorker,
    isAuthenticated: !!user,
  };
}

export default useAuth;
