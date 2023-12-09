import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/player.css';
import siu from '../assets/ronaldo.png';
import siu2 from '../assets/ronaldo2.png';

const PlayerPage = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState(false);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPlayer();
    }, [playerId, deleteTrigger]);

    const fetchPlayer = async () => {
        try {
            const response = await fetch(`http://localhost:5000/players/${playerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch player');
            }
            const data = await response.json();
            setPlayer(data);
        } catch (error) {
            console.error('Error fetching player:', error);
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setIsEditing(null);
    };

    const deletePlayer = (playerId) => {
        fetch('http://localhost:5000/players', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ player_id: playerId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Player deleted successfully:', data);
                setDeleteTrigger(!deleteTrigger);
            })
            .catch((error) => {
                console.error('Error deleting player:', error);
            });
    };

    function updatePlayer(updatedPlayer) {
        try {
            setIsEditing(updatedPlayer);
        }
        catch (error) {
            console.error('Error updating player:', error);
        }
    }

    const submitForm = (event, player) => {
        event.preventDefault();
        const updatedPlayer = {
            player_id: player.player_id,
            family_name: event.target.family_name.value,
            given_name: event.target.given_name.value,
            birth_date: event.target.birth_date.value,
            female: event.target.female.checked,
            goal_keeper: event.target.goalkeeper.checked,
            defender: event.target.defender.checked,
            midfielder: event.target.midfielder.checked,
            forward: event.target.forward.checked,
            count_tournaments: parseInt(event.target.count_tournaments.value, 10),
            list_tournaments: event.target.list_tournaments.value,
            player_wikipedia_link: event.target.player_wikipedia_link.value,
        };

        fetch('http://localhost:5000/players', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPlayer),
        })
            .then(response => response.json())
            .then(data => {
                // Assuming the player state is an array
                setPlayer(prevPlayers =>
                    prevPlayers.map(p =>
                        p.player_id === updatedPlayer.player_id ? { ...p, ...updatedPlayer } : p
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating player:', error);
            });

        setIsEditing(null);
    };

    const style = {
        alignSelf: 'center',
        padding: '2rem 0 0 2rem',
    };

    if (!player) {
        return <div>Loading...</div>;
    }

    return (
        <div className="player-details">
            <h1 className="player-details-title">Player Details:</h1>
            <div className="player-info">
                <div className="player-image-p">
                    <img src={player.player_id % 2 === 0 ? siu : siu2} alt={`Player ${player.player_id}`} />
                </div>
                {!isEditing ? (
                    <div className="player-data">
                        <p>
                            <label>Player Name:</label> {player.given_name} {player.family_name}
                        </p>
                        <p>
                            <label>Birth Date:</label> {new Date(player.birth_date).toLocaleDateString()}
                        </p>
                        <p>
                            <label>Female:</label> {player.female ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <label>Goal Keeper:</label> {player.goal_keeper ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <label>Defender:</label> {player.defender ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <label>Midfielder:</label> {player.midfielder ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <label>Forward:</label> {player.forward ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <label>Tournaments Played:</label> {player.count_tournaments}
                        </p>
                        <p>
                            <label>List of Tournaments:</label> {player.list_tournaments}
                        </p>
                        <p>
                            <label>Wikipedia Link:</label> <a href={player.player_wikipedia_link}>{player.player_wikipedia_link}</a>
                        </p>
                        <button className="edit-button" onClick={() => updatePlayer(player)}>Edit</button>
                        <button className="delete-button-danas" onClick={() => deletePlayer(player.player_id)}>Delete</button>
                    </div>
                ) : (

                    <form className="edit-form" onSubmit={(e) => submitForm(e, player)}>
                        <div>
                            <label htmlFor="family_name">Family Name</label>
                            <input
                                type="text"
                                id="family_name"
                                defaultValue={player.family_name}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="given_name">Given Name</label>
                            <input
                                type="text"
                                id="given_name"
                                defaultValue={player.given_name}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="birth_date">Birth Date</label>
                            <input
                                type="date"
                                id="birth_date"
                                defaultValue={player.birth_date}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="female">Female</label>
                            <input
                                type="checkbox"
                                id="female"
                                defaultChecked={player.female}
                            />
                        </div>
                        <div>
                            <label htmlFor="goalkeeper">Goalkeeper</label>
                            <input
                                type="checkbox"
                                id="goalkeeper"
                                defaultChecked={player.goal_keeper}
                            />
                        </div>
                        <div>
                            <label htmlFor="midfielder">Midfielder</label>
                            <input
                                type="checkbox"
                                id="midfielder"
                                defaultChecked={player.midfielder}
                            />
                        </div>
                        <div>
                            <label htmlFor="forward">Forward</label>
                            <input
                                type="checkbox"
                                id="forward"
                                defaultChecked={player.forward}
                            />
                        </div>
                        <div>
                            <label htmlFor="count_tournaments">Tournaments Played</label>
                            <input
                                type="number"
                                id="count_tournaments"
                                defaultValue={player.count_tournaments}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="list_tournaments">List of Tournaments</label>
                            <input
                                type="text"
                                id="list_tournaments"
                                defaultValue={player.list_tournaments}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="player_wikipedia_link">Wikipedia Link</label>
                            <input
                                type="text"
                                id="player_wikipedia_link"
                                defaultValue={player.player_wikipedia_link}
                                required
                            />
                        </div>
                        <button className="save-button" type="submit">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PlayerPage;
