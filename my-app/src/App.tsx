import React from 'react';
import logo from './logo.svg';
import './index.css';
import PokemonData from './models/pokemonData';
import DisplayPokemon from './components/DisplayPokemon';


function App() {

  const [searchText, setSearchText]=  React.useState("");
  const GET_POKEMON_ENDPOINT= "https://pokeapi.co/api/v2/pokemon";
  const [pokemontData, setPokemonData]= React.useState<PokemonData>();

  const onClickSearch= async (e:any)=> {
    e.preventDefault();
    console.log(`Searching for ${searchText}`);

    // Call the pokemin endpoint
    const response = await fetch(`${GET_POKEMON_ENDPOINT}/${searchText}`); 
    console.log(response);
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setPokemonData(data);
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
    const displayElement = pokemontData ?(
      <DisplayPokemon {...pokemontData} />
    ) : null;
    return (
      <div className="text-2xl"> POKEDEX
      {searchBox}
      
      {displayElement}
        
      </div>
    );
  }

export default App;
