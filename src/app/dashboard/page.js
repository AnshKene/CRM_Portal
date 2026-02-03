"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/utils.css";
import "../styles/dashboard.css";
import { clearSession, getSession } from "../lib/auth";

const quickActions = [
  {
    title: "Create new client",
    description: "Add a new client profile and set their onboarding stage.",
  },
  {
    title: "Assign team tasks",
    description: "Delegate tasks across your team with clear deadlines.",
  },
  {
    title: "Generate insights",
    description: "Review KPIs for sales, retention, and operations.",
  },
];

const highlights = [
  { label: "Active clients", value: "128" },
  { label: "Open tasks", value: "32" },
  { label: "Pending approvals", value: "8" },
  { label: "Weekly revenue", value: "$42.6k" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      router.replace("/login");
      return;
    }
    setSession(activeSession);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  if (!session) {
    return (
      <div className="dashboard-loading">
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-greeting">Welcome back,</p>
          <h1>{session.fullName}</h1>
          <p className="dashboard-role">Role: {session.role}</p>
        </div>
        <div className="dashboard-actions">
          <Link className="dashboard-link" href="/">
            Back to landing
          </Link>
          <button type="button" className="dashboard-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-grid">
        {highlights.map((item) => (
          <div key={item.label} className="dashboard-card">
            <p className="dashboard-card-label">{item.label}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </section>

      <section className="dashboard-actions-grid">
        <h2>Quick actions</h2>
        <div className="dashboard-action-list">
          {quickActions.map((action) => (
            <div key={action.title} className="dashboard-action-card">
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <button type="button" className="dashboard-action-button">
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
