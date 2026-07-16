import React, { useState, useEffect } from "react";
import { saveReview, getReviews } from "../api";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ReviewModal({ employee, onClose, onReviewSaved }) {
  const [month, setMonth] = useState("");
  const [rating, setRating] = useState(5);
  const [existingReviews, setExistingReviews] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      // GET /reviews/<employee_id> -> read current history from MySQL
      const res = await getReviews(employee.id);
      setExistingReviews(res.data);
    };
    fetchReviews();
  }, [employee.id]);

  // When the month changes, pre-fill the rating if a review already exists
  // for that month (so saving again updates it instead of duplicating it).
  useEffect(() => {
    const existing = existingReviews.find((r) => r.month === month);
    setRating(existing ? existing.rating : 5);
  }, [month, existingReviews]);

  const handleSave = async () => {
    setError("");

    if (!month) {
      setError("Please select a month.");
      return;
    }

    const ratingValue = Number(rating);
    if (!ratingValue || ratingValue < 1 || ratingValue > 10) {
      setError("Rating must be between 1 and 10.");
      return;
    }

    setSaving(true);
    try {
      // POST /reviews -> Flask inserts/updates in MySQL -> parent re-fetches employees
      await saveReview({
        employee_id: employee.id,
        month,
        rating: ratingValue,
      });
      onReviewSaved();
      onClose();
    } catch (err) {
      const message = err.response?.data?.error || "Something went wrong.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const isUpdate = existingReviews.some((r) => r.month === month);

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Monthly Review</h2>
        <p className="modal-subtitle">{employee.name} · {employee.department}</p>
        {error && <p className="error-message">{error}</p>}

        <div className="field">
          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select month</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
                {existingReviews.some((r) => r.month === m) ? " (reviewed)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>
            Rating <span className="rating-readout">{rating}</span> / 10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rating-slider"
          />
        </div>

        <div className="form-buttons modal-buttons">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary btn-large" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : isUpdate ? "Update Review" : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
