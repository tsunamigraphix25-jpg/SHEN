"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    fetch("/api/auth/check").then(r => {
      if (r.ok) router.push("/admin/dashboard");
    }).catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-shen-900 via-shen-primary to-shen-primary-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">SH</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SHEN Admin Portal</h1>
          <p className="text-white/60 text-sm mt-1">Knowledge Hub Administration</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none transition-all"
              placeholder="admin@shen.org"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-shen-gray-900 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-shen-gray-200 rounded-lg focus:ring-2 focus:ring-shen-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-shen-primary to-shen-accent text-white font-semibold rounded-lg hover:from-shen-primary-dark hover:to-shen-accent-dark transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center text-xs text-shen-gray-500 pt-2 space-y-1">
            <p className="font-medium">Default Admin Credentials:</p>
            <p>Email: <span className="font-mono bg-shen-gray-100 px-1 rounded">admin@shen.org</span></p>
            <p>Password: <span className="font-mono bg-shen-gray-100 px-1 rounded">admin123</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}
