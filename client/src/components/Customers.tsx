import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Customers.module.scss";
import { Customer } from "../types";

type Props = {};

const Customers = (props: Props) => {
  const [customers, setCustomers] = useState<Customer[] | null>(null);

  const getData = async () => {
    const response = await fetch("http://localhost:5000/customers");
    const data = await response.json();
    setCustomers(data as Customer[]);
  };

  useEffect(() => {
    getData();
  }, []);

  const customerList = () => {
    return customers?.map((customer) => {
      return (
        <div className={styles.customerContainer} key={customer.id}>
          <h3>
            {customer.name} (id# {customer.id})
          </h3>
          <p>Location: {customer.location}</p>
          <p>Number of Employees: {customer.numberOfEmployees}</p>
          <p>Person of Contact: {customer.personOfContact}</p>
          <p>Phone: {customer.phoneNumber}</p>
          <Link to={`/customers/${customer.id}`}>EDIT</Link>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      {customers ? (
        customerList()
      ) : (
        <div>u got no customors. do better biznis.</div>
      )}
    </div>
  );
};

export default Customers;
