import React, { useState, useEffect } from "react";
import axios from "axios";

function EquipmentManager() {
  const [equipment, setEquipment] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "racket",
    totalStock: 10,
    rentalPrice: 5,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("/api/equipment");
      setEquipment(res.data.equipment);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load equipment" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/equipment", formData);
      setMessage({ type: "success", text: "Equipment added successfully" });
      setFormData({ name: "", type: "racket", totalStock: 10, rentalPrice: 5 });
      fetchEquipment();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add equipment" });
    }
  };

  const handleDelete = async (equipmentId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/equipment/${equipmentId}`);
        setMessage({ type: "success", text: "Equipment deactivated" });
        fetchEquipment();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete equipment" });
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
          <label>Equipment Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Professional Racket"
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="racket">Racket</option>
            <option value="shoes">Shoes</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Stock Quantity</label>
          <input
            type="number"
            value={formData.totalStock}
            onChange={(e) =>
              setFormData({ ...formData, totalStock: parseInt(e.target.value) })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Rental Price ($)</label>
          <input
            type="number"
            value={formData.rentalPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                rentalPrice: parseFloat(e.target.value),
              })
            }
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Equipment
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h3>Existing Equipment</h3>
        <div className="grid grid-3">
          {equipment.map((item) => (
            <div key={item._id} className="card">
              <h4>{item.name}</h4>
              <p>
                Type: <strong>{item.type}</strong>
              </p>
              <p>
                Stock: <strong>{item.totalStock}</strong>
              </p>
              <p>
                Rental: <strong>${item.rentalPrice}</strong>
              </p>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(item._id)}
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

export default EquipmentManager;
