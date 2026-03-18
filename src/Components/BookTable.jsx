import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function BookTable() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    persons: "",
    date: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance.post("booking/", form)
      .then(() => {
        alert("Table Booked Successfully");
      })
      .catch(err => {
        console.error("Error booking table:", err);
        alert("Failed to book table. Please try again.");
      });
  };

  return (

    <section className="book-table" id="book">

      <h2>Book A Table</h2>

      <form onSubmit={handleSubmit}>

        <input name="name" placeholder="Your Name" onChange={handleChange}/>
        <input name="phone" placeholder="Phone Number" onChange={handleChange}/>
        <input name="email" placeholder="Email" onChange={handleChange}/>
        <input name="persons" placeholder="How many persons?" onChange={handleChange}/>
        <input type="date" name="date" onChange={handleChange}/>

        <button type="submit">
          BOOK NOW
        </button>

      </form>

    </section>
  );
}

export default BookTable;