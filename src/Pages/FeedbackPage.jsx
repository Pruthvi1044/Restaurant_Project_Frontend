import React from 'react';
import Navbar from '../Components/Navbar';
import Feedback from '../Components/Feedback';
import Footer from '../Components/Footer';

const FeedbackPage = () => {
  return (
    <div className="page-container">
      <Navbar />
      <Feedback />
      <Footer />
    </div>
  );
};

export default FeedbackPage;
