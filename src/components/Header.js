import React from "react";

function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🏸 Court Booking Platform</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${currentPage === "booking" ? "active" : ""}`}
            onClick={() => setCurrentPage("booking")}
          >
            Book a Court
          </button>
          <button
            className={`nav-btn ${currentPage === "admin" ? "active" : ""}`}
            onClick={() => setCurrentPage("admin")}
          >
            Admin Panel
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
