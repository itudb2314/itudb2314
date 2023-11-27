import React, { useEffect, useState } from 'react';
import '../css/Squads.css';

export default function Squads() {
    const [squads, setSquads] = useState([]);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchSquads();
    }, [deleteTrigger, addTrigger]);

    const fetchSquads = async () => {
        try {
            const response = await fetch('http://localhost:5000/squads');
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
    };

    const deleteSquad = (tournamentId, teamId, playerId) => {
        fetch('http://localhost:5000/squads', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tournament_id: tournamentId, team_id: teamId, player_id: playerId }),
        }).then(response => response.json())
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
            body: JSON.stringify({ newSquad }),  // Removed the extra curly braces around newSquad
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
            const { tournament_id, team_id, player_id, ...rest } = updatedSquad;

            const squadData = {
                tournament_id,
                team_id,
                player_id,
                ...rest,
                shirt_number: document.getElementById('shirt_number').value,
                position_name: document.getElementById('position_name').value,
                position_code: document.getElementById('position_code').value,
            };

            fetch('http://localhost:5000/squads', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ squadData }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    fetchSquads();
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        } catch (error) {
            console.error('Error updating squad:', error);
        }
    }

    const style = {
        alignSelf: 'center',
        padding: '2rem 0 0 2rem',
    };

    return (
        <div className="tournaments">
            <h1 style={style}>Squads</h1>
            {squads.map((actualSquad) => (
                <div key={`${actualSquad.tournament_id}-${actualSquad.team_id}`} className="squad-group">
                    <h2>
                        {actualSquad.tournament_id} / {actualSquad.team_id}
                    </h2>
                    {actualSquad.squad.map((squad) => (
                        <div key={squad.player_id} className="squad">
                            <div className="squad-details">
                                <p>Player: {squad.player_id}</p>
                                <p>Shirt Number: {squad.shirt_number}</p>
                                <p>Position: {squad.position_name}</p>
                                <button className="delete-button" onClick={() => deleteSquad(actualSquad.tournament_id, actualSquad.team_id, squad.player_id)}>
                                    Delete
                                </button>
                                <button className="edit-button" onClick={() => updateSquad(squad)}>
                                    Edit
                                </button>
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
                                id="position_code"  // Corrected to match the case in the addSquad function
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