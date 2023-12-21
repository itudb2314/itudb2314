import React, { useEffect, useState } from 'react';
import '../css/Squads.css';
import siu from '../assets/ronaldo.png';
import siu2 from '../assets/ronaldo2.png';
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const SingleSquadPage = () => {
    const history = useHistory();
    const { tournamentId, teamId } = useParams();
    const [squad, setSquad] = useState({});
    const [isEditing, setIsEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSquad();
    }, [tournamentId, teamId, isEditing]);

    const fetchSquad = async () => {
        try {
            const response = await fetch(`http://localhost:5000/squads/${tournamentId}/${teamId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch squad');
            }
            const data = await response.json();
            setSquad(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching squad:', error);
            setLoading(false);
        }
    };

    const updateSquad = (updatedSquad) => {
        try {
            setIsEditing(updatedSquad);
        } catch (error) {
            console.error('Error updating squad:', error);
        }
    };

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
            !nameRegex.test(positionName)
        ) {
            alert('Invalid Position Name. Please provide a valid string with the correct pattern.');
            return;
        }

        if (
            typeof positionCode !== 'string' ||
            !nameRegex.test(positionCode)
        ) {
            alert('Invalid Position Code. Please provide a valid string with the correct pattern.');
            return;
        }

        if (
            isNaN(shirtNumber) ||
            !Number.isInteger(shirtNumber)
        ) {
            alert('Invalid Shirt Number. Please provide a valid integer.');
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
            .then((response) => response.json())
            .then((data) => {
                setSquad({
                    ...squad,
                    squad: squad.squad.map((s) =>
                        s.player_id === squad.player_id ? { ...s, ...updatedSquad } : s
                    ),
                });
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        fetchSquad();
        setIsEditing(null);

    };

    const deleteSquadMember = (playerId) => {
        fetch(`http://localhost:5000/squads`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tournament_id: tournamentId,
                team_id: teamId,
                player_id: playerId,
            }),
        })
            .then(() => {
                setSquad((prevSquad) => ({
                    ...prevSquad,
                    squad: prevSquad.squad.filter((s) => s.player_id !== playerId),
                }));
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    function handlePlayerClick(squad) {
        history.push(`/players/${squad.player_id}`);
    }

    return (
        <div className="squad-group">
            <h1 className="Title">
                {squad.tournament_name} / {squad.team_name} Squad
            </h1>
            {squad.squad &&
                squad.squad.map((squadMember, playerIndex) => (
                    <div key={squadMember.player_id} className="squad">
                        <div className="squad-details">
                            {!isEditing || isEditing.player_id !== squadMember.player_id ? (
                                <>
                                    <div className="player-name" onClick={() => handlePlayerClick(squadMember)} style={{ cursor: 'pointer' }}>
                                        {squadMember.given_name !== "not applicable" && (
                                            <span>{squadMember.given_name}</span>
                                        )}
                                        {squadMember.given_name !== "not applicable" && squadMember.family_name !== "not applicable" && (
                                            <span>&nbsp;</span>
                                        )}
                                        {squadMember.family_name !== "not applicable" && (
                                            <span>{squadMember.family_name}</span>
                                        )}
                                    </div>
                                    <div className="player-image">
                                        <img
                                            src={playerIndex % 2 === 0 ? siu : siu2}
                                            alt={`Player ${playerIndex + 1}`}
                                        />
                                    </div>
                                    <p>Shirt Number: {squadMember.shirt_number}</p>
                                    <p>Position: {squadMember.position_name}</p>
                                    <p>Position Code: {squadMember.position_code}</p>
                                    <button className="edit-button" onClick={() => updateSquad(squadMember)}>
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button-danas"
                                        onClick={() => deleteSquadMember(squadMember.player_id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <div className="abdullah-edit-form">
                                    <form onSubmit={(e) => submitForm(e, squadMember)}>
                                        <div>
                                            <label htmlFor="shirt_number">Shirt Number</label>
                                            <input
                                                type="number"
                                                id="shirt_number"
                                                defaultValue={squadMember.shirt_number}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="position_name">Position Name</label>
                                            <input
                                                type="text"
                                                id="position_name"
                                                defaultValue={squadMember.position_name}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="position_code">Position Code</label>
                                            <input
                                                type="text"
                                                id="position_code"
                                                defaultValue={squadMember.position_code}
                                                required
                                            />
                                        </div>

                                        <button className="save-button" type="submit">
                                            Save
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default SingleSquadPage;
