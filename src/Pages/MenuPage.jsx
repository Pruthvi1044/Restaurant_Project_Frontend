import React from 'react';
import Navbar from '../Components/Navbar';
import Menu from '../Components/Menu';
import Footer from '../Components/Footer';

const MenuPage = () => {
  return (
    <div className="page-container">
      <Navbar />
      <Menu />
      <Footer />
    </div>
  );
};

export default MenuPage;
