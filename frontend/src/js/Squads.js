import React, { useEffect, useState } from 'react';
import '../css/Squads.css';
import siu from '../assets/ronaldo.png';
import siu2 from '../assets/ronaldo2.png';


export default function Squads() {
    const [squads, setSquads] = useState([]);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetchSquads();
    }, [deleteTrigger, addTrigger]);

    const fetchSquads = async () => {
        try {
            const response = await fetch('http://localhost:5000/squadsJOINED');
            if (!response.ok) {
                throw new Error('Failed to fetch squads');
            }
            const data = await response.json();
            setSquads(data);
        } catch (error) {
            console.error('Error fetching squads:', error);
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
        setIsEditing(null);
    };

    const deleteSquad = (tournamentId, teamId, playerId) => {
        fetch('http://localhost:5000/squads', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tournament_id: tournamentId, team_id: teamId, player_id: playerId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    function addSquad(e) {
        e.preventDefault();

        const newSquad = {
            tournament_id: document.getElementById('tournament_id').value,
            team_id: document.getElementById('team_id').value,
            player_id: document.getElementById('player_id').value,
            shirt_number: document.getElementById('shirt_number').value,
            position_name: document.getElementById('position_name').value,
            position_code: document.getElementById('position_code').value,
        };

        fetch('http://localhost:5000/squads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newSquad }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setAddTrigger(!addTrigger);
            })
            .catch((error) => {
                console.log('Error:', error);
            });

        setModalVisible(false);
        setAddTrigger(!addTrigger);
    }

    function updateSquad(updatedSquad) {
        try {
            setIsEditing(updatedSquad);
        } catch (error) {
            console.error('Error updating squad:', error);
        }
    }

    const submitForm = (event, squad) => {
        event.preventDefault();

        const updatedSquad = {
            shirt_number: event.target.shirt_number.value,
            position_name: event.target.position_name.value,
            position_code: event.target.position_code.value,
            tournament_id: squad.tournament_id,
            team_id: squad.team_id,
            player_id: squad.player_id,
        };

        fetch('http://localhost:5000/squads', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ squadData: updatedSquad }),
        })
            .then(response => response.json())
            .then(data => {
                // Update the local state with the new data
                setSquads(prevSquads =>
                    prevSquads.map(actualSquad => {
                        if (actualSquad.tournament_id === squad.tournament_id && actualSquad.team_id === squad.team_id) {
                            return {
                                ...actualSquad,
                                squad: actualSquad.squad.map(s =>
                                    s.player_id === squad.player_id ? { ...s, ...updatedSquad } : s
                                ),
                            };
                        }
                        return actualSquad;
                    })
                );
            })
            .catch((error) => {
                console.log('Error:', error);
            });

        setIsEditing(null);
    };

    const style = {
        alignSelf: 'center',
        padding: '2rem 0 0 2rem',
    };

    return (
        <div className="tournaments">
            <h1 style={style}>Squads</h1>
            {squads.map((actualSquad) => (
                <div key={`${actualSquad.tournament_id}-${actualSquad.team_id}`} className="squad-group">
                    <h2 className='Title'>
                        {actualSquad.tournament_name} / {actualSquad.team_name}
                    </h2>
                    {actualSquad.squad.map((squad, playerIndex) => (
                        <div key={squad.player_id} className="squad">
                            <div className="squad-details">
                                {!isEditing || isEditing.player_id !== squad.player_id ? (
                                    // Display squad details
                                    <>
                                        <div className="player-name">
                                            <p>Player Name: {squad.given_name} {squad.family_name}</p>
                                        </div>
                                        <div className="player-image">
                                            <img src={playerIndex % 2 === 0 ? siu : siu2} alt={`Player ${playerIndex + 1}`} />
                                        </div>
                                        <p>Shirt Number: {squad.shirt_number}</p>
                                        <p>Position: {squad.position_name}</p>
                                        <p>Position Code: {squad.position_code}</p>
                                        <button className="edit-button" onClick={() => updateSquad(squad)}>
                                            Edit
                                        </button>
                                        <button className="delete-button" onClick={() => deleteSquad(actualSquad.tournament_id, actualSquad.team_id, squad.player_id)}>
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    // Display editable form
                                    <div className="edit-form">
                                        <form onSubmit={(e) => submitForm(e, squad)}>
                                            <div>
                                                <label htmlFor="shirt_number">Shirt Number</label>
                                                <input
                                                    type="text"
                                                    id="shirt_number"
                                                    defaultValue={squad.shirt_number} // Populate with the current value
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="position_name">Position Name</label>
                                                <input
                                                    type="text"
                                                    id="position_name"
                                                    defaultValue={squad.position_name} // Populate with the current value
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="position_code">Position Code</label>
                                                <input
                                                    type="text"
                                                    id="position_code"
                                                    defaultValue={squad.position_code} // Populate with the current value
                                                    required
                                                />
                                            </div>

                                            <button className="save-button" type="submit">Save</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <button className={'add-button'} onClick={() => setModalVisible(true)}>+ Add Squad member</button>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        <form onSubmit={addSquad}>
                            {/* Input fields for adding a squad member */}
                            <label htmlFor="tournament_id">Tournament ID</label>
                            <input
                                type="text"
                                id="tournament_id"
                                required
                            />
                            <label htmlFor="team_id">Team ID</label>
                            <input
                                type="text"
                                id="team_id"
                                required
                            />
                            <label htmlFor="player_id">Player ID</label>
                            <input
                                type="text"
                                id="player_id"
                                required
                            />
                            <label htmlFor="shirt_number">Shirt Number</label>
                            <input
                                type="text"
                                id="shirt_number"
                                required
                            />
                            <label htmlFor="position_name">Position Name</label>
                            <input
                                type="text"
                                id="position_name"
                                required
                            />
                            <label htmlFor="position_code">Position Code</label>
                            <input
                                type="text"
                                id="position_code"
                                required
                            />
                            <button type="submit">Add Squad member</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
