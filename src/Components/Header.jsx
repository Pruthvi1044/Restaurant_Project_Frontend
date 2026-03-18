import React from "react";
import "../styles/style.css";

function Header() {
  return (
    <header className="header">

      <div className="logo">
        Swaad Indian Bistro
      </div>

      <nav className="nav">

        <a href="#">HOME</a>
        <a href="#menu">MENU</a>
        <a href="#about">ABOUT</a>
        <a href="#book">BOOK TABLE</a>
        <a href="#feedback">FEEDBACK</a>

      </nav>

      <div className="header-icons">
        <button className="login-btn">Login</button>
      </div>

    </header>
  );
}

export default Header;