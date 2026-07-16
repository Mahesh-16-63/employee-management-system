import React from "react";
import { deleteEmployee } from "../api";
import { IconTrash, IconEdit } from "./Icons";

function EmployeeTable({ employees, onDataChanged, onReviewClick }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      // DELETE /employees/<id> -> Flask removes from MySQL -> we re-fetch the list
      await deleteEmployee(id);
      onDataChanged();
    }
  };

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Experience (Years)</th>
              <th>Reviews Submitted</th>
              <th>Growth Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.employee_id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.experience}</td>
                  <td>{emp.reviews_submitted}</td>
                  <td>
                    <span className="growth-pill">{emp.growth_score}</span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-btn icon-btn-primary"
                      title="Monthly Review"
                      onClick={() => onReviewClick(emp)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="icon-btn icon-btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(emp.id)}
                    >
                      <IconTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
