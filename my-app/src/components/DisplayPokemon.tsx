import React from "react";
import PokemonData from "../models/pokemonData";


const DisplayPokemon: React.FC<PokemonData> = (props) => {
    return (

        <div className="static"> 
        <div className=" static mt-8 content-center">
           
            <div className=" static bg-white border-black border-2 rounded-xl
      p-4 text-black">   
      
       <h1 className=" static content-center text-3xl m-8">{props.name}</h1>
         <div className="   animate__animated animate__pulse absolute scale-150 px-10  resize-rd bg-gradient-to-r from-indigo-500 via-purple-500 to-transperent rounded-3xl border border-b-slate-700 drop-shadow-2xl"><img src={props.sprites.front_default} alt={props.name} /> 
 </div>
            </div>
            
        </div>
        </div>
    )
}

export default DisplayPokemon;