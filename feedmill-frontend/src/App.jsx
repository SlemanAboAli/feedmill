// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductFormPage from "./pages/ProductFormPage";
import FeedRecipeFormPage from "./pages/FeedRecipeFormpage";
import { useState } from "react";
import Login from "./Login";
//import api from "./api/axios";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLoginSuccess = (data) => {
    console.log("loggedIn", data);
    setLoggedIn(true);
  };
  if(!loggedIn){
    
    return <Login onLoginSuccess={handleLoginSuccess}/>
  }

  return (
    
    <Router>
      <Navbar />
      <Routes>
        <Route path="/add-product" element={<ProductFormPage />} />
        <Route path="/add-recipe" element={<FeedRecipeFormPage />} />
        <Route
          path="/"
          element={
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              Welcome to Feedmill System
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}
