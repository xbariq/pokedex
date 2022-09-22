import React from 'react';
import logo from './logo.svg';
import { useState, useEffect } from "react";
import './index.css';
import PokemonData from './models/pokemonData';
import DisplayPokemon from './components/DisplayPokemon';

// Create an enum for app status. 
enum AppStatus {
  IDLE,
  LOADING,
  SUCCESS,
  NOT_FOUND,
  ERROR,
}

  const GET_POKEMON_ENDPOINT= "https://pokeapi.co/api/v2/pokemon";
  const LISR_POKEMONT_ENDPOINT=
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
  
  const LIST_POKEMON_CACHE_KEY = "ALL_POKEMON";

  function App() {

  const [searchText, setSearchText]=  React.useState("");
  const [status, setStatus] = React.useState(AppStatus.IDLE);
  const [pokemontData, setPokemonData]= React.useState<PokemonData>();

  const getAllPokemon = async () => {
    const cachedPokemon = localStorage.getItem(LIST_POKEMON_CACHE_KEY);
    if (!cachedPokemon) {
      const response = await fetch(LISR_POKEMONT_ENDPOINT);
      const data = await response.json();
      localStorage.setItem(LIST_POKEMON_CACHE_KEY,  JSON.stringify(data.results));
      console.log(`Cached ${data.results.length} pokemon`);
    } else {
      console.log(`Using cached pokemon`);
    }

  };
  useEffect(() => {
    getAllPokemon();
  }, []);


  

  const getPokemonDataFromApi=async (pokemonName:string) => {
    //call pokemon endpoint
   const response = await fetch(`${GET_POKEMON_ENDPOINT}/${pokemonName}`); 
   console.log(response);
   if (response.status === 200) {
     const data = await response.json();
     console.log(data);
     setPokemonData(data);
     setStatus(AppStatus.SUCCESS);

     // Save Pokemon data to local storage.
     localStorage.setItem(searchText, JSON.stringify(data));
     
   } else if (response.status === 404) {
     console.log("Pokemon not found");
     setStatus(AppStatus.NOT_FOUND);
   }
  };


  const onClickSearch= async (e:any)=> {
    e.preventDefault();
    const searchTextLower= searchText.toLowerCase();
    console.log(`Searching for ${searchTextLower}`);
    setStatus(AppStatus.LOADING);

    //Check if pokemon data is in local storage. 
    const pokemonDataFromLocalStorage = localStorage.getItem(searchTextLower);
    if (pokemonDataFromLocalStorage) { 
      console.log("Pokemon data found in local storage");
      setPokemonData(JSON.parse(pokemonDataFromLocalStorage));
      setStatus(AppStatus.SUCCESS);
    } else {
      console.log("Pokemon data not found in local storage");
      await getPokemonDataFromApi(searchTextLower);

    }
  };

  const searchBox= (
      <div>
        <form> 
      <input type="text" placeholder="Search for a Pokemon" onChange={(e) => {setSearchText(e.currentTarget.value);
            }}/>
      <button onClick={onClickSearch}>Search</button>
      </form>
    </div>
    );

    let displayElement = null;
    if (status === AppStatus.SUCCESS && pokemontData){
      displayElement = <DisplayPokemon {...pokemontData} />;
    } else if (status ===AppStatus.NOT_FOUND){
      displayElement= <h1>Pokemon not found</h1>;
    } else if (status === AppStatus.LOADING){
      displayElement= <h1>Loading...</h1>;
    } else {
      displayElement= <h1>Search for a Pokemon</h1>;
    }


    return (
      <div className="text-2xl"> POKEDEX
      {searchBox}
      
      {displayElement}
        
      </div>
    );
  }

export default App;
