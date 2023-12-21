import React, { useEffect, useState } from 'react';
import '../css/Squads.css';
import siu from '../assets/ronaldo.png';
import siu2 from '../assets/ronaldo2.png';
import { useHistory } from "react-router-dom";

export default function Squads() {
    const history = useHistory();
    const [squads, setSquads] = useState([]);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [offset, setOffset] = useState(0);
    const [tournaments, setTournaments] = useState([]);
    const [teams, setTeams] = useState([]);

    let isFetching = false;

    useEffect(() => {
        if (offset === 0) {
            setSquads([]);
        }
        fetchSquads();
    }, [deleteTrigger, addTrigger, offset]);

    // const fetchSquads = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/squadsJOINED');
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch squads');
    //         }
    //         const data = await response.json();
    //         setSquads(data);
    //     } catch (error) {
    //         console.error('Error fetching squads:', error);
    //     }
    // };

    const fetchSquads = async () => {
        if (isFetching) return;
        isFetching = true;
        try {
            const response = await fetch(`http://localhost:5000/squadsJOINED?page=${offset}&items_per_page=22`);
            if (!response.ok) {
                throw new Error('Failed to fetch squads');
            }
            const data = await response.json();

            // Ensure that data is an array before updating the state
            if (Array.isArray(data)) {
                setSquads(prev => [...prev, ...data]);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching squads:', error);
        }
    }

    const fetchTournaments = async () => {
        try {
            const response = await fetch('http://localhost:5000/tournaments');
            if (!response.ok) {
                throw new Error('Failed to fetch tournaments');
            }
            const data = await response.json();
            setTournaments(data);
        } catch (error) {
            console.error('Error fetching tournaments:', error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await fetch(`http://localhost:5000/tournaments/teams`);
            if (!response.ok) {
                throw new Error('Failed to fetch teams');
            }
            const data = await response.json();
            setTeams(data);
        } catch (error) {
            console.error('Error fetching teams:', error);
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
                if (offset > 0) {
                    setOffset(0);
                }
                else {
                    setDeleteTrigger(!deleteTrigger);
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    function addSquad(e) {
        e.preventDefault();

        const tournamentIdInput = document.getElementById('tournament_id');
        const teamIdInput = document.getElementById('team_id');
        const playerIdInput = document.getElementById('player_id');
        const shirtNumberInput = document.getElementById('shirt_number');
        const positionNameInput = document.getElementById('position_name');
        const positionCodeInput = document.getElementById('position_code');

        const tournamentId = tournamentIdInput.value;
        const teamId = teamIdInput.value;
        const playerId = playerIdInput.value;
        const shirtNumber = parseInt(shirtNumberInput.value, 10);
        const positionName = positionNameInput.value;
        const positionCode = positionCodeInput.value;

        if (!tournamentId || !teamId || !playerId || isNaN(shirtNumber) || !positionName || !positionCode) {
            alert('Please fill in all required fields and ensure Shirt Number is a number.');
            return;
        }

        // // Validate tournamentId format (WC-XXXX where X is a number)
        // const tournamentIdRegex = /^WC-\d{4}$/;
        // if (!tournamentIdRegex.test(tournamentId)) {
        //     alert('Invalid Tournament ID format. It should be in the format WC-XXXX where X is a number.');
        //     return;
        // }

        // // Validate teamId format (T-XX where X is a number)
        // const teamIdRegex = /^T-\d{2}$/;
        // if (!teamIdRegex.test(teamId)) {
        //     alert('Invalid Team ID format. It should be in the format T-XX where X is a number.');
        //     return;
        // }

        // Validate playerId format (P-XXXXX where X is a number)
        const playerIdRegex = /^P-\d{5}$/;
        if (!playerIdRegex.test(playerId)) {
            alert('Invalid Player ID format. It should be in the format P-XXXXX where X is a number.');
            return;
        }

        // Validate positionName and positionCode format (any text is accepted for now)
        const nameRegex = /^[A-Za-z]+$/;
        if (
            typeof positionName !== 'string' ||
            !nameRegex.test(positionName) ||
            typeof positionCode !== 'string' ||
            !nameRegex.test(positionCode)
        ) {
            alert('Invalid input types or patterns for Position Name or Position Code. Only A-Z letters are allowed.');
            return;
        }

        // Validate shirtNumber is a number
        if (isNaN(shirtNumber) || !Number.isInteger(shirtNumber)) {
            alert('Invalid Shirt Number. It should be a number.');
            return;
        }

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
                if (offset > 0) {
                    setOffset(0);
                }
                else {
                    setAddTrigger(!addTrigger);
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });

        setModalVisible(false);
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


        const shirtNumber = parseInt(event.target.shirt_number.value, 10) || 0;
        const positionName = event.target.position_name.value;
        const positionCode = event.target.position_code.value;

        if (!shirtNumber || isNaN(shirtNumber) || !positionName || !positionCode) {
            alert('Please fill in all required fields and ensure Shirt Number is a number.');
            return;
        }

        const nameRegex = /^[A-Za-z\s]+$/;

        if (
            typeof positionName !== 'string' ||
            !nameRegex.test(positionName) ||
            typeof positionCode !== 'string' ||
            !nameRegex.test(positionCode) ||
            isNaN(shirtNumber) ||
            !Number.isInteger(shirtNumber)
        ) {
            alert('Invalid input types or patterns. Please check your input.');
            return;
        }

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

    function handleClick(actualSquad) {
        history.push(`/squads/${actualSquad.tournament_id}/${actualSquad.team_id}`);
    }

    function handlePlayerClick(squad) {
        history.push(`/players/${squad.player_id}`);
    }

    return (
        <div className="tournaments">
            <h1 style={style}>Squads</h1>
            {squads.map((actualSquad) => (
                <div key={`${actualSquad.tournament_id}-${actualSquad.team_id}`} className="squad-group">
                    <h2 onClick={() => handleClick(actualSquad)} style={{ cursor: 'pointer' }} className='Title'>
                        {actualSquad.tournament_name} / {actualSquad.team_name}
                    </h2>
                    {actualSquad.squad.map((squad, playerIndex) => (
                        <div key={squad.player_id} className="squad">
                            <div className="squad-details">
                                {!isEditing || isEditing.player_id !== squad.player_id ? (
                                    // Display squad details
                                    <>
                                        <div className="player-name" onClick={() => handlePlayerClick(squad)} style={{ cursor: 'pointer' }} >
                                            {squad.given_name !== "not applicable" && (
                                                <span>{squad.given_name}</span>
                                            )}
                                            {squad.given_name !== "not applicable" && squad.family_name !== "not applicable" && (
                                                <span>&nbsp;</span>
                                            )}
                                            {squad.family_name !== "not applicable" && (
                                                <span>{squad.family_name}</span>
                                            )}
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
                                        <button className="delete-button-danas" onClick={() => deleteSquad(actualSquad.tournament_id, actualSquad.team_id, squad.player_id)}>
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    // Display editable form
                                    <div className="abdullah-edit-form">
                                        <form onSubmit={(e) => submitForm(e, squad)}>
                                            <div>
                                                <label htmlFor="shirt_number">Shirt Number</label>
                                                <input
                                                    type="number"
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

            <button className={'add-button'} onClick={() => { setModalVisible(true); fetchTournaments(); fetchTeams(); }}>+ Add Squad member</button>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        <form onSubmit={addSquad} className='abdullah-edit-form'>
                            {/* Input fields for adding a squad member */}
                            {/* <label htmlFor="tournament_id">Tournament ID</label>
                            <input
                                type="text"
                                id="tournament_id"
                                required
                            /> */}
                            <label htmlFor="tournament_id">Tournament ID</label>
                            <select name="tournament_id" id="tournament_id">
                                {tournaments.map((tournament) => (
                                    <option key={tournament.tournament_id} value={tournament.tournament_id}>{tournament.tournament_name}</option>
                                ))}
                            </select>
                            <label htmlFor="team_id">Team ID</label>
                            {/* <input
                                type="text"
                                id="team_id"
                                required
                            /> */}
                            <select name="team_id" id="team_id">
                                {teams.map((team) => (
                                    <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                                ))}
                            </select>
                            <label htmlFor="player_id">Player ID</label>
                            <input
                                type="text"
                                id="player_id"
                                required
                            />
                            <label htmlFor="shirt_number">Shirt Number</label>
                            <input
                                type="number"
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
