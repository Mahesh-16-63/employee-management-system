import React, { useState } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import SearchBar from "./SearchBar";

function EmployeesPage({ employees, onDataChanged, onReviewClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.employee_id.toLowerCase().includes(term) ||
      emp.name.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-fade">
      <div className="page-header">
        <h1 className="page-title">Employees</h1>
        <p className="page-subtitle">Register and manage your team</p>
      </div>

      <div className="form-card-wrapper">
        <EmployeeForm onEmployeeAdded={onDataChanged} />
      </div>

      <div className="table-section-header">
        <h2 className="table-section-title">All Employees</h2>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      <EmployeeTable
        employees={filteredEmployees}
        onDataChanged={onDataChanged}
        onReviewClick={onReviewClick}
      />
    </div>
  );
}

export default EmployeesPage;
