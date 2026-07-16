import React from "react";
import { IconEdit } from "./Icons";

function MonthlyReviewsPage({ employees, onReviewClick }) {
  return (
    <div className="page-fade">
      <div className="page-header">
        <h1 className="page-title">Monthly Reviews</h1>
        <p className="page-subtitle">Add or update a rating for any employee</p>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Reviews Submitted</th>
                <th>Growth Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.reviews_submitted}</td>
                    <td>
                      <span className="growth-pill">{emp.growth_score}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-small btn-primary"
                        onClick={() => onReviewClick(emp)}
                      >
                        <IconEdit /> Add Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MonthlyReviewsPage;
