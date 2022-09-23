import React from "react";
import PokemonData from "../models/pokemonData";


const DisplayPokemon: React.FC<PokemonData> = (props) => {
    return (
        <div>
            <h1>{props.name}</h1>
            <img src={props.sprites.front_default} alt={props.name} />
    
        </div>
    )
}

export default DisplayPokemon;