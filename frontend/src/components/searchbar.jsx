import React, { useState } from 'react';
import '../css/SearchBarAbdullah.css';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState('');
    let isFetching = false;

    const fetchData = (value) => {
        if (isFetching) return;
        isFetching = true;
        fetch('http://localhost:5000/players')
            .then((res) => res.json())
            .then((data) => {
                const results = data.filter((player) => {
                    return (
                        value &&
                        player &&
                        player.given_name &&
                        player.given_name.toLowerCase().includes(value.toLowerCase())
                    );
                });
                setResults(results);
            });
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className='input-wrapper'>
            <FaSearch id='search-icon' />
            <input type="text" placeholder="Search" value={input} onChange={(e) => handleChange(e.target.value)} />
        </div>
    );
}