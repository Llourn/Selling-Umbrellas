import React, { useEffect, useState } from "react";
import { withFormik, FormikProps, FormikErrors, Form, Field } from "formik";
import styles from "../styles/CustomerForm.module.scss";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { Customer, Location } from "../types";
import { WEATHER_API_KEY } from "../config";

// Shape of form values
interface FormValues {
  id: number;
  name: string;
  personOfContact: string;
  phoneNumber: string;
  location: string;
  numberOfEmployees: number;
  lat: number;
  lon: number;
  nav: NavigateFunction | null;
}

interface OtherProps {
  customer: Customer | null;
}

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting, resetForm, customer, values } = props;

  values.nav = useNavigate();

  values.id = customer ? customer.id : -1;
  const [locations, setLocations] = useState<Location[] | null>(null);

  const saveLocationData = (locationName: string, lat: number, lon: number) => {
    values.location = locationName;
    values.lat = lat;
    values.lon = lon;
  };

  const getLocations = async (location: string) => {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    //@ts-ignore
    let collection: [Location] = [];
    for (let i = 0; i < data.length; i++) {
      const location = data[i];
      const newLocation = {
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      };
      collection.push(newLocation);
    }
    setLocations(collection);
  };

  const locationResults = () => {
    return locations?.map((location, index) => {
      const locationName = `${location.name || ""}, ${location.state || ""} ${
        location.country || ""
      }`
        .replace(/\s+/g, " ")
        .trim();
      return (
        <div key={index} className={styles.location}>
          <p
            className={styles.locationSelect}
            onClick={() => {
              saveLocationData(locationName, location.lat, location.lon);
              values.location = locationName;
              setLocations(null);
            }}
          >
            ► {location.name}, {location.state} {location.country}
          </p>
        </div>
      );
    });
  };

  const handleLookUp = () => {
    getLocations(values.location);
  };

  useEffect(() => {
    if (!customer) {
      resetForm({
        values: {
          id: -1,
          name: "",
          personOfContact: "",
          phoneNumber: "",
          location: "",
          numberOfEmployees: 1,
          lat: 0,
          lon: 0,
          nav: null,
        },
      });
    }
  }, [customer]);

  return (
    <Form className={styles.container}>
      {customer ? (
        <p>
          Change any of the fields below and click Update to apply the changes.
        </p>
      ) : (
        <p>
          Fill out the form below and click submit to add a new customer. All
          fields are required.
        </p>
      )}
      <div className={styles.fieldWrapper}>
        <section className={styles.fieldContainer}>
          <label htmlFor="name">Name</label>
          <Field type="text" name="name" />
        </section>
        {touched.name && errors.name && (
          <div className={styles.error}>{errors.name}</div>
        )}
      </div>

      <div className={styles.fieldWrapper}>
        <section className={styles.fieldContainer}>
          <label htmlFor="location">Location</label>
          <Field type="text" name="location" />
        </section>
        {touched.location && errors.location ? (
          <div className={styles.error}>{errors.location}</div>
        ) : (
          <div className={styles.buttonContainer}>
            <button
              onClick={handleLookUp}
              className={styles.button}
              disabled={values.location.length <= 0}
              type="button"
            >
              Lookup
            </button>
            <div className={styles.locationContainer}>
              {locations && <p>Please select one of the options below.</p>}
              {locationResults()}
            </div>
          </div>
        )}
      </div>

      <div className={styles.fieldWrapper}>
        <section className={styles.fieldContainer}>
          <label htmlFor="name">Person of contact</label>
          <Field type="text" name="personOfContact" />
        </section>
        {touched.personOfContact && errors.personOfContact && (
          <div className={styles.error}>{errors.personOfContact}</div>
        )}
      </div>

      <div className={styles.fieldWrapper}>
        <section className={styles.fieldContainer}>
          <label htmlFor="phoneNumber">Phone number</label>
          <Field type="text" name="phoneNumber" />
        </section>
        {touched.phoneNumber && errors.phoneNumber && (
          <div className={styles.error}>{errors.phoneNumber}</div>
        )}
      </div>

      <div className={styles.fieldWrapper}>
        <section className={styles.fieldContainer}>
          <label htmlFor="numberOfEmployees">Number of employees</label>
          <Field type="number" name="numberOfEmployees" />
        </section>
        {touched.numberOfEmployees && errors.numberOfEmployees && (
          <div className={styles.error}>{errors.numberOfEmployees}</div>
        )}
      </div>

      <button className={styles.button} type="submit" disabled={isSubmitting}>
        {customer ? "Update customer" : "Create new customer"}
      </button>
    </Form>
  );
};

// The type of props MyForm receives
interface MyFormProps {
  customer: Customer | null; // if this passed all the way through you might do this or make a union type
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: ({ customer }) => {
    return {
      id: customer?.id || -1,
      name: customer?.name || "",
      personOfContact: customer?.personOfContact || "",
      phoneNumber: customer?.phoneNumber || "",
      location: customer?.location || "",
      numberOfEmployees: customer?.numberOfEmployees || 1,
      lat: customer?.lat || 0,
      lon: customer?.lon || 0,
      nav: null,
    };
  },

  // Add a custom validation function (this can be async too!)
  validate: (values: FormValues) => {
    let errors: FormikErrors<FormValues> = {};

    if (!values.name) {
      errors.name = "Required";
    }

    if (!values.personOfContact) {
      errors.personOfContact = "Required";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "Required";
    }

    if (!values.location) {
      errors.location = "Required";
    }

    if (!values.numberOfEmployees || values.numberOfEmployees < 1) {
      errors.numberOfEmployees =
        "The number of employees must be greater than 0.";
    }

    return errors;
  },

  handleSubmit: (values) => {
    const fullCustomerData = {
      id: values.id,
      name: values.name,
      location: values.location,
      phoneNumber: values.phoneNumber,
      personOfContact: values.personOfContact,
      numberOfEmployees: values.numberOfEmployees,
      lat: values.lat,
      lon: values.lon,
    };
    if (values.id < 0) {
      fetch("http://localhost:5000/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullCustomerData),
      }).then((res) => {
        console.log(res);
        if (values.nav) values.nav("/customers");
      });
    } else {
      fetch(`http://localhost:5000/customers/${values.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullCustomerData),
      }).then((res) => {
        console.log(res);
        if (values.nav) values.nav("/customers");
      });
    }
  },
})(InnerForm);

const CustomerForm = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [checked, setChecked] = useState<boolean>(false);

  let { id } = useParams();

  const getCustomerData = async () => {
    const response = await fetch(`http://localhost:5000/customers/${id}`);
    const data = (await response.json()) as Customer;
    setCustomer(data);
    setChecked(true);
  };

  useEffect(() => {
    setChecked(false);
    if (Number(id) >= 0) {
      getCustomerData();
    } else {
      setCustomer(null);
      setChecked(true);
    }
  }, [id]);

  return <div>{checked && <MyForm customer={customer} />}</div>;
};

export default CustomerForm;
