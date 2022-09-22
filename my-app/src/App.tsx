import React from 'react';
import logo from './logo.svg';
import './index.css';

function App() {

  const [searchText, setSearchText]=  React.useState(null);
  const GET_POKEMON_ENDPOINT= "https://pokeapi.co/api/v2/";

  const onClickSearch= (e:any)=>{
    e.preventDefault();
    console.log("Searching for Pokemon...")



    // Call the pokemin endpoint


  }

  const searchBox= (
     <div>
      <form> 
    <input type="text" placeholder='Search for a Pokemon'/>
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
