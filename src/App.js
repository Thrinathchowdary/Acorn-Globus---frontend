import React from "react";
import "./App.css";
import { useState, useEffect } from "react";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/Header";

function App() {
  const [currentPage, setCurrentPage] = useState("booking");

  return (
    <div className="App">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "booking" && <BookingPage />}
      {currentPage === "admin" && <AdminDashboard />}
    </div>
  );
}

export default App;
