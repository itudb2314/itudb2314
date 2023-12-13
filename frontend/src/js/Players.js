import { SearchBar } from '../components/searchbar';
import { SearchResultsList } from '../components/searchresultslists';
import '../css/Players.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSort, FaFilter } from 'react-icons/fa';

export default function Players() {
    const history = useHistory();
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [results, setResults] = useState([]);
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({
        given_name: '',
        family_name: '',
    });
    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({
        female: 'all',
        goal_keeper: 'all',
        defender: 'all',
        midfielder: 'all',
        forward: 'all',
    });

    let isFetching = false;

    useEffect(() => {
        fetchPlayers();
    }, [offset]);

    useEffect(() => {
        resetState();
        fetchPlayers();
    }, [filters]);

    const resetState = () => {
        setPlayers([]);
        setOffset(0);
    };

    const handleFilterClick = () => {
        setShowFilter(!showFilter);
    };

    const handleSortClick = () => {
        setShowSort(!showSort);
    };

    const fetchPlayers = async () => {
        if (isFetching) return;
        isFetching = true;
        try {
            const { female, goal_keeper, defender, midfielder, forward } = filters;

            const response = await fetch(`http://localhost:5000/playerspaginated?page=${offset}&items_per_page=22&female=${female}&goal_keeper=${goal_keeper}&defender=${defender}&midfielder=${midfielder}&forward=${forward}`);

            if (!response.ok) {
                throw new Error('Failed to fetch players');
            }
            const data = await response.json();
            setPlayers(prev => (Array.isArray(data) ? [...prev, ...data] : prev));
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };


    useEffect(() => {
        const handleScroll = (e) => {
            const scrollHeight = e.target.documentElement.scrollHeight;
            const currentHeight = e.target.documentElement.scrollTop + window.innerHeight;
            if (currentHeight + 1 >= scrollHeight) {
                setOffset(offset + 1);
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [offset])


    const handlePlayerClick = (player) => {
        history.push(`/players/${player.player_id}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlayer((prevPlayer) => ({ ...prevPlayer, [name]: value }));
    };

    const handleAddPlayer = async () => {
        try {
            const response = await fetch('http://localhost:5000/players', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPlayer: { ...newPlayer, player_id: null } }),
            });

            if (!response.ok) {
                throw new Error('Failed to add player');
            }
            fetchPlayers();
        } catch (error) {
            console.error('Error adding player:', error);
        }
    };

    return (
        <div>
            <div className="mycontainer">
                <div className="search-bar-container">
                    <SearchBar setResults={setResults} />
                    <SearchResultsList results={results} />
                </div>

                <div className="icons-container">
                    <div className='filter-icon-container'>
                        <div className="filter-icon" onClick={handleFilterClick}>
                            <FaFilter size={30} />
                        </div>

                        {showFilter && (
                            <div className="filter-container">
                                <h2>Filter by:</h2>
                                <label>Female:</label>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="female"
                                            value="all"
                                            checked={filters.female === 'all'}
                                            onChange={() => setFilters({ ...filters, female: 'all' })}
                                        />
                                        All
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="female"
                                            value="1"
                                            checked={filters.female === '1'}
                                            onChange={() => setFilters({ ...filters, female: '1' })}
                                        />
                                        True
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="female"
                                            value="0"
                                            checked={filters.female === '0'}
                                            onChange={() => setFilters({ ...filters, female: '0' })}
                                        />
                                        False
                                    </label>
                                </div>

                                <label>Goal Keeper:</label>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="goal_keeper"
                                            value="all"
                                            checked={filters.goal_keeper === 'all'}
                                            onChange={() => setFilters({ ...filters, goal_keeper: 'all' })}
                                        />
                                        All
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="goal_keeper"
                                            value="1"
                                            checked={filters.goal_keeper === '1'}
                                            onChange={() => setFilters({ ...filters, goal_keeper: '1' })}
                                        />
                                        True
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="goal_keeper"
                                            value="0"
                                            checked={filters.goal_keeper === '0'}
                                            onChange={() => setFilters({ ...filters, goal_keeper: '0' })}
                                        />
                                        False
                                    </label>
                                </div>

                                <label>Defender:</label>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="defender"
                                            value="all"
                                            checked={filters.defender === 'all'}
                                            onChange={() => setFilters({ ...filters, defender: 'all' })}
                                        />
                                        All
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="defender"
                                            value="1"
                                            checked={filters.defender === '1'}
                                            onChange={() => setFilters({ ...filters, defender: '1' })}
                                        />
                                        True
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="defender"
                                            value="0"
                                            checked={filters.defender === '0'}
                                            onChange={() => setFilters({ ...filters, defender: '0' })}
                                        />
                                        False
                                    </label>
                                </div>

                                <label>Midfielder:</label>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="midfielder"
                                            value="all"
                                            checked={filters.midfielder === 'all'}
                                            onChange={() => setFilters({ ...filters, midfielder: 'all' })}
                                        />
                                        All
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="midfielder"
                                            value="1"
                                            checked={filters.midfielder === '1'}
                                            onChange={() => setFilters({ ...filters, midfielder: '1' })}
                                        />
                                        True
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="midfielder"
                                            value="0"
                                            checked={filters.midfielder === '0'}
                                            onChange={() => setFilters({ ...filters, midfielder: '0' })}
                                        />
                                        False
                                    </label>
                                </div>

                                <label>Forward:</label>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="forward"
                                            value="all"
                                            checked={filters.forward === 'all'}
                                            onChange={() => setFilters({ ...filters, forward: 'all' })}
                                        />
                                        All
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="forward"
                                            value="1"
                                            checked={filters.forward === '1'}
                                            onChange={() => setFilters({ ...filters, forward: '1' })}
                                        />
                                        True
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="forward"
                                            value="0"
                                            checked={filters.forward === '0'}
                                            onChange={() => setFilters({ ...filters, forward: '0' })}
                                        />
                                        False
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="sort-icon-container">
                        <div className="sort-icon" onClick={handleSortClick}>
                            <FaSort size={35} />
                        </div>

                        {showSort && (
                            <div className="sort-container">
                                {/* Add your sorting contents here */}
                                {/* For example, you can use buttons, dropdowns, etc. */}
                                {/* Update your fetchPlayers function to include sorting parameters */}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <h1 style={{ alignSelf: 'center', padding: '2rem 0 0 2rem' }}>Players</h1>

            <div className="pplayers-list">
                {
                    players.map((player) => (
                        <div key={player.player_id} className="pplayer">
                            <div className="pplayer-details">
                                <div className="pplayer-name" onClick={() => handlePlayerClick(player)} style={{ cursor: 'pointer' }}>
                                    {player.given_name !== "not applicable" && (
                                        <span>{player.given_name}</span>
                                    )}
                                    {player.given_name !== "not applicable" && player.family_name !== "not applicable" && (
                                        <span>&nbsp;</span>
                                    )}
                                    {player.family_name !== "not applicable" && (
                                        <span>{player.family_name}</span>
                                    )}
                                </div>
                                <p>Birth Date: {new Date(player.birth_date).toLocaleDateString()}</p>
                                <p>Female: {player.female ? 'Yes' : 'No'}</p>
                                <p>Goal Keeper: {player.goal_keeper ? 'Yes' : 'No'}</p>
                                <p>Defender: {player.defender ? 'Yes' : 'No'}</p>
                                <p>Midfielder: {player.midfielder ? 'Yes' : 'No'}</p>
                                <p>Forward: {player.forward ? 'Yes' : 'No'}</p>
                                <p>Tournaments Count: {player.count_tournaments}</p>
                                <p>Tournaments List: {player.list_tournaments}</p>
                                <p><a href={player.player_wikipedia_link}> Wikipedia Link</a> </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    );
}
