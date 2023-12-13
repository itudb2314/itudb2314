import React from "react";
import '../css/SearchBar.css'

export default function SearchBar({apiFunction}) {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search" onChange={apiFunction}/>
        </div>
    )
}