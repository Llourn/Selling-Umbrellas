import { useEffect, useState } from "react";
import { WEATHER_API_KEY } from "../config";
import { Customer } from "../types";
import styles from "../styles/Raining.module.scss";

type Coords = {
  lat: number;
  lon: number;
};

type RainData = {
  coords: Coords;
  times: string[];
  companies: number[];
};

const Raining = () => {
  const [customers, setCustomers] = useState<Customer[]>();
  const [raining, setRaining] = useState<RainData[]>();

  const getCustomers = async () => {
    const response = await fetch("http://localhost:5000/customers");
    const customerData = (await response.json()) as Customer[];
    setCustomers(customerData);

    let locationData: Coords[] = [];
    customerData.forEach((customer) => {
      const location = { lat: customer.lat, lon: customer.lon };
      locationData.push(location);
    });

    let uniqueLocationData = locationData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t: Coords) => t.lat === value.lat && t.lon === value.lon
        )
    );

    let urls: string[] = [];
    uniqueLocationData.forEach((location) => {
      urls.push(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}`
      );
    });

    let rainCoordsAndDates: RainData[] = [];
    Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then(
      (values) => {
        values.forEach((data, index) => {
          let rainData: RainData;

          rainData = getRainDates(uniqueLocationData[index], data.list);

          rainData.companies = findWetCompanies(rainData, customerData);

          if (rainData.times.length > 0) rainCoordsAndDates.push(rainData);
        });
        setRaining(rainCoordsAndDates);
      }
    );
  };

  const findWetCompanies = (rainData: RainData, cusList: Customer[]) => {
    let customerList: number[] = [];
    cusList?.forEach((customer) => {
      if (
        customer.lat === rainData.coords.lat &&
        customer.lon === rainData.coords.lon
      )
        customerList.push(customer.id);
    });

    return customerList;
  };

  const getRainDates = (location: Coords, times: any) => {
    let rainDates: string[] = [];

    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      if (feelsLikeRain(time.weather[0].id)) {
        rainDates.push(time.dt_txt);
      }
    }
    return { coords: location, times: rainDates, companies: [] };
  };

  const feelsLikeRain = (code: number) => {
    return (
      (code >= 200 && code < 300) ||
      (code >= 300 && code < 400) ||
      (code >= 500 && code < 599)
    );
  };

  const targets = () => {
    return raining?.map((target) => {
      return target.companies.map((tar, index) => {
        let customer = customers?.find((cust) => cust.id === tar);
        generateTimeDetails(target.times);
        return (
          <div key={index} className={styles.card}>
            <div className={styles.customerDetails}>
              <p><span>Customer:</span> {customer?.name}</p>
              <p><span>Person of Contact:</span> {customer?.personOfContact}</p>
              <p><span>Phone:</span> {customer?.phoneNumber}</p>
            </div>
            {generateTimeDetails(target.times)}
          </div>
        );
      });
    });
  };

  const generateTimeDetails = (times: string[]) => {
    let days: string[] = [];
    let dayAndTimes: { day: string; times: string[] }[] = [];

    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      let day = time.slice(0, time.indexOf(" "));
      if (!days.includes(day)) days.push(day);
    }

    days.forEach((day) => {
      let dayTime: { day: string; times: string[] } = { day: day, times: [] };

      times.forEach((time) => {
        let timeString = time.slice(time.indexOf(" "));
        if (time.includes(day) && timeString) dayTime.times.push(timeString);
      });

      dayAndTimes.push(dayTime);
    });

    return (
      <div className={styles.daysAndTimes}>
        {dayAndTimes.map((day) => {
          return (
            <div>
            <details>
              <summary>{day.day}</summary>
              {day.times.map((time) => {
                return <p>{time}</p>;
              })}
            </details>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return <div className={styles.main}>{targets()}</div>;
};

export default Raining;
