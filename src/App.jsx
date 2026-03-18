import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import CartPage from "./Pages/CartPage";
import MenuPage from "./Pages/MenuPage";
import AboutPage from "./Pages/AboutPage";
import BookTablePage from "./Pages/BookTablePage";
import FeedbackPage from "./Pages/FeedbackPage";
import CheckoutPage from "./Pages/CheckoutPage";
import AdminDashboard from "./Pages/AdminDashboard";
import VerifyEmail from "./Pages/VerifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/book-table" element={<BookTablePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/verify-email/:uid/:token" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;