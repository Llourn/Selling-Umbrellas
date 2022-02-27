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

  const handleCustomerDelete = (id: number) => {
    fetch(`http://localhost:5000/customers/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        console.log(res);
        let data = await res.json();
        if (!res.ok) {
          const error = (data && data.message) || res.status;
          return Promise.reject(error);
        }
        console.log("Customer deleted successfully.")
        getData();
      })
      .catch((error) => {
        console.error("Error deleting customer: ", error);
      });
  };

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
          <Link to={`/customers/${customer.id}`}>
            <button>EDIT</button>
          </Link>
          <button onClick={() => handleCustomerDelete(customer.id)}>
            DELETE
          </button>
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
