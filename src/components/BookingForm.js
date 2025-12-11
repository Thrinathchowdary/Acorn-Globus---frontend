import React, { useState, useEffect } from "react";
import axios from "axios";
import DateSelector from "./DateSelector";
import SlotSelector from "./SlotSelector";
import ResourceSelector from "./ResourceSelector";
import PricePreview from "./PricePreview";

function BookingForm() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    userId: "user_" + Math.random().toString(36).substr(2, 9),
    userName: "",
    userEmail: "",
    courtId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    equipmentIds: [],
    coachId: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [courtsRes, coachesRes, equipmentRes] = await Promise.all([
        axios.get("/api/courts"),
        axios.get("/api/coaches"),
        axios.get("/api/equipment"),
      ]);
      setCourts(courtsRes.data.courts);
      setCoaches(coachesRes.data.coaches);
      setEquipment(equipmentRes.data.equipment);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (date) => {
    setFormData({ ...formData, date });
    if (formData.courtId) {
      await fetchAvailableSlots(formData.courtId, date);
    }
  };

  const handleCourtChange = async (courtId) => {
    console.log("Court selected:", courtId);
    setFormData({ ...formData, courtId, startTime: "", endTime: "" });
    if (courtId) {
      await fetchAvailableSlots(courtId, formData.date);
    } else {
      setAvailableSlots([]);
    }
  };

  const fetchAvailableSlots = async (courtId, date) => {
    try {
      setLoadingSlots(true);
      const res = await axios.get("/api/bookings/available-slots", {
        params: { courtId, date },
      });
      console.log("Available slots response:", res.data);

      // Transform slots - handle both string and object formats
      const transformedSlots = res.data.availableSlots
        .map((slot) => {
          // Check if slot is already an object with start property
          if (typeof slot === "object" && slot.start) {
            return {
              start: slot.start,
              hour: slot.hour || formatSlotTime(slot.start),
            };
          }

          // Otherwise treat it as a date string
          const slotDate = new Date(slot);
          if (isNaN(slotDate.getTime())) {
            console.error("Invalid slot time:", slot);
            return null;
          }

          const hours = String(slotDate.getHours()).padStart(2, "0");
          const minutes = String(slotDate.getMinutes()).padStart(2, "0");
          const nextHours = String(slotDate.getHours() + 1).padStart(2, "0");

          return {
            start: slot,
            hour: `${hours}:${minutes} - ${nextHours}:00`,
          };
        })
        .filter((slot) => slot !== null);

      console.log("Transformed slots:", transformedSlots);
      setAvailableSlots(transformedSlots);
    } catch (error) {
      console.error("Failed to fetch available slots:", error);
      setMessage({ type: "error", text: "Failed to load time slots" });
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const formatSlotTime = (timeString) => {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return "Invalid time";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const nextHours = String(date.getHours() + 1).padStart(2, "0");
    return `${hours}:${minutes} - ${nextHours}:00`;
  };

  const handleSlotSelect = (slotStart) => {
    try {
      const start = new Date(slotStart);

      // Validate the date
      if (isNaN(start.getTime())) {
        console.error("Invalid slot time:", slotStart);
        return;
      }

      const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour slot

      setFormData({
        ...formData,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });

      updatePrice(start, end);
    } catch (error) {
      console.error("Error selecting slot:", error);
    }
  };

  const updatePrice = async (startTime, endTime) => {
    try {
      if (!formData.courtId) return;
      const res = await axios.post("/api/bookings/price-preview", {
        courtId: formData.courtId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        equipmentIds: formData.equipmentIds,
        coachId: formData.coachId || null,
      });
      setPriceBreakdown(res.data);
    } catch (error) {
      console.error("Failed to calculate price:", error);
    }
  };

  const handleResourcesChange = async (equipmentIds, coachId) => {
    setFormData({ ...formData, equipmentIds, coachId });

    if (formData.startTime && formData.endTime) {
      updatePrice(new Date(formData.startTime), new Date(formData.endTime));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.userEmail) {
      setMessage({ type: "error", text: "Please fill in your name and email" });
      return;
    }

    if (!formData.courtId || !formData.startTime || !formData.endTime) {
      setMessage({
        type: "error",
        text: "Please select a court and time slot",
      });
      return;
    }

    try {
      const res = await axios.post("/api/bookings", formData);
      setMessage({
        type: "success",
        text: "Booking confirmed! Reference: " + res.data.booking._id,
      });
      setFormData({
        ...formData,
        userName: "",
        userEmail: "",
        courtId: "",
        startTime: "",
        endTime: "",
        equipmentIds: [],
        coachId: "",
      });
      setPriceBreakdown(null);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Booking failed";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h2>Book Your Court</h2>
      </div>

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      {/* User Info */}
      <div className="grid grid-2">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.userName}
            onChange={(e) =>
              setFormData({ ...formData, userName: e.target.value })
            }
            placeholder="Your name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.userEmail}
            onChange={(e) =>
              setFormData({ ...formData, userEmail: e.target.value })
            }
            placeholder="Your email"
            required
          />
        </div>
      </div>

      {/* Court Selection */}
      <div className="form-group">
        <label>Select Court</label>
        <select
          value={formData.courtId}
          onChange={(e) => handleCourtChange(e.target.value)}
          required
        >
          <option value="">-- Choose a court --</option>
          {courts.map((court) => (
            <option key={court._id} value={court._id}>
              {court.name} ({court.type}) - ${court.basePrice}/hour
            </option>
          ))}
        </select>
      </div>

      {/* Date Selection */}
      <DateSelector date={formData.date} onChange={handleDateChange} />

      {/* Time Slot Selection */}
      {formData.courtId && (
        <>
          {loadingSlots && (
            <div className="message message-info">
              Loading available slots...
            </div>
          )}
          {!loadingSlots && availableSlots.length > 0 && (
            <SlotSelector
              slots={availableSlots}
              selectedSlot={formData.startTime}
              onSelect={handleSlotSelect}
            />
          )}
          {!loadingSlots && availableSlots.length === 0 && (
            <div className="message message-info">
              No available slots for this date. Please select a different date
              or court.
            </div>
          )}
        </>
      )}

      {/* Resources Selection */}
      <ResourceSelector
        coaches={coaches}
        equipment={equipment}
        onResourcesChange={handleResourcesChange}
      />

      {/* Price Preview */}
      {priceBreakdown && <PricePreview breakdown={priceBreakdown} />}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{ marginTop: "1rem" }}
      >
        Confirm Booking
      </button>
    </form>
  );
}

export default BookingForm;
