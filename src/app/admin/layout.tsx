'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Jobs', href: '/admin/jobs', icon: '💼' },
  { name: 'Applications', href: '/admin/applications', icon: '📝' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [loading, user, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-gray-900 text-white min-h-screen fixed">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">LaborCrisis</p>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 hover:bg-gray-800 ${
                  pathname === item.href ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        <main className="ml-64 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
