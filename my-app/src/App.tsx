import React from 'react';
import logo from './logo.svg';
import { useState, useEffect } from "react";
import './index.css';
import PokemonData from './models/pokemonData';
import DisplayPokemon from './components/DisplayPokemon';
import { Trie } from "prefix-trie-ts";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import backGround from "./PokeBg.jpg"
import logopic from "./spic.png"


        
        

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

  };

  const suggestedPokemon= 
    searchText.length > 1 ? getSuggestedPokemon(searchText).slice(0,5) : [];


  const suggestedPokemonLinks= suggestedPokemon.map((pokemonName: string) => {
    return (
      <div className="first:border-0 border-t hover:underline hover:text-blue-500 cursor-pointer hover:bg-blue-50"> 
      
      <a 
        className="text-slate-700 "
        onClick={(e) => {
          e.preventDefault();
          searchForPokemon(pokemonName);
          setSearchText(pokemonName);
        }}
      >
        <div key={pokemonName} className=" border-slate-200 p-1"> 
        <span className='font-bold'>{searchText}</span> 
         {pokemonName.slice(searchText.length)}
       
      </div>
      </a>
      </div>
    );
  });


  const searchBox= (
      <div className="mx-auto">
        <form> 
      <input type="text" 
      className="border-2 border-slate-500 p-2 rounded-lg w-64 mr-4"
      placeholder="Search for a Pokemon" 
      value={searchText}
      onChange={(e) => {setSearchText(e.currentTarget.value);
            }}
      />
      
      <button onClick={onClickSearch} className= "bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  p-2 w-24 rounded-lg font-bold ">Search</button>
      </form>
      <div className="border rounded-sm w-64 mt-1">{suggestedPokemonLinks} </div>
    </div>
    );

    let displayElement = null;

   
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
      displayElement= (
      <div>
        <h3 className="text-xl underline-offset-2 text-red-800 font-bold">Pokemon not found</h3>
        {suggestedPokemonElement}
        </div>
      );
    } else if (status === AppStatus.LOADING){
      displayElement= <h1>Loading...</h1>;
    } else {
      displayElement= <h6></h6>;
    }

    const backgroundStyle= {
      backgroundImage: `url(${backGround})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      width: "100vw",
    };

    const pic= { image : `url(${logopic})`};
    return (


      <div className="flex h-screen" style= {backgroundStyle}>  


      <body>
       
        <div className="h-20 w-16  py-3 "><img src={logopic}/>  </div>
      
      </body>
      
      <div className="    m-auto max-w-lg w-full mt-6 sm:mt-20">
        
        <h1 className="text-2xl text-white font-bold text-center animate__animated animate__bounce animate__delay-2s animate__slower "> POKEDEX </h1> 
     <p className="text-slate-400 mb-8 text-center"> Search for a Pokemon below!</p>
     
      <div className="flex"> {searchBox} </div>
      <div className=" object-[center_bottom]"> {displayElement} </div> 

      
 
        
      </div>
      </div>
      

    );
  }

export default App;
