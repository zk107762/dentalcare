"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay (prevents timing attacks)
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const result = login(email, password);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Invalid credentials.");
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo">
            <span className="nav-logo-icon" style={{ width: 44, height: 44, fontSize: 18 }}>✦</span>
          </div>
          <h1>Admin Portal</h1>
          <p>Sign in to manage your SmileCare website</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-login-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="email">Email Address</label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">✉</span>
              <input
                id="email"
                type="email"
                placeholder="admin@smilecare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="admin-field-options">
            <label className="admin-checkbox">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="admin-btn-loading">
                <span className="admin-spinner-small" />
                Signing in...
              </span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>🔒 Secured with encrypted authentication</p>
        </div>
      </div>
    </div>
  );
}
