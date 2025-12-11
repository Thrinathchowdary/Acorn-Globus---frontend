import React, { useState, useEffect } from "react";
import axios from "axios";

function CourtsManager() {
  const [courts, setCourts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "indoor",
    basePrice: 50,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const res = await axios.get("/api/courts");
      setCourts(res.data.courts);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load courts" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/courts", formData);
      setMessage({ type: "success", text: "Court added successfully" });
      setFormData({ name: "", type: "indoor", basePrice: 50 });
      fetchCourts();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add court" });
    }
  };

  const handleDelete = async (courtId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/courts/${courtId}`);
        setMessage({ type: "success", text: "Court deactivated" });
        fetchCourts();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete court" });
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
          <label>Court Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Court A"
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Base Price ($)</label>
          <input
            type="number"
            value={formData.basePrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                basePrice: parseFloat(e.target.value),
              })
            }
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Court
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h3>Existing Courts</h3>
        <div className="grid grid-3">
          {courts.map((court) => (
            <div key={court._id} className="card">
              <h4>{court.name}</h4>
              <p>
                Type: <strong>{court.type}</strong>
              </p>
              <p>
                Base Price: <strong>${court.basePrice}</strong>
              </p>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(court._id)}
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

export default CourtsManager;
