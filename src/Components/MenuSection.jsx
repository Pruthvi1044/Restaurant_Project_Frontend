import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axiosInstance.get("menu/")
      .then(res => setMenu(res.data))
      .catch(err => console.error("Error fetching menu:", err));
  }, []);

  return (
    <section className="menu" id="menu">

      <h2>Our Menu</h2>

      <div className="menu-grid">

        {menu.map(item => (

          <div className="menu-card" key={item.id}>

            <img src={item.image} alt={item.name}/>

            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <div className="menu-bottom">

              <span>₹{item.price}</span>

              <button className="cart-btn">
                🛒
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Menu;