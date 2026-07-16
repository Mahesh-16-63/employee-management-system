import React from "react";
import GrowthChart from "./GrowthChart";
import { IconUsers, IconTrendingUp, IconClipboard, IconAward } from "./Icons";

function computeSummary(employees) {
  const totalEmployees = employees.length;

  const scoredEmployees = employees.filter((emp) => emp.growth_score !== "N/A");
  const totalReviews = employees.reduce((sum, emp) => sum + emp.reviews_submitted, 0);

  const averageGrowth =
    scoredEmployees.length > 0
      ? (
          scoredEmployees.reduce((sum, emp) => sum + emp.growth_score, 0) /
          scoredEmployees.length
        ).toFixed(2)
      : "N/A";

  const highestGrowth =
    scoredEmployees.length > 0
      ? Math.max(...scoredEmployees.map((emp) => emp.growth_score))
      : "N/A";

  return { totalEmployees, averageGrowth, totalReviews, highestGrowth };
}

function SummaryCard({ label, value, Icon, accent }) {
  return (
    <div className="summary-card">
      <div className={`summary-icon summary-icon-${accent}`}>
        <Icon />
      </div>
      <p className="summary-value">{value}</p>
      <p className="summary-label">{label}</p>
    </div>
  );
}

function Dashboard({ employees }) {
  const summary = computeSummary(employees);

  return (
    <div className="page-fade">
      <div className="page-header">
        <h1 className="page-title">Employee Dashboard</h1>
        <p className="page-subtitle">Overview of your team's performance</p>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total Employees" value={summary.totalEmployees} Icon={IconUsers} accent="blue" />
        <SummaryCard label="Average Growth Score" value={summary.averageGrowth} Icon={IconTrendingUp} accent="green" />
        <SummaryCard label="Reviews Submitted" value={summary.totalReviews} Icon={IconClipboard} accent="amber" />
        <SummaryCard label="Highest Growth Score" value={summary.highestGrowth} Icon={IconAward} accent="purple" />
      </div>

      <GrowthChart employees={employees} />
    </div>
  );
}

export default Dashboard;
