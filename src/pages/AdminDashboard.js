import React, { useState } from "react";
import CourtsManager from "../components/admin/CourtsManager";
import CoachesManager from "../components/admin/CoachesManager";
import EquipmentManager from "../components/admin/EquipmentManager";
import PricingManager from "../components/admin/PricingManager";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("courts");

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Admin Configuration Panel</h2>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className={`btn btn-${
                activeTab === "courts" ? "primary" : "secondary"
              }`}
              onClick={() => setActiveTab("courts")}
            >
              Courts
            </button>
            <button
              className={`btn btn-${
                activeTab === "coaches" ? "primary" : "secondary"
              }`}
              onClick={() => setActiveTab("coaches")}
            >
              Coaches
            </button>
            <button
              className={`btn btn-${
                activeTab === "equipment" ? "primary" : "secondary"
              }`}
              onClick={() => setActiveTab("equipment")}
            >
              Equipment
            </button>
            <button
              className={`btn btn-${
                activeTab === "pricing" ? "primary" : "secondary"
              }`}
              onClick={() => setActiveTab("pricing")}
            >
              Pricing Rules
            </button>
          </div>
        </div>

        {activeTab === "courts" && <CourtsManager />}
        {activeTab === "coaches" && <CoachesManager />}
        {activeTab === "equipment" && <EquipmentManager />}
        {activeTab === "pricing" && <PricingManager />}
      </div>
    </div>
  );
}

export default AdminDashboard;
