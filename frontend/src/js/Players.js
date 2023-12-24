import { SearchBar } from '../components/searchbar';
import { SearchResultsList } from '../components/searchresultslists';
import '../css/Players.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaSort, FaFilter } from 'react-icons/fa';
import { BiSolidUpArrow } from "react-icons/bi";

export default function Players() {
    const history = useHistory();
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [results, setResults] = useState([]);
    const [players, setPlayers] = useState([]);
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setShowFilter(false);
        setShowSort(false);
        setModalVisible(!modalVisible);
    };

    const [offset, setOffset] = useState(0);
    const [filters, setFilters] = useState({
        female: 'all',
        goal_keeper: 'all',
        defender: 'all',
        midfielder: 'all',
        forward: 'all',
    });
    const [sortField, setSortField] = useState(
        'neither'
    );
    const [sortOrder, setSortOrder] = useState(
        'neither'
    );

    let isFetching = false;

    useEffect(() => {
        fetchPlayers();
    }, [offset]);

    useEffect(() => {
        resetState();
        fetchPlayers();
    }, [filters, sortField, sortOrder]);

    const resetState = () => {
        setPlayers([]);
        setOffset(0);
    };

    const handleFilterClick = () => {
        setShowSort(false);
        setShowFilter(!showFilter);
    };

    const handleSortClick = () => {
        setShowFilter(false);
        setShowSort(!showSort);
    };

    const fetchPlayers = async () => {
        if (isFetching) return;
        isFetching = true;
        try {
            const { female, goal_keeper, defender, midfielder, forward } = filters;

            const sortParams = sortField && sortOrder ? `&sortField=${sortField}&sortOrder=${sortOrder}` : '';
            const response = await fetch(`http://localhost:5000/playerspaginated?page=${offset}&items_per_page=22&female=${female}&goal_keeper=${goal_keeper}&defender=${defender}&midfielder=${midfielder}&forward=${forward}${sortParams}`);

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

    function handleAddPlayer(e) {
        e.preventDefault();
        const player_id = e.target.player_id.value;
        const given_name = e.target.given_name.value;
        const family_name = e.target.family_name.value;
        const birth_date = e.target.birth_date.value;
        const female = e.target.elements.female.checked;
        const goal_keeper = e.target.elements.goal_keeper.checked;
        const defender = e.target.elements.defender.checked;
        const midfielder = e.target.elements.midfielder.checked;
        const forward = e.target.elements.forward.checked;
        const player_wikipedia_link = e.target.player_wikipedia_link.value;
        const count_tournaments = e.target.count_tournaments.value;
        const list_tournaments = e.target.list_tournaments.value;


        const playerIdRegex = /^P-\d{5}$/;
        if (!playerIdRegex.test(player_id)) {
            alert('Invalid Player ID format. It should be in the format P-XXXXX where X is a number.');
            return;
        }

        const nameRegex = /^[A-Za-z\s]+$/;

        if (
            typeof family_name !== 'string' ||
            !nameRegex.test(family_name) ||
            typeof given_name !== 'string' ||
            !nameRegex.test(given_name)
        ) {
            alert('Invalid input types or patterns for family_name or given_name. Please check your input.');
            return;
        }

        const data = {
            newPlayer: {
                player_id,
                given_name,
                family_name,
                birth_date,
                female,
                goal_keeper,
                defender,
                midfielder,
                forward,
                player_wikipedia_link,
                count_tournaments,
                list_tournaments
            }
        };


        fetch("http://localhost:5000/players", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success:", result);
                if (offset > 0) {
                    setOffset(0);
                }
                else {
                    setAddTrigger(!addTrigger);
                }
                setShowFilter(false);
                setShowSort(false);
                toggleModal();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error adding data");
            });
        setShowFilter(false);
        setShowSort(false);
        setModalVisible(false);
        if (offset > 0) {
            setOffset(0);
        }
        else {
            setAddTrigger(!addTrigger);
        }
        toggleModal();
    };

    function handleAddButton() {
        setShowFilter(false);
        setShowSort(false);
        setModalVisible(true);
    }

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
                                <h2>Sort by:</h2>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="sortField"
                                            value="given_name"
                                            checked={sortField === 'given_name'}
                                            onChange={() => setSortField('given_name')}
                                        />
                                        Given Name
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="sortField"
                                            value="family_name"
                                            checked={sortField === 'family_name'}
                                            onChange={() => setSortField('family_name')}
                                        />
                                        Family Name
                                    </label>


                                    <label>
                                        <input
                                            type="radio"
                                            name="sortField"
                                            value="neither"
                                            checked={sortField === 'neither'}
                                            onChange={() => setSortField('neither')}
                                        />
                                        Neither
                                    </label>
                                </div>
                                <div className='options'>
                                    <label>
                                        <input
                                            type="radio"
                                            name="sortOrder"
                                            value="asc"
                                            checked={sortOrder === 'asc'}
                                            onChange={() => setSortOrder('asc')}
                                        />
                                        Ascending
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="sortOrder"
                                            value="desc"
                                            checked={sortOrder === 'desc'}
                                            onChange={() => setSortOrder('desc')}
                                        />
                                        Descending
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name="sortOrder"
                                            value="neither"
                                            checked={sortOrder === 'neither'}
                                            onChange={() => setSortOrder('neither')}
                                        />
                                        Neither
                                    </label>
                                </div>
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
            <button className={'add-button'} onClick={handleAddButton}>+ Add Player</button>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        <form onSubmit={(e) => handleAddPlayer(e)} className='abdullah-edit-form'>
                            <label htmlFor="player_id">Player ID</label>
                            <input
                                type="text"
                                id="player_id"
                                required
                            />
                            <label htmlFor="given_name">Given Name</label>
                            <input
                                type="text"
                                id="given_name"
                                required
                            />
                            <label htmlFor="family_name">Family Name</label>
                            <input
                                type="text"
                                id="family_name"
                                required
                            />
                            <label htmlFor="birth_date">Birth Date</label>
                            <input
                                type="date"
                                id="birth_date"
                                required
                            />
                            <label htmlFor='female'>Female</label>
                            <input
                                type='checkbox'
                                id='female'
                            />
                            <label htmlFor='goal_keeper'>Goal Keeper</label>
                            <input
                                type='checkbox'
                                id='goal_keeper'
                            />
                            <label htmlFor='defender'>Defender</label>
                            <input
                                type='checkbox'
                                id='defender'
                            />
                            <label htmlFor='midfielder'>Midfielder</label>
                            <input
                                type='checkbox'
                                id='midfielder'
                            />
                            <label htmlFor='forward'>Forward</label>
                            <input
                                type='checkbox'
                                id='forward'
                            />
                            <label htmlFor="count_tournaments">Tournaments Count</label>
                            <input
                                type="number"
                                id="count_tournaments"
                                required
                            />
                            <label htmlFor="list_tournaments">Tournaments List</label>
                            <input
                                type="text"
                                id="list_tournaments"
                                required
                            />
                            <label htmlFor="player_wikipedia_link">Wikipedia Link</label>
                            <input
                                type="text"
                                id="player_wikipedia_link"
                                required
                            />
                            <button type="submit">Add player</button>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
}
