import React, { useState, useEffect } from "react";
import axios from "axios";

function CoachesManager() {
  const [coaches, setCoaches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "badminton",
    hourlyRate: 50,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const res = await axios.get("/api/coaches");
      setCoaches(res.data.coaches);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load coaches" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/coaches", formData);
      setMessage({ type: "success", text: "Coach added successfully" });
      setFormData({ name: "", specialization: "badminton", hourlyRate: 50 });
      fetchCoaches();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add coach" });
    }
  };

  const handleDelete = async (coachId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/coaches/${coachId}`);
        setMessage({ type: "success", text: "Coach deactivated" });
        fetchCoaches();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete coach" });
      }
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div>
      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-2">
        <div className="form-group">
          <label>Coach Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Coach name"
            required
          />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <select
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
          >
            <option value="badminton">Badminton</option>
            <option value="multi-sport">Multi-Sport</option>
          </select>
        </div>
        <div className="form-group">
          <label>Hourly Rate ($)</label>
          <input
            type="number"
            value={formData.hourlyRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                hourlyRate: parseFloat(e.target.value),
              })
            }
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Coach
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h3>Existing Coaches</h3>
        <div className="grid grid-3">
          {coaches.map((coach) => (
            <div key={coach._id} className="card">
              <h4>{coach.name}</h4>
              <p>
                Specialization: <strong>{coach.specialization}</strong>
              </p>
              <p>
                Rate: <strong>${coach.hourlyRate}/hr</strong>
              </p>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(coach._id)}
              >
                Deactivate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoachesManager;
