import React, { useState, useEffect } from "react";
import axios from "axios";

function PricingManager() {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "timeRange",
    conditions: {},
    surcharge: 0,
    multiplier: 1,
    priority: 0,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await axios.get("/api/pricing-rules");
      setRules(res.data.rules);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load pricing rules" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/pricing-rules", formData);
      setMessage({ type: "success", text: "Pricing rule added successfully" });
      setFormData({
        name: "",
        description: "",
        type: "timeRange",
        conditions: {},
        surcharge: 0,
        multiplier: 1,
        priority: 0,
      });
      fetchRules();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add pricing rule" });
    }
  };

  const handleDelete = async (ruleId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`/api/pricing-rules/${ruleId}`);
        setMessage({ type: "success", text: "Pricing rule deleted" });
        fetchRules();
      } catch (error) {
        setMessage({ type: "error", text: "Failed to delete rule" });
      }
    }
  };

  const handleToggle = async (ruleId) => {
    try {
      await axios.patch(`/api/pricing-rules/${ruleId}/toggle`);
      setMessage({ type: "success", text: "Rule toggled" });
      fetchRules();
    } catch (error) {
      setMessage({ type: "error", text: "Failed to toggle rule" });
    }
  };

  if (loading) return <div className="spinner"></div>;

  const handleConditionChange = (key, value) => {
    setFormData({
      ...formData,
      conditions: { ...formData.conditions, [key]: value },
    });
  };

  return (
    <div>
      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-2">
        <div className="form-group">
          <label>Rule Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Peak Hours"
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="timeRange">Time Range</option>
            <option value="dayOfWeek">Day of Week</option>
            <option value="courtType">Court Type</option>
            <option value="holiday">Holiday</option>
          </select>
        </div>
        <div className="form-group">
          <label>Surcharge ($)</label>
          <input
            type="number"
            value={formData.surcharge}
            onChange={(e) =>
              setFormData({
                ...formData,
                surcharge: parseFloat(e.target.value),
              })
            }
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Multiplier (1.0 = no change)</label>
          <input
            type="number"
            value={formData.multiplier}
            onChange={(e) =>
              setFormData({
                ...formData,
                multiplier: parseFloat(e.target.value),
              })
            }
            step="0.1"
          />
        </div>
        <div className="form-group">
          <label>Priority (higher = applied first)</label>
          <input
            type="number"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: parseInt(e.target.value) })
            }
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Rule
        </button>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <h3>Existing Rules</h3>
        <div className="grid grid-2">
          {rules.map((rule) => (
            <div key={rule._id} className="card">
              <h4>{rule.name}</h4>
              <p>
                Type: <strong>{rule.type}</strong>
              </p>
              {rule.surcharge > 0 && (
                <p>
                  Surcharge: <strong>${rule.surcharge}</strong>
                </p>
              )}
              {rule.multiplier !== 1 && (
                <p>
                  Multiplier: <strong>{rule.multiplier}x</strong>
                </p>
              )}
              <p>
                Status:{" "}
                <strong>{rule.isActive ? "✅ Active" : "❌ Inactive"}</strong>
              </p>
              <div
                style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}
              >
                <button
                  className="btn btn-secondary btn-small"
                  onClick={() => handleToggle(rule._id)}
                >
                  Toggle
                </button>
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(rule._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingManager;
