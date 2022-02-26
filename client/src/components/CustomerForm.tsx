import React, { useEffect, useState } from "react";
import { withFormik, FormikProps, FormikErrors, Form, Field } from "formik";
import styles from "../styles/CustomerForm.module.scss";
import { useParams } from "react-router-dom";
import { Customer, Location } from "../types";
import { WEATHER_API_KEY } from "../config";

// Shape of form values
interface FormValues {
  name: string;
  personOfContact: string;
  phoneNumber: string;
  location: string;
  numberOfEmployees: number;
  lat: number;
  lon: number;
}

interface OtherProps {
  customer: Customer | null;
}

type Coords = {
  lat: number;
  lon: number;
};

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { touched, errors, isSubmitting, resetForm, customer, values } = props;

  const [locations, setLocations] = useState<Location[] | null>(null);
  const [coords, setCoords] = useState<Coords>({ lat: 0, lon: 0 });

  const saveLocationData = (locationName: string, lat: number, lon: number) => {
    values.location = locationName;
    values.lat = lat;
    values.lon = lon;
  };

  const getLocations = async (location: string) => {
    console.log(process.env.OPEN_WEATHER_API_KEY);
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${WEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
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
    console.log(collection);
    setLocations(collection);
  };

  const locationResults = () => {
    return locations?.map((location, index) => {
      return (
        <div key={index} className={styles.location}>
          <p
            onClick={() => {
              saveLocationData(location.name, location.lat, location.lon);
            }}
          >
            {location.name}, {location.state} {location.country}
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
          name: "",
          personOfContact: "",
          phoneNumber: "",
          location: "",
          numberOfEmployees: 1,
          lat: 0,
          lon: 0,
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
              type="button"
            >
              Lookup
            </button>
            <div className={styles.locationContainer}>{locationResults()}</div>
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
        Submit
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
      name: customer?.name || "",
      personOfContact: customer?.personOfContact || "",
      phoneNumber: customer?.phoneNumber || "",
      location: customer?.location || "",
      numberOfEmployees: customer?.numberOfEmployees || 1,
      lat: customer?.lat || 0,
      lon: customer?.lon || 0,
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
    // do submitting things
    const fullCustomerData = {
      name: values.name,
      location: values.location,
      personOfContact: values.personOfContact,
      numberOfEmployees: values.numberOfEmployees,
      lat: values.lat,
      lon: values.lon,
    };

    console.log("LOG DATA");
    console.log(fullCustomerData);

    fetch("http://localhost:5000/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullCustomerData),
    }).then(() => {
      console.log("New Customer Added");
    });
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

  return (
    <div>
      <h1>Customer Information</h1>
      {checked && <MyForm customer={customer} />}
    </div>
  );
};

export default CustomerForm;
