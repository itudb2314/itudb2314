import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/player.css';
import siu from '../assets/ronaldo.png';
import siu2 from '../assets/ronaldo2.png';

const PlayerPage = () => {
    const { playerId } = useParams();
    const [player, setPlayer] = useState({});
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [award, setAward] = useState([]);
    const [Appearances, setAppearances] = useState([]);
    const [goals, setGoals] = useState([]);
    const [penalties, setPenalties] = useState([]);


    useEffect(() => {
        fetchPlayer();
    }, [playerId, deleteTrigger]);

    const fetchPlayer = async () => {
        setIsLoading(true); // Set loading to true before fetching data
        try {
            const response = await fetch(`http://localhost:5000/playersdetail/${playerId}`);
            const response2 = await fetch(`http://localhost:5000/get_awards_per_player?player_id=${playerId}`);
            const response3 = await fetch(`http://localhost:5000/get_appearances_per_player?player_id=${playerId}`);
            const response4 = await fetch(`http://localhost:5000/get_goals_per_player/${playerId}`);
            const response5 = await fetch(`http://localhost:5000/get_player_penalties/${playerId}`);
            if (!response.ok || !response2.ok || !response3.ok || !response4.ok || !response5.ok) {
                throw new Error('Failed to fetch player');
            }
            const data = await response.json();
            setPlayer(data);
            const data2 = await response2.json();
            setAward(data2);
            const data3 = await response3.json();
            setAppearances(data3);
            const data4 = await response4.json();
            setGoals(data4);
            const data5 = await response5.json();
            setPenalties(data5);
        } catch (error) {
            console.error('Error fetching player:', error);
        } finally {
            setIsLoading(false); // Set loading to false after fetching data, whether successful or not
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

        const familyName = event.target.family_name?.value;
        const givenName = event.target.given_name?.value;
        const birthDate = event.target.birth_date?.value;
        const countTournaments = parseInt(event.target.count_tournaments?.value, 10) || 0;

        // Basic form validation
        if (!familyName || !givenName || !birthDate || !countTournaments) {
            alert('Please fill in all required fields.');
            return;
        }

        const nameRegex = /^[A-Za-z\s]+$/;

        if (
            typeof familyName !== 'string' ||
            !nameRegex.test(familyName) ||
            typeof givenName !== 'string' ||
            !nameRegex.test(givenName) ||
            isNaN(countTournaments) ||
            !Number.isInteger(countTournaments)
        ) {
            alert('Invalid input types or patterns. Please check your input.');
            return;
        }

        // Ensure event.target exists
        if (!event.target) {
            console.error('Event target is undefined.');
            return;
        }

        const updatedPlayer = {
            player_id: player.player_id,
            family_name: event.target.family_name?.value || '',
            given_name: event.target.given_name?.value || '',
            birth_date: event.target.birth_date?.value || '',
            female: event.target.female?.checked || false,
            goal_keeper: event.target.goalkeeper?.checked || false,
            defender: event.target.defender?.checked || false,
            midfielder: event.target.midfielder?.checked || false,
            forward: event.target.forward?.checked || false,
            count_tournaments: parseInt(event.target.count_tournaments?.value, 10) || 0,
            list_tournaments: event.target.list_tournaments?.value || '',
            player_wikipedia_link: event.target.player_wikipedia_link?.value || '',
        };

        fetch('http://localhost:5000/players', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerData: updatedPlayer }),
        })

            .then(response => response.json())
            .then(data => {
                // Assuming the player state is an array
                // Assuming the player state is an object
                setPlayer(prevPlayer => {
                    // Check if prevPlayer is an object
                    if (typeof prevPlayer === 'object' && !Array.isArray(prevPlayer)) {
                        return { ...prevPlayer, ...updatedPlayer };
                    } else {
                        // Handle it accordingly, for example, log an error
                        console.error('Invalid data structure for prevPlayer:', prevPlayer);
                        return {};
                    }
                });



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

    if (isLoading) {
        return <div>Loading...</div>; // Render loading screen while data is being fetched
    }

    return (
        <div className="player-page">
            <div className="player-details">
                <h1 className="player-details-title">Player Details</h1>
                <div className="player-info">
                    <div className="player-image-p">
                        <img src={player.player_id % 2 === 0 ? siu : siu2} alt={`Player ${player.player_id}`} />
                    </div>
                    {!isEditing ? (
                        <div className="player-data">
                            <p>
                                <label>Player Name:</label>
                                {player.given_name !== "not applicable" && (
                                    <span>{player.given_name}</span>
                                )}
                                {player.given_name !== "not applicable" && player.family_name !== "not applicable" && (
                                    <span>&nbsp;</span>
                                )}
                                {player.family_name !== "not applicable" && (
                                    <span>{player.family_name}</span>
                                )}
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

                        <form className="abdullah-edit-form" onSubmit={(e) => submitForm(e, player)}>
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
                                <label htmlFor="defender">Defender</label>
                                <input
                                    type="checkbox"
                                    id="defender"
                                    defaultChecked={player.defender}
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
            <div className="player-details">
                <h1 className="player-stats-title">Player Stats</h1>
                <div className="player-stats-info">
                    <p>
                        <label>Awards:</label> {award > 0 ? award : 0}
                    </p>
                    <p>
                        <label>Match Appearances:</label> {Appearances > 0 ? Appearances : 0}
                    </p>
                    <p>
                        <label>Goals:</label> {goals > 0 ? goals : 0}
                    </p>
                    <p>
                        <label>Penalties:</label> {penalties > 0 ? penalties : 0}
                    </p>
                    <p>
                        <label>Goals Per Match:</label> {goals > 0 && Appearances > 0 ? (goals / Appearances).toFixed(2) : 0}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PlayerPage;
