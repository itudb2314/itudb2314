import React, { useState } from 'react';
import '../css/SearchBarAbdullah.css';
import { FaSearch } from 'react-icons/fa';


export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState('');
    let isFetching = false;

    const fetchData = (value) => {
        if (isFetching) return;
        isFetching = true;
        fetch('http://localhost:5000/tournaments/teams')
            .then((res) => res.json())
            .then((data) => {
                if (value === '') {
                    setResults(data);
                    return;
                }
                const results = data.filter((team) => {
                    return (
                        value &&
                        team &&
                        team.team_name &&
                        team.team_name.toLowerCase().includes(value.toLowerCase())
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