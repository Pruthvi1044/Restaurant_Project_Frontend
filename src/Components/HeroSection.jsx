import React from "react";
import burger from "../assets/burger.png";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-text">

        <h1>Fast Food Restaurant</h1>

        <p>
          Experience delicious burgers, pizzas and more made
          with fresh ingredients and amazing taste.
        </p>

        <button className="order-btn">
          Order Now
        </button>

      </div>

      <div className="hero-image">
        <img src={burger} alt="burger"/>
      </div>

    </section>
  );
}

export default Hero;