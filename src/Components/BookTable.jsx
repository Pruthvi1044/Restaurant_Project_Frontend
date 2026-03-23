import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

function BookTable() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    guests: "",
    booking_date: "",
    booking_time: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    axiosInstance.post("booking/create/", form)
      .then(() => {
        alert("Table Booked Successfully");
        setForm({
          name: "",
          phone: "",
          email: "",
          guests: "",
          booking_date: "",
          booking_time: "",
          message: ""
        });
      })
      .catch(err => {
        console.error("Error booking table:", err);
        alert("Failed to book table. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <section className="book-table" id="book">
        <h2>Book A Table</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required/>
          <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required/>
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required/>
          <select name="guests" value={form.guests} onChange={handleChange} required>
            <option value="" disabled>How many persons?</option>
            <option value="1">1 Person</option>
            <option value="2">2 Persons</option>
            <option value="3">3 Persons</option>
            <option value="4">4 Persons</option>
            <option value="5">5 Persons</option>
            <option value="6">6+ Persons</option>
          </select>
          <input type="date" name="booking_date" value={form.booking_date} onChange={handleChange} required/>
          <input type="time" name="booking_time" value={form.booking_time} onChange={handleChange} required/>
          <textarea name="message" placeholder="Special Request" value={form.message} onChange={handleChange}></textarea>

          <button type="submit" disabled={loading}>
            {loading ? "BOOKING..." : "BOOK NOW"}
          </button>
        </form>
      </section>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

export default BookTable;