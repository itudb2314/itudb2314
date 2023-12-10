import { SearchBar } from '../components/searchbar';
import { SearchResultsList } from '../components/searchresultslists';
import '../css/Players.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Players() {
    const history = useHistory();
    const [results, setResults] = useState([]);
    const [players, setPlayers] = useState([]);
    const [newPlayer, setNewPlayer] = useState({
        given_name: '',
        family_name: '',
        // Add other fields as needed
    });

    useEffect(() => {
        fetchPlayers();
    }, []); // Fetch players when the component mounts

    const fetchPlayers = async () => {
        try {
            const response = await fetch('http://localhost:5000/players');
            if (!response.ok) {
                throw new Error('Failed to fetch players');
            }
            const data = await response.json();
            setPlayers(data);
        } catch (error) {
            console.error('Error fetching players:', error);
        }
    };

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
            <div className="search-bar-container">
                <SearchBar setResults={setResults} />
                <SearchResultsList results={results} />
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
                                <p>Wikipedia Link: <a href={player.player_wikipedia_link}> link</a> </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    );
}
