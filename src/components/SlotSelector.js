import React from "react";

function SlotSelector({ slots, selectedSlot, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <div className="message message-info">
        No available slots for this date. Please select a different date or
        court.
      </div>
    );
  }

  return (
    <div className="form-group">
      <label>Select Time Slot (1 hour)</label>
      <div className="slot-grid">
        {slots.map((slot) => (
          <button
            key={slot.start}
            type="button"
            className={`slot ${selectedSlot === slot.start ? "selected" : ""}`}
            onClick={() => onSelect(slot.start)}
          >
            {slot.hour}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SlotSelector;
