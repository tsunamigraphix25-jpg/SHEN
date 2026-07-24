"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-shen-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-shen-primary to-shen-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-shen-gray-900 text-lg">SHEN</span>
              <span className="text-shen-gray-500 text-xs block leading-none">Knowledge Hub</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/articles">Articles</NavLink>
            <NavLink href="/research">Research</NavLink>
            <NavLink href="/newsroom">Newsroom</NavLink>
            <NavLink href="/events">Events</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/contributors">Contributors</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 text-shen-gray-500 hover:text-shen-primary rounded-lg hover:bg-shen-50 transition-colors"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-shen-primary to-shen-primary-light rounded-lg hover:from-shen-primary-dark hover:to-shen-primary transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-shen-gray-100"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4 space-y-1">
            <MobileLink href="/" onClick={() => setOpen(false)}>Home</MobileLink>
            <MobileLink href="/articles" onClick={() => setOpen(false)}>Articles</MobileLink>
            <MobileLink href="/research" onClick={() => setOpen(false)}>Research</MobileLink>
            <MobileLink href="/newsroom" onClick={() => setOpen(false)}>Newsroom</MobileLink>
            <MobileLink href="/events" onClick={() => setOpen(false)}>Events</MobileLink>
            <MobileLink href="/gallery" onClick={() => setOpen(false)}>Gallery</MobileLink>
            <MobileLink href="/contributors" onClick={() => setOpen(false)}>Contributors</MobileLink>
            <div className="pt-2 space-y-2">
              <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm font-medium text-white bg-shen-primary rounded-lg text-center">
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-shen-gray-600 hover:text-shen-primary hover:bg-shen-50 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-sm font-medium text-shen-gray-700 hover:bg-shen-50 hover:text-shen-primary rounded-lg"
    >
      {children}
    </Link>
  );
}
