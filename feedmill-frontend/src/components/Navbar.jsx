// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>Feedmill Management</div>
      <nav className={classes.nav}>
        <ul className={classes.list}> 
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/add-recipe">Add Recipe</Link>
          </li>
          <li>
            <Link to="/add-product">Add Product</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/finance">Finance</Link>
          </li>
          <li>
            <Link to="/production">Production</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
