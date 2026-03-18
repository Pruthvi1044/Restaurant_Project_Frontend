import React from 'react';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Offers from '../Components/Offers';
import Menu from '../Components/Menu';
import Booking from '../Components/Booking';
import Feedback from '../Components/Feedback';
import Footer from '../Components/Footer';

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <Hero />
      <Offers />
      <Menu />
      <Booking />
      <Feedback />
      <Footer />
    </div>
  );
};

export default Home;