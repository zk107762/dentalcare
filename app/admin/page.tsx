"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function AdminDashboard() {
  const { adminEmail } = useAuth();

  const stats = [
    { label: "Services", value: "6", icon: "🦷", href: "/admin/services" },
    { label: "Testimonials", value: "3", icon: "⭐", href: "/admin/testimonials" },
    { label: "Before/After", value: "3", icon: "📷", href: "/admin/before-after" },
    { label: "Settings", value: "—", icon: "⚙️", href: "/admin/settings" },
  ];

  const quickActions = [
    { label: "Edit Services", icon: "🦷", href: "/admin/services", color: "var(--primary)" },
    { label: "Manage Reviews", icon: "⭐", href: "/admin/testimonials", color: "#f3b92e" },
    { label: "Update Before/After", icon: "📷", href: "/admin/before-after", color: "#e74c3c" },
    { label: "Site Settings", icon: "⚙️", href: "/admin/settings", color: "#6c5ce7" },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {adminEmail} — manage your SmileCare website</p>
        </div>
        <Link href="/" className="btn-outline" style={{ fontSize: 13, padding: "8px 16px" }}>
          ← View Website
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="admin-stat-card">
            <span className="admin-stat-icon">{stat.icon}</span>
            <div>
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="admin-actions-grid">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="admin-action-card">
              <span className="admin-action-icon" style={{ background: action.color + "15", color: action.color }}>
                {action.icon}
              </span>
              <span>{action.label}</span>
              <span className="admin-action-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-section">
        <h2>Recent Activity</h2>
        <div className="admin-activity-list">
          <div className="admin-activity-item">
            <span className="admin-activity-dot" style={{ background: "#27ae60" }} />
            <div>
              <strong>Website is live</strong>
              <small>All systems operational</small>
            </div>
            <span className="admin-activity-time">Now</span>
          </div>
          <div className="admin-activity-item">
            <span className="admin-activity-dot" style={{ background: "var(--primary)" }} />
            <div>
              <strong>Services updated</strong>
              <small>6 services configured</small>
            </div>
            <span className="admin-activity-time">Today</span>
          </div>
          <div className="admin-activity-item">
            <span className="admin-activity-dot" style={{ background: "#f3b92e" }} />
            <div>
              <strong>Testimonials active</strong>
              <small>3 patient reviews displayed</small>
            </div>
            <span className="admin-activity-time">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
