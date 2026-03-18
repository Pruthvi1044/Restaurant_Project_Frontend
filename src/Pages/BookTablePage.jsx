import React from 'react';
import Navbar from '../Components/Navbar';
import Booking from '../Components/Booking';
import Footer from '../Components/Footer';

const BookTablePage = () => {
  return (
    <div className="page-container">
      <Navbar />
      <Booking />
      <Footer />
    </div>
  );
};

export default BookTablePage;
