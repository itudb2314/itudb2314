import React, { useState } from 'react';
import '../css/SearchBarAbdullah.css';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState('');
    let isFetching = false;

    const fetchData = (value) => {
        if (isFetching) return;
        isFetching = true;
        fetch(`http://localhost:5000/players/${value}`)
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
                console.log(data);
            });
    };

    const handleChange = (value) => {
        if(value.replace(' ', '') === '') {
            setInput('')
            setResults([]);
            return
        }
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