"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "worker",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await api.login(formData);
        if (result.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result));
          alert("Login successful!");
          if (result.role === 'admin') {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          setError(result.message || "Login failed");
        }
      } else {
        const result = await api.register(formData);
        if (result.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result));
          alert("Registration successful!");
          if (result.role === 'admin') {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        } else {
          setError(result.message || "Registration failed");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
        </div>
      </header>

      {/* Login/Register Form */}
      <section className="py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">
              {isLogin ? "Login" : "Create Account"}
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="worker">Worker / Job Seeker</option>
                      <option value="employer">Employer</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-red-600 hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
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
