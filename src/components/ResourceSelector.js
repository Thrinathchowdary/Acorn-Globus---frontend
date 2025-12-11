import React, { useState } from "react";

function ResourceSelector({ coaches, equipment, onResourcesChange }) {
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  const handleCoachChange = (coachId) => {
    setSelectedCoach(coachId);
    onResourcesChange(selectedEquipment, coachId);
  };

  const handleEquipmentToggle = (equipmentId) => {
    const newEquipment = selectedEquipment.includes(equipmentId)
      ? selectedEquipment.filter((id) => id !== equipmentId)
      : [...selectedEquipment, equipmentId];
    setSelectedEquipment(newEquipment);
    onResourcesChange(newEquipment, selectedCoach);
  };

  return (
    <div>
      <div className="form-group">
        <label>Add Coach (Optional)</label>
        <select
          value={selectedCoach}
          onChange={(e) => handleCoachChange(e.target.value)}
        >
          <option value="">-- No coach --</option>
          {coaches.map((coach) => (
            <option key={coach._id} value={coach._id}>
              {coach.name} ({coach.specialization}) - ${coach.hourlyRate}/hour
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Add Equipment (Optional)</label>
        <div className="checkbox-group">
          {equipment.map((item) => (
            <div key={item._id} className="checkbox-item">
              <input
                type="checkbox"
                id={item._id}
                checked={selectedEquipment.includes(item._id)}
                onChange={() => handleEquipmentToggle(item._id)}
              />
              <label htmlFor={item._id}>
                {item.name} (+${item.rentalPrice})
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResourceSelector;
