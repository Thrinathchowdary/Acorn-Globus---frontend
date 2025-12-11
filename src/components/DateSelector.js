import React from "react";

function DateSelector({ date, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Set minimum date to today
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="form-group">
      <label>Select Date</label>
      <input
        type="date"
        value={date}
        onChange={handleChange}
        min={minDate}
        required
      />
    </div>
  );
}

export default DateSelector;
