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
        console.log("Customer deleted successfully.");
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
          <div className={styles.header}>
            <h3>
              {customer.name} (id# {customer.id})
            </h3>
          </div>
          <div className={styles.body}>
            <div className={styles.dataContainer}>
              <p><span>Location:</span> {customer.location}</p>
              <p><span>Number of Employees:</span> {customer.numberOfEmployees}</p>
              <p><span>Person of Contact:</span> {customer.personOfContact}</p>
              <p><span>Phone:</span> {customer.phoneNumber}</p>
            </div>
            <div className={styles.buttonContainer}>
              <Link to={`/customers/${customer.id}`}>
                <button>EDIT</button>
              </Link>
              <button onClick={() => handleCustomerDelete(customer.id)}>
                DELETE
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className={styles.container}>
      {customers ? customerList() : <div>Loading...</div>}
    </div>
  );
};

export default Customers;
