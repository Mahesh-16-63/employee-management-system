import React from "react";
import { IconUsers } from "./Icons";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "employees", label: "Employees" },
  { key: "reviews", label: "Monthly Reviews" },
];

function Navigation({ activeTab, onTabChange }) {
  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        <div className="app-navbar-brand">
          <span className="app-navbar-logo">
            <IconUsers />
          </span>
          <span>Employee Management</span>
        </div>

        <ul className="app-navbar-tabs">
          {TABS.map((tab) => (
            <li key={tab.key}>
              <button
                className={`app-navbar-link ${
                  activeTab === tab.key ? "active" : ""
                }`}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
