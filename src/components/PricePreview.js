import React from "react";

function PricePreview({ breakdown }) {
  if (!breakdown) return null;

  // Safe property accessor with default value of 0
  const getPrice = (value) =>
    value !== undefined && value !== null ? value : 0;

  const basePrice = getPrice(breakdown.basePrice);
  const courtTypePremium = getPrice(breakdown.courtTypePremium);
  const peakHourFee = getPrice(breakdown.peakHourFee);
  const weekendFee = getPrice(breakdown.weekendFee);
  const equipmentFee = getPrice(breakdown.equipmentFee);
  const coachFee = getPrice(breakdown.coachFee);
  const total = getPrice(breakdown.total || breakdown.totalPrice);

  return (
    <div className="price-breakdown">
      <h3>Price Breakdown</h3>
      {basePrice > 0 && (
        <div className="price-row">
          <span>Base Price:</span>
          <span>${basePrice.toFixed(2)}</span>
        </div>
      )}
      {courtTypePremium > 0 && (
        <div className="price-row">
          <span>Court Type Premium:</span>
          <span>${courtTypePremium.toFixed(2)}</span>
        </div>
      )}
      {peakHourFee > 0 && (
        <div className="price-row">
          <span>Peak Hour Fee:</span>
          <span>${peakHourFee.toFixed(2)}</span>
        </div>
      )}
      {weekendFee > 0 && (
        <div className="price-row">
          <span>Weekend Surcharge:</span>
          <span>${weekendFee.toFixed(2)}</span>
        </div>
      )}
      {equipmentFee > 0 && (
        <div className="price-row">
          <span>Equipment Rental:</span>
          <span>${equipmentFee.toFixed(2)}</span>
        </div>
      )}
      {coachFee > 0 && (
        <div className="price-row">
          <span>Coach Fee:</span>
          <span>${coachFee.toFixed(2)}</span>
        </div>
      )}

      <div className="price-total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {breakdown.appliedRules &&
        Array.isArray(breakdown.appliedRules) &&
        breakdown.appliedRules.length > 0 && (
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
            <strong>Rules Applied:</strong> {breakdown.appliedRules.join(", ")}
          </div>
        )}
    </div>
  );
}

export default PricePreview;
