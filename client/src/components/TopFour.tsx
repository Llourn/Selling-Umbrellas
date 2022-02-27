import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Customer } from "../types";
import { WEATHER_API_KEY } from "../config";

type Props = {};

const TopFour = (props: Props) => {
  const [topFourCustomers, setTopFourCustomers] = useState<Customer[]>([]);
  const [willRain, setWillRain] = useState<Boolean[]>([]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
        text: "",
      },
    },
  };

  const labels = topFourCustomers?.map((cust) => {
    return cust.name;
  });

  const bgColors = () => {
    let colors: string[] = [];
    topFourCustomers.forEach((customer, index) => {
      let color = willRain[index] ? "green" : "red";
      colors.push(color);
    });
    return colors;
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Number of Employees",
        data: topFourCustomers.map((cust) => {
          return cust.numberOfEmployees;
        }),
        backgroundColor: bgColors(),
      },
    ],
  };

  const getCustomers = async () => {
    const response = await fetch("http://localhost:5000/topfour/");
    const data = (await response.json()) as Customer[];
    setTopFourCustomers(data);
  };

  const testing = () => {
    let urls: string[] = [];
    topFourCustomers.forEach((cust) => {
      let location = { lat: cust.lat, lon: cust.lon };
      urls.push(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${WEATHER_API_KEY}`
      );
    });
    
    
    let isRaining: boolean[] = [false, false, false, false];
    Promise.all(urls.map((url) => fetch(url).then((res) => res.json()))).then(
      (values) => {
        values.forEach((data, index) => {
          //@ts-ignore
          isRaining[index] = confirmRain(data.list);
        });
        setWillRain(isRaining);
      }
    );
  };

  const confirmRain = (times: any) => {
    let willRain = false;
    //@ts-ignore
    times.every((time) => {
      willRain = feelsLikeRain(time.weather[0].id);
      return !willRain;
    });

    return willRain;
  };

  const feelsLikeRain = (code: number) => {
    return (
      (code >= 200 && code < 300) ||
      (code >= 300 && code < 400) ||
      (code >= 500 && code < 599)
    );
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (topFourCustomers.length > 0) testing();
  }, [topFourCustomers]);

  return (
    <div>
      <p>Top Four</p>
      <Bar options={options} data={data} />
    </div>
  );
};

export default TopFour;
