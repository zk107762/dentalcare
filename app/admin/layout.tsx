"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "./AuthContext";

function AdminSidebar() {
  const pathname = usePathname();
  const { adminEmail, logout, sessionTimeLeft } = useAuth();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/services", label: "Services", icon: "🦷" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
    { href: "/admin/before-after", label: "Before/After", icon: "📷" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link href="/admin" className="admin-logo">
            <span className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 13 }}>✦</span>
            SmileCare
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-nav-link ${pathname === link.href ? "active" : ""}`}
            >
              <span className="admin-nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">A</div>
            <div>
              <span>{adminEmail}</span>
              <small className="admin-session-timer">Session: {formatTime(sessionTimeLeft)}</small>
            </div>
          </div>
          <button onClick={logout} className="admin-logout-btn">
            Logout →
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="admin-mobile-topbar">
        <Link href="/admin" className="admin-logo">
          <span className="nav-logo-icon" style={{ width: 28, height: 28, fontSize: 13 }}>✦</span>
          SmileCare
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="admin-badge">Admin</span>
          <button onClick={logout} className="admin-logout-btn" style={{ fontSize: 12, padding: "5px 10px" }}>
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="admin-bottom-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Show login page without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
