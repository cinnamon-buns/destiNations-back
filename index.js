const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 4000;

const rawAirports = require("./Data/Airports/airports.json");
const countriesList = require("./Data/countryinfo.json");

const dotenv = require("dotenv");
dotenv.config();

let tMinus2 = new Date();
let tMinus4 = new Date();

tMinus2.setHours(tMinus2.getHours() - 24);
tMinus4.setHours(tMinus4.getHours() - 26);



const end = Math.floor(tMinus2.getTime() / 1000);
const begin = Math.floor(tMinus4.getTime() / 1000);


const limitCountries = [
  "EG",
  "US",
  "DE",
  "GR",
  "FR",
  "CN",
  "BR",
  "GB",
  "AU",
  "CA",
  "RU",
  "JP",
  "TR",
  "UK",
  "TH",
  "MX",
  "PH",
  "DZ",
  "AE",
  "ZA",
  "KR",
  "ES",
  "AR",
  "IN"
];
console.log(begin)
console.log(end)
app.get("/", (req, res) => {
  try {
    axios
      .get(
        `https://${process.env.OPENSKY_API_USERNAME}:${process.env.OPENSKY_API_PASSWORD}@opensky-network.org/api/flights/all?begin=${begin}&end=${end}`

      )
      .then(data => {
        const planes = data.data.filter(element => {
          return element.estDepartureAirport && element.estArrivalAirport;
        });

        // const icao = Object.keys(rawAirports)
        toFrom = [];
        planes.forEach(plane => {
          aircraft = {};

          // If we have both the Departure and Arrival
          if (
            rawAirports[plane.estArrivalAirport] &&
            rawAirports[plane.estDepartureAirport]
          ) {
            // if the Departure and Arrival country are not the same
            if (
              rawAirports[plane.estArrivalAirport].country !==
              rawAirports[plane.estDepartureAirport].country
            ) {
              const countryInfoTo = {};
              const countryInfoFrom = {};

              countriesList.forEach(country => {
                if (
                  country.alpha2Code ===
                  rawAirports[plane.estArrivalAirport].country
                ) {

                  countryInfoTo.cc = country.alpha2Code;

                  countryInfoTo.name = country.name;
                  countryInfoTo.nativeName = country.nativeName;
                  countryInfoTo.languages = country.languages;
                  countryInfoTo.jp = country.translations.ja;
                  countryInfoTo.flag = country.flag;

                  countryInfoTo.cc = country.alpha2Code;

                }

                if (
                  country.alpha2Code ===
                  rawAirports[plane.estDepartureAirport].country
                ) {

                  countryInfoFrom.cc = country.alpha2Code;

                  countryInfoFrom.name = country.name;
                  countryInfoFrom.nativeName = country.nativeName;
                  countryInfoFrom.languages = country.languages;
                  countryInfoFrom.jp = country.translations.ja;

                  countryInfoFrom.cc = country.alpha2Code;

                }
              });

              aircraft.to = {
                city: rawAirports[plane.estArrivalAirport].city,
                name: rawAirports[plane.estArrivalAirport].name,
                country: countryInfoTo
              };
              aircraft.from = {
                city: rawAirports[plane.estDepartureAirport].city,
                name: rawAirports[plane.estDepartureAirport].name,
                country: countryInfoFrom
              };

              // check if the aircraft origin and destination are on the listed airports
              if (
                limitCountries.includes(aircraft.to.country.cc) &&
                limitCountries.includes(aircraft.from.country.cc)
              ) {
                toFrom.push(aircraft);
              }
            }
          }
        });
        const result = {};
        result.data = toFrom;
        result.length = toFrom.length;
        res.send(result);

      });
  } catch (err) {
    console.log("shit ", err);
  }
});

app.get("/plane", (req, res) => {
  // https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444
  let result;
  try {

    axios
      .get("https://rafael:sharck@opensky-network.org/api/states/all")
      .then(data => {
        res.send(data.data);
      });

  } catch (err) {
    console.log("shit ", err);
  }

  // res.send('working')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
