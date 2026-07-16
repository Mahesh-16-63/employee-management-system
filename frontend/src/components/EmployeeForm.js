import React, { useState } from "react";
import { addEmployee } from "../api";
import { IconPlus } from "./Icons";

const initialFormState = {
  employee_id: "",
  name: "",
  department: "",
  experience: "",
};

function EmployeeForm({ onEmployeeAdded }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setFormData(initialFormState);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // POST /employees -> Flask inserts into MySQL -> we re-fetch the list
      await addEmployee(formData);
      handleClear();
      onEmployeeAdded();
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Register Employee</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="employee-form-grid">
        <div className="field">
          <label>Employee ID</label>
          <input
            type="text"
            name="employee_id"
            placeholder="e.g. E101"
            value={formData.employee_id}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Employee Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Justin"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. Engineering"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Experience (Years)</label>
          <input
            type="number"
            name="experience"
            placeholder="e.g. 3"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            step="0.1"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            <IconPlus /> {submitting ? "Adding..." : "Add Employee"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
