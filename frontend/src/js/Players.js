import { SearchBar } from '../components/searchbar';
import { SearchResultsList } from '../components/searchresultslists';
import '../css/Players.css';
import React from 'react';
export default function Players() {

    const [results, setResults] = React.useState([]);

    return (
        <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            <SearchResultsList results={results} />
        </div>
    );
}
