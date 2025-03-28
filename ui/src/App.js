import React, { useState, useEffect } from "react";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './components/login.component'
import SignUp from './components/signup.component'
import Home from './components/home.component'
import Checkout from "./components/checkout.component";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    if (isLoggedIn) {
      setIsLoggedIn(false);
    }
  };

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
