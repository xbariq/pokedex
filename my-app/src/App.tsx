import React from 'react';
import logo from './logo.svg';
import { useState, useEffect } from "react";
import './index.css';
import PokemonData from './models/pokemonData';
import DisplayPokemon from './components/DisplayPokemon';
import { Trie } from "prefix-trie-ts";


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
  const [pokemonSearchTrie, setPokemonSearchTrie] = React.useState<Trie>();

  const getAllPokemon = async () => {
    const cachedPokemonString = localStorage.getItem(LIST_POKEMON_CACHE_KEY);
    let allPokemon=null;

    if (!cachedPokemonString) {
      const response = await fetch(LISR_POKEMONT_ENDPOINT);
      const data = await response.json();
      allPokemon= data.results;
      localStorage.setItem(LIST_POKEMON_CACHE_KEY,  JSON.stringify(data.results));
      console.log(`Cached ${data.results.length} pokemon`);

    } else {
      allPokemon = JSON.parse(cachedPokemonString);
      console.log(`Using cached pokemon`);
    }

    //List of all pokemon names.
    const pokemonNames = allPokemon.map((pokemon: any) => pokemon.name);
    const trie = new Trie(pokemonNames);
    console.log(`Created trie with ${pokemonNames.length} pokemon`);
    setPokemonSearchTrie(trie);

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

  const getSuggestedPokemon = (searchText: string) => {
    if (pokemonSearchTrie) {
      const suggestedPokemon = pokemonSearchTrie.getPrefix(searchText);
      return suggestedPokemon;
    }
    return [];
  
  };


  const onClickSearch= async (e:any)=> {
    e.preventDefault();
    await searchForPokemon(searchText);
   

  };


  const searchForPokemon= async (searchText:string) => {
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

  }

  const searchBox= (
      <div>
        <form> 
      <input type="text" 
      placeholder="Search for a Pokemon" 
      value={searchText}
      onChange={(e) => {setSearchText(e.currentTarget.value);
            }}
      />
      <button onClick={onClickSearch}>Search</button>
      </form>
    </div>
    );

    let displayElement = null;

    const suggestedPokemon= 
      searchText.length > 1 ? getSuggestedPokemon(searchText).slice(0,5) : [];
    
    const suggestedPokemonLinks= suggestedPokemon.map((pokemonName: string) => {
      return (
        <div key={pokemonName}> 
        <a onClick={(e) => {
          e.preventDefault();
          searchForPokemon(pokemonName);
          setSearchText(pokemonName);
        }}>
          {pokemonName}
        </a>
        </div>
      );
    });

    const suggestedPokemonElement= 
      suggestedPokemon.length > 0 ? (
        <div>
          <h6 className='text-lg font-bold'>Did you mean: </h6>
          {suggestedPokemonLinks}
        </div>
      ) : null;


    


    if (status === AppStatus.SUCCESS && pokemontData){
      displayElement = <DisplayPokemon {...pokemontData} />;
    } else if (status ===AppStatus.NOT_FOUND){
      displayElement= (<div>
        <h3 className="text-xl underline-offset-2 text-yellow-500 font-bold">Pokemon not found</h3>
        {suggestedPokemonElement} 
        </div>
      );
    } else if (status === AppStatus.LOADING){
      displayElement= <h1>Loading...</h1>;
    } else {
      displayElement= <h6>Search for a Pokemon</h6>;
    }


    return (
      <div> POKEDEX
      {searchBox}
      
      {displayElement}
        
      </div>
    );
  }

export default App;
