import React from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "../styles/Navigation.module.scss";

type Props = {};

const Navigation = (props: Props) => {
  return (
    <nav>
      <ul className={styles.navList}>
        <li>
          <NavLink className={(navData) => navData.isActive ? styles.activeLink : ""} to="/customers">Customers</NavLink>
        </li>
        <li>
          <NavLink className={(navData) => navData.isActive ? styles.activeLink : ""} to="/newcustomer">New Customer</NavLink>
        </li>
        <li>
          <NavLink className={(navData) => navData.isActive ? styles.activeLink : ""} to="/raining">Raining</NavLink>
        </li>
        <li>
          <NavLink className={(navData) => navData.isActive ? styles.activeLink : ""} to="/topfour">Top 4</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
