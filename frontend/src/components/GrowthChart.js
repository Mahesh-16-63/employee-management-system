import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const emp = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p><strong>{emp.name}</strong></p>
        <p>Department: {emp.department}</p>
        <p>Experience: {emp.experience} yrs</p>
        <p>Growth Score: {emp.growth_score}</p>
      </div>
    );
  }
  return null;
}

function GrowthChart({ employees }) {
  // Only employees who have submitted at least one review appear on the chart
  const chartData = employees
    .filter((emp) => emp.growth_score !== "N/A")
    .map((emp) => ({
      name: emp.name,
      department: emp.department,
      experience: emp.experience,
      growth_score: emp.growth_score,
    }));

  return (
    <div className="chart-card">
      <h2>Employee Experience vs Growth</h2>
      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e9f0" />
          <XAxis
            type="number"
            dataKey="experience"
            name="Experience"
            unit=" yrs"
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{ value: "Years of Experience", position: "insideBottom", offset: -10, fill: "#64748b" }}
          />
          <YAxis
            type="number"
            dataKey="growth_score"
            name="Growth Score"
            domain={[0, 10]}
            tick={{ fill: "#64748b", fontSize: 12 }}
            label={{ value: "Growth Score", angle: -90, position: "insideLeft", fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={chartData} fill="#2563EB" />
        </ScatterChart>
      </ResponsiveContainer>
      {chartData.length === 0 && (
        <p className="chart-empty">No employees have reviews yet.</p>
      )}
    </div>
  );
}

export default GrowthChart;
