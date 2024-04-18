import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CloudIcon from "@mui/icons-material/Cloud";
import { Typography } from "@mui/material";

import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar";
moment.locale("ar");

let cancelAxios = null;
export const WheatherApp = () => {
  //  STATES  //
  const [locale, setLocale] = useState("ar");
  const [name, setName] = useState("");
  const [weatherDate, setWeatherDate] = useState({
    date: "",
    time: "",
  });
  const [temp, setTemp] = useState({
    number: null,
    min: null,
    max: null,
    description: "",
    icon: null,
  });
  // == STATES ==//

  const { t, i18n } = useTranslation();
  const direction = locale == "ar" ? "rtl" : "ltr";

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [i18n, locale]);

  useEffect(() => {
    setWeatherDate((prevWeatherDate) => ({
      ...prevWeatherDate,
      date: moment().format("MMM Do YY"),
    }));
    const intervalId = setInterval(() => {
      setWeatherDate((prevWeatherDate) => ({
        ...prevWeatherDate,
        time: moment().format("LT"),
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLangChange = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    moment.locale(newLocale);
    setWeatherDate({
      ...weatherDate,
      date: moment().format("MMMM Do YYYY"),
    });
  };

  useEffect(() => {
    // Make a request for weather data
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.03&lon=31.38&appid=4c04b33b15c913932b2372745612be36",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((response) => {
        const name = response.data.name;
        const number = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const icon = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
        setTemp({
          ...temp,
          number: number,
          min: min,
          max: max,
          description: description,
          icon: icon,
        });

        setName(name);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled:", error.message);
        } else {
          console.error("Error fetching weather data:", error);
        }
      });

    // Cleanup function to cancel the request when the component unmounts
    return () => {
      cancelAxios("Component unmounted");
    };
  }, []);

  return (
    <>
      <div
        className="flex flex-col justify-center items-center h-screen"
        dir={direction}
      >
        <div>
          <Typography
            variant="h2"
            style={{
              fontWeight: "400",
              textAlign: "center",
              color: "white",
              position: "relative",
              top: "-30px",
            }}
          >
            {weatherDate.time}
          </Typography>
        </div>
        <div className="w-full p-5 shadow-lg text-white bg-blue-900 rounded-lg">
          {/* card header */}
          <div className="flex flex-col items-center md:items-end md:flex-row gap-3 mb-3">
            <Typography
              variant="h3"
              style={{
                fontWeight: "400",
              }}
            >
              {t(name)}
            </Typography>
            <Typography variant="h5">{weatherDate.date}</Typography>
          </div>
          {/* == card header == */}
          <hr />
          {/* CONTAINER OF DEGREE + CLOUD ICON */}
          <div className=" flex flex-col items-center md:flex-row justify-between">
            {/*  DEGREE & DESCRIPTION */}
            <div>
              {/* TEMP */}
              <div className="flex items-center gap-1 md:gap-5">
                <Typography variant="h1">{t(temp.number)}</Typography>
                <img src={temp.icon} alt="icon" />
              </div>
              {/* == TEMP == */}
              <Typography
                variant="h6"
                style={{ margin: "0 0 20px", textAlign: "center" }}
              >
                {t(temp.description)}
              </Typography>
              {/* MIN & MAX */}
              <div className="flex justify-between items-center">
                <h5>
                  {t("min")}: {temp.min}
                </h5>
                <h5>|</h5>
                <h5>
                  {t("max")}: {temp.max}
                </h5>
              </div>
              {/* == MIN & MAX == */}
            </div>
            {/* ==  DEGREE & DESCRIPTION == */}
            {/* Cloud image */}
            <CloudIcon style={{ fontSize: "200px" }} />
            {/* === Cloud image === */}
          </div>
          {/* == CONTAINER OF DEGREE + CLOUD ICON == */}
        </div>
        {/* TRANSLATION CONTAINER */}
        <div className=" w-full text-left mt-2">
          <Button
            style={{ color: "white", textTransform: "capitalize" }}
            onClick={handleLangChange}
          >
            {locale == "en" ? "Arabic" : "انجليزي"}
          </Button>
        </div>
        {/* == TRANSLATION CONTAINER == */}
      </div>
    </>
  );
};
