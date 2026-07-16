import React, { useState, useEffect, useCallback } from "react";
import { getEmployees } from "./api";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import EmployeesPage from "./components/EmployeesPage";
import MonthlyReviewsPage from "./components/MonthlyReviewsPage";
import ReviewModal from "./components/ReviewModal";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Single source of truth: always re-fetch from Flask/MySQL after any change.
  const loadEmployees = useCallback(async () => {
    const res = await getEmployees();
    setEmployees(res.data);
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleReviewSaved = () => {
    loadEmployees(); // refreshes table, dashboard cards, and scatter chart
  };

  return (
    <div className="app-shell">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="app-container" key={activeTab}>
        {activeTab === "dashboard" && <Dashboard employees={employees} />}

        {activeTab === "employees" && (
          <EmployeesPage
            employees={employees}
            onDataChanged={loadEmployees}
            onReviewClick={setSelectedEmployee}
          />
        )}

        {activeTab === "reviews" && (
          <MonthlyReviewsPage
            employees={employees}
            onReviewClick={setSelectedEmployee}
          />
        )}
      </div>

      {selectedEmployee && (
        <ReviewModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onReviewSaved={handleReviewSaved}
        />
      )}
    </div>
  );
}

export default App;
