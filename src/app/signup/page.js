"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/utils.css";
import "../styles/auth.css";
import { findUserByEmail, saveUser, setSession } from "../lib/auth";

const roleOptions = ["Client", "CEO", "Admin", "Employee"];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Client",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const existingUser = findUserByEmail(formData.email);
    if (existingUser) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase(),
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setSession(newUser);
    setSuccess("Account created! Redirecting to your dashboard...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your CRM account</h2>
        <p className="auth-subtitle">
          Set up your role to access the CRM workspace.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="jane@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Select Role
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="auth-message error">{error}</p> : null}
          {success ? <p className="auth-message success">{success}</p> : null}
          <button type="submit" className="auth-submit">Sign Up</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link href="/login">Login here.</Link>
        </p>
      </div>
    </div>
  );
}
