import React from "react";
import '../css/SearchBarKenan.css'

export default function SearchBar({ apiFunction }) {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search" onChange={apiFunction} />
        </div>
    )
}