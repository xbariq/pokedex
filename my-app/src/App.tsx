import React from 'react';
import logo from './logo.svg';
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
function App() {

  const [searchText, setSearchText]=  React.useState("");
  const [status, setStatus] = React.useState(AppStatus.IDLE);
  const [pokemontData, setPokemonData]= React.useState<PokemonData>();


  const GET_POKEMON_ENDPOINT= "https://pokeapi.co/api/v2/pokemon";


  const onClickSearch= async (e:any)=> {
    e.preventDefault();
    console.log(`Searching for ${searchText}`);
    setStatus(AppStatus.LOADING);

    // Call the pokemin endpoint
    const response = await fetch(`${GET_POKEMON_ENDPOINT}/${searchText}`); 
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setPokemonData(data);
      setStatus(AppStatus.SUCCESS);
    } else if (response.status === 404) {
      console.log("Pokemon not found");
      setStatus(AppStatus.NOT_FOUND);
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
