import React from 'react';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Fast Food Restaurant</h1>
        <p className="hero-text">
          Doloremque, itaque aperiam facilis veniam, commodi temporibus sapiente ad mollitia laborum quam quisquam error unde. Tempona ex doloremque laborum, sunt repellat dolores, sit magni quos nihil cumque libero ipsam.
        </p>
        <button className="btn-primary hero-btn" onClick={() => navigate('/menu')}>Order Now</button>
      </div>
    </section>
  );
};

export default Hero;
