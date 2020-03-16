const express = require("express");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 4000;
const rawAirports = require("./Data/Airports/airports.json");
const countriesList = require("./Data/countryinfo.json");

const helloList = require("./Data/hello.json"); //add helloList
const animals = require("./Data/countryAnimals.json")
const dotenv = require("dotenv");
dotenv.config();
let tMinus2  = new Date();
let tMinus4 = new Date();

tMinus2.setHours(tMinus2.getHours() - 20);
tMinus4.setHours(tMinus4.getHours() - 22);

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
  // https://opensky-network.org/api/states/all?time=1458564121&icao24=3c6444
    async function getData() {
      const countries  = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/all?begin=${begin}&end=${end}`
      ).then(data => data.data)
      const brazil = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=SBGR&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const australia = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=YSSY&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const russia = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=UUEE&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const thailand = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=VTBD&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const philippines = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=RPLL&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const argentina = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=SAEZ&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const greece = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=LGAV&begin=${begin}&end=${end}`
      ).then(data => data.data)
      const turkey = await axios
      .get(
        `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=LTAC&begin=${begin}&end=${end}`
      ).then(data => data.data)
      // const southAfrica = await axios
      // .get(
      //   `https://rafael:sharck@opensky-network.org/api/flights/arrival?airport=FAGC&begin=${begin}&end=${end}`
      // ).then(data => data.data)

        const allCountries =  countries.concat(brazil, australia, russia, thailand, philippines, argentina, greece, turkey)
      planes = allCountries
      planes.filter(element => {
        // return element.estDepartureAirport && element.estArrivalAirport;
        return element.estArrivalAirport
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
                countryInfoTo.animal = animals[country.alpha2Code]; //animal
                countryInfoTo.greeting = helloList[0][country.alpha2Code]; //add greeting
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
                countryInfoFrom.animal = animals[country.alpha2Code]; //animal
                countryInfoFrom.greeting = helloList[0][country.alpha2Code]; //add greeting
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
      res.send(result)
    }
    getData()
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));