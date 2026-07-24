"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalDownloads: number;
  totalMembers: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (!res.ok) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch {
      router.push("/admin");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-shen-gray-50 flex items-center justify-center">
        <div className="text-shen-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shen-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-shen-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-shen-primary to-shen-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">SH</span>
            </div>
            <div>
              <span className="font-bold text-shen-gray-900">SHEN Admin</span>
              <span className="text-shen-gray-400 text-xs block leading-none">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-shen-gray-500 hover:text-shen-primary">View Site</Link>
            <div className="text-sm text-shen-gray-700">
              {user.name}
              <span className="text-xs text-shen-gray-400 ml-1">({user.role})</span>
            </div>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-shen-gray-900">Welcome, {user.name}</h1>
          <p className="text-shen-gray-500">Manage your SHEN blog content and publication library</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Articles" value={stats.totalArticles} icon="📄" />
            <StatCard label="Published" value={stats.publishedArticles} icon="✅" />
            <StatCard label="Total Views" value={stats.totalViews} icon="👁️" />
            <StatCard label="Downloads" value={stats.totalDownloads} icon="📥" />
            <StatCard label="Members" value={stats.totalMembers} icon="👥" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <QuickAction href="/admin/articles/new" icon="✍️" title="Create Article" desc="Write a new article or publication" />
          <QuickAction href="/admin/articles" icon="📋" title="All Publications" desc="Manage articles, research, news" />
          <QuickAction href="/admin/articles/new?category=research" icon="🔬" title="Add Research" desc="Link a Google Drive PDF" />
          <QuickAction href="/admin/members" icon="👥" title="Members" desc="Manage contributor profiles" />
        </div>

        {/* Navigation Panel */}
        <div className="bg-white rounded-xl border border-shen-gray-100 p-6">
          <h2 className="font-bold text-shen-gray-900 mb-4">Administration Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { href: "/admin/articles/new", label: "Create Article", icon: "✍️", desc: "Create new content" },
              { href: "/admin/articles/new?category=research", label: "Add Research Paper", icon: "🔬", desc: "Link Google Drive PDF" },
              { href: "/admin/articles/new?category=news", label: "Post News", icon: "📰", desc: "Publish SHEN news" },
              { href: "/admin/articles/new?category=event", label: "Add Event", icon: "📅", desc: "Create event report" },
              { href: "/admin/articles/new?category=gallery", label: "Add Gallery", icon: "📸", desc: "Monthly pictorial highlights" },
              { href: "/admin/articles", label: "All Publications", icon: "📋", desc: "View & edit all content" },
              { href: "/admin/members", label: "Manage Members", icon: "👥", desc: "Edit contributor profiles" },
            ].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-shen-50 transition-colors group"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="font-medium text-shen-gray-900 group-hover:text-shen-primary transition-colors text-sm">{item.label}</div>
                  <div className="text-xs text-shen-gray-500">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-shen-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-2xl font-bold ${color || "text-shen-gray-900"}`}>{value}</div>
      <div className="text-xs text-shen-gray-500">{label}</div>
    </div>
  );
}

function QuickAction({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl border border-shen-gray-100 p-5 hover:shadow-lg hover:border-shen-primary transition-all group">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-shen-gray-900 group-hover:text-shen-primary transition-colors">{title}</h3>
      <p className="text-sm text-shen-gray-500 mt-1">{desc}</p>
    </Link>
  );
}
