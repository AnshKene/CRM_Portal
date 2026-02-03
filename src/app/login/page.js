"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/utils.css";
import "../styles/auth.css";
import { authenticateUser, setSession } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const user = authenticateUser(credentials);
    if (!user) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    setSession(user);
    setSuccess("Welcome back! Redirecting to your dashboard...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Log in to CRM</h2>
        <p className="auth-subtitle">
          Access dashboards, manage teams, and track performance.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </label>
          {error ? <p className="auth-message error">{error}</p> : null}
          {success ? <p className="auth-message success">{success}</p> : null}
          <button type="submit" className="auth-submit">Log In</button>
        </form>
        <p className="auth-footer">
          New here? <Link href="/signup">Register now.</Link>
        </p>
      </div>
    </div>
  );
}
