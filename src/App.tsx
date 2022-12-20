import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Country } from './model/Country';
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';

function App() {
  const [countries, setCountries] = useState<Country[]>();
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  const [searchText, setSearchText] = useState<string>("");
  const [continent, setContinent] = useState<string>("");

  useEffect(() => {
    axios.get('http://localhost:8080/countries').then((response) => setCountries(response.data));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/countries?searchText=' + searchText + '&continent=' + continent).then((response) => setCountries(response.data));
  }, [searchText, continent]);

  const onCountryClicked = (id: number) => {
    axios.get('http://localhost:8080/countries/' + id).then((response) => setSelectedCountry(response.data));
  }

  const clearSelectedCountry = () => {
    setSelectedCountry(undefined);
  }

  const getCountryFlagUrl = (name: string): string => {
    return "https://www.geonames.org/flags/x/" + name.substring(0, 2).toLowerCase() + ".gif";
  }

  return (
    <Box className="App" sx={{ backgroundColor: 'lightgray', height: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ width: 1, display: "flex" }}>
        <img src='https://fasttrackit.org/wp-content/uploads/2020/08/fasttrackit.png'></img>
        <Box sx={{ flexGrow: 1 }}></Box>
        <FormControl sx={{ margin: 1 }}>
          <InputLabel>Continent</InputLabel>
          <Select
            value={continent}
            label="Continent"
            onChange={(e) => setContinent(e.target.value)}
          >
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Oceania">Oceania</MenuItem>
            <MenuItem value="Asia">Asia</MenuItem>
          </Select>
        </FormControl>
        <TextField sx={{ margin: 1, mr: 2 }} label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)}></TextField>
      </Box>
      {selectedCountry && <Card sx={{ margin: 2, overflow: "unset" }}>
        <Button onClick={() => clearSelectedCountry()}>Close</Button>
        <Typography fontSize="small">Population: {selectedCountry.population}</Typography>
        <Typography fontSize="small">Area: {selectedCountry.area}</Typography>
        <Typography fontSize="small">Continent: {selectedCountry.continent}</Typography>
        <img src={getCountryFlagUrl(selectedCountry.name)}></img>
      </Card>}
      <Box sx={{ overflow: "auto" }}>
        {countries?.map(country =>
          <Card sx={{ margin: 2, cursor: "pointer" }} onClick={() => onCountryClicked(country.id)}>
            <CardContent>
              {country.name}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default App;
