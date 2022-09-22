import React from 'react';
import logo from './logo.svg';
import './index.css';


function App() {

  const [searchText, setSearchText]=  React.useState("");
  const GET_POKEMON_ENDPOINT= "https://pokeapi.co/api/v2/pokemon";

  const onClickSearch= async (e:any)=> {
    e.preventDefault();
    console.log(`Searching for ${searchText}`);

    // Call the pokemin endpoint
    const response = await fetch(`${GET_POKEMON_ENDPOINT}/${searchText}`); 
    console.log(response);
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
    return (
      <div className="text-2xl"> POKEDEX
      {searchBox}
        
      </div>
    );
  }

export default App;
