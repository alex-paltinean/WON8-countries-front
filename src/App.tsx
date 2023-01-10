import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Country } from './model/Country';
import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from '@mui/material';
import LearnEditForm from './components/LearnEditForm';
import EditForm from './components/EditForm';
import AddCityForm from './components/AddCityForm';


function App() {
  const [page, setPage] = useState(1);
  const [countries, setCountries] = useState<Country[]>();
  const [selectedCountry, setSelectedCountry] = useState<Country>();
  const [searchText, setSearchText] = useState<string>("");
  const [continent, setContinent] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:8080/countries').then((response) => setCountries(response.data));
  }, []);

  const reloadCountries = () => {
    axios.get('http://localhost:8080/countries?searchText=' + searchText + (continent ? '&continent=' + continent : "")).then((response) => setCountries(response.data));
  }

  useEffect(() => {
    reloadCountries();
    setPage(1);
    setSelectedCountry(undefined);
  }, [searchText, continent]);

  useEffect(() => {
    if (countries && Math.ceil(countries.length / 10) < page) {
      setPage(page - 1);
    }
  }, [countries]);

  const onCountryClicked = (id: number) => {
    axios.get('http://localhost:8080/countries/' + id).then((response) => setSelectedCountry(response.data));
  }

  const reloadSelectedCountry = () => {
    selectedCountry && onCountryClicked(selectedCountry.id);
  }

  const deleteCountry = (id: number) => {
    axios.delete('http://localhost:8080/countries/' + id).then((response) => {
      setSelectedCountry(undefined);
      reloadCountries()
    });
  }

  const clearSelectedCountry = () => {
    setSelectedCountry(undefined);
  }

  const getCountryFlagUrl = (name: string): string => {
    return "https://www.geonames.org/flags/x/" + name.substring(0, 2).toLowerCase() + ".gif";
  }

  const fromChild = (text: string) => {
    console.log("something from child " + text);
  }

  const closeEditForm = (reload: boolean) => {
    setSelectedCountry(undefined);
    if (reload) {
      reloadCountries();
    }
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }

  return (
    <Box className="App" sx={{ backgroundColor: 'lightgray', height: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ width: 1, display: "flex" }}>
        <img src='https://fasttrackit.org/wp-content/uploads/2020/08/fasttrackit.png'></img>
        <Box sx={{ flexGrow: 1 }}></Box>
        <FormControl sx={{ margin: 1, width: '120px' }}>
          <InputLabel>Continent</InputLabel>
          <Select
            value={continent}
            label="Continent"
            onChange={(e) => setContinent(e.target.value)}
          >
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Oceania">Oceania</MenuItem>
            <MenuItem value="Asia">Asia</MenuItem>
            <MenuItem value="Africa">Africa</MenuItem>
            <MenuItem value="Americas">Americas</MenuItem>
            <MenuItem value="Antarctica">Antarctica</MenuItem>
          </Select>
        </FormControl>
        <TextField sx={{ margin: 1, mr: 2 }} label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)}></TextField>
      </Box>
      {/* <LearnEditForm text='first' callParent={fromChild}></LearnEditForm> */}
      {/* <LearnEditForm text='second' callParent={fromChild}></LearnEditForm> */}
      {selectedCountry &&
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card sx={{ margin: 2, overflow: "unset" }}>
              <Button onClick={() => clearSelectedCountry()}>Close</Button>
              <Button sx={{ color: "red" }} onClick={() => deleteCountry(selectedCountry.id)}>Delete</Button>
              <Typography fontSize="small">Population: {selectedCountry.population}</Typography>
              <Typography fontSize="small">Area: {selectedCountry.area}</Typography>
              <Typography fontSize="small">Continent: {selectedCountry.continent}</Typography>
              <Typography fontSize="small">Number of cities: {selectedCountry.cities.length}</Typography>
              <img width="500px" src={getCountryFlagUrl(selectedCountry.name)}></img>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ margin: 2 }}>
              <EditForm closeEditForm={closeEditForm} selectedCountry={selectedCountry} reloadCountry={reloadSelectedCountry}></EditForm>
              <Card sx={{ mt: 2 }}>
                <CardContent>Adding Cities
                  <AddCityForm reloadCountry={reloadSelectedCountry} country={selectedCountry}></AddCityForm>
                  {selectedCountry.cities.map(city => <Typography>{city.name}</Typography>)}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>}

      <Pagination onChange={handlePageChange} count={countries ? Math.ceil(countries.length / 10) : 0} page={page}></Pagination>
      <Box sx={{ overflow: "auto" }}>
        {countries?.slice((page - 1) * 10, page * 10).map(country =>
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
