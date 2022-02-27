import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Navigation.module.scss";

type Props = {};

const Navigation = (props: Props) => {
  return (
    <nav>
      <ul className={styles.navList}>
        <li>
          <Link to="/customers">Customers</Link>
        </li>
        <li>
          <Link to="/raining">Raining</Link>
        </li>
        <li>
          <Link to="/newcustomer">New Customer</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
