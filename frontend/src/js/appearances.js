import React, { useEffect, useState } from "react";
import '../css/appearances.css';
import SearchBar from "./SearchBar";

export default function Appearances() {
    const [appearances, setAppearances] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteTrigger, setDeleteTrigger] = useState(false);
    const [addTrigger, setAddTrigger] = useState(false);
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/player_appearances")
            .then(response => response.json())
            .then(data => setAppearances(data))
            .catch(error => console.error("Error fetching data:", error));
    }, [deleteTrigger, addTrigger]);

    function searchAppearance(e) {
        if (e.target.value === "") {
            fetch("http://localhost:5000/player_appearances")
                .then(response => response.json())
                .then(data => setAppearances(data))
                .catch(error => console.error("Error fetching data:", error));
            return
        }

        fetch(`http://localhost:5000/player_appearances/${e.target.value}`)
            .then(response => response.json())
            .then(data => setAppearances(data))
            .catch(error => console.error("Error fetching data:", error));
    }

    function addAppearance(e) {
        e.preventDefault();
        const tournament_id = e.target.elements.tournament_id.value;
        const team_id = e.target.elements.team_id.value;
        const player_id = e.target.elements.player_id.value;
        const shirt_number = e.target.elements.shirt_number.value;
        const position_name = e.target.elements.position_name.value;
        const position_code = e.target.elements.position_code.value;

        fetch("http://localhost:5000/player_appearances", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tournament_id: tournament_id,
                team_id: team_id,
                player_id: player_id,
                shirt_number: shirt_number,
                position_name: position_name,
                position_code: position_code
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success:", result);
                setAppearances([...appearances, result]);
                toggleModal();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error adding data");
            });
        setModalVisible(false);
    }

    function updateAppearance(appearance) {
        setIsEditing(appearance);
        toggleModal();
    }

    function saveUpdateAppearance(e) {
        e.preventDefault();
        const tournament_id = e.target.elements.tournament_id.value;
        const match_id = e.target.elements.match_id.value;
        const team_id = e.target.elements.team_id.value;
        const player_id = e.target.elements.player_id.value;
        const shirt_number = e.target.elements.shirt_number.value;
        const position_name = e.target.elements.position_name.value;
        const position_code = e.target.elements.position_code.value;
        const starter = e.target.elements.starter.value;
        const substitute = e.target.elements.substitute.value;

        fetch("http://localhost:5000/player_appearances", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                player_appearance: {
                    tournament_id,
                    team_id,
                    player_id,
                    match_id,
                    shirt_number,
                    position_name,
                    position_code,
                    starter,
                    substitute,
                },
            }),
        })
            .then(response => response.json())
            .then(updatedAppearance => {
                setAppearances(appearances.map(appearance =>
                    appearance.player_id === updatedAppearance.player_id &&
                        appearance.tournament_id === updatedAppearance.tournament_id &&
                        appearance.match_id === updatedAppearance.match_id
                        ? updatedAppearance
                        : appearance
                ));
                toggleModal();
                setIsEditing(null);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error updating data");
            });
    }

    function deleteAppearance(tournament_id, team_id, player_id, match_id) {
        fetch('http://localhost:5000/player_appearances', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tournament_id: tournament_id, team_id: team_id, player_id: player_id, match_id: match_id }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    const submitForm = (event, appearance) => {
        event.preventDefault();
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Player Appearances</h1>
            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>Tournament Name</th>
                        <th style={{ textAlign: 'center' }}>Match</th>
                        <th style={{ textAlign: 'center' }}>Team Name</th>
                        <th style={{ textAlign: 'center' }}>Given Name</th>
                        <th style={{ textAlign: 'center' }}>Family Name</th>
                        <th style={{ textAlign: 'center' }}>Home Team</th>
                        <th style={{ textAlign: 'center' }}>Away Team</th>
                        <th style={{ textAlign: 'center' }}>Shirt Number</th>
                        <th style={{ textAlign: 'center' }}>Position Name</th>
                        <th style={{ textAlign: 'center' }}>Position Code</th>
                        <th style={{ textAlign: 'center' }}>Starter</th>
                        <th style={{ textAlign: 'center' }}>Substitute</th>
                        <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appearances.map(appearance => (
                        <tr key={`${appearance.player_id}-${appearance.tournament_id}-${appearance.match_id}`}>
                            <td>{appearance.tournament_name}</td>
                            <td>{appearance.match_name}</td>
                            <td>{appearance.team_name}</td>
                            <td>{appearance.given_name}</td>
                            <td>{appearance.family_name}</td>
                            <td>{appearance.home_team}</td>
                            <td>{appearance.away_team}</td>
                            <td>{appearance.shirt_number}</td>
                            <td>{appearance.position_name}</td>
                            <td>{appearance.position_code}</td>
                            <td>{appearance.starter}</td>
                            <td>{appearance.substitute}</td>
                            <td>
                                <button className='edit-button' onClick={() => updateAppearance(appearance)}>
                                    Update
                                </button>
                                <button className='delete-button-danas' onClick={() => deleteAppearance(appearance.tournament_id, appearance.team_id, appearance.player_id, appearance.match_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={'add-button'} onClick={() => setModalVisible(true)}>+ Add Appearance</button>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { toggleModal(); setIsEditing(0) }}>
                            &times;
                        </span>
                        {!isEditing ? (
                            <form onSubmit={addAppearance} className='abdullah-edit-form'>
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
                                <button type="submit">Add Appearance</button>
                            </form>) : (
                            <form onSubmit={saveUpdateAppearance} className='abdullah-edit-form'>
                                <label htmlFor="tournament_id">Tournament ID</label>
                                <input
                                    type="text"
                                    id="tournament_id"
                                    defaultValue={isEditing.tournament_id}
                                    required
                                />
                                <label htmlFor="match_id">Match ID</label>
                                <input
                                    type="text"
                                    id="match_id"
                                    defaultValue={isEditing.match_id}
                                    required
                                />
                                <label htmlFor="team_id">Team ID</label>
                                <input
                                    type="text"
                                    id="team_id"
                                    defaultValue={isEditing.team_id}
                                    required
                                />
                                <label htmlFor="player_id">Player ID</label>
                                <input
                                    type="text"
                                    id="player_id"
                                    defaultValue={isEditing.player_id}
                                    required
                                />
                                <label htmlFor="shirt_number">Shirt Number</label>
                                <input
                                    type="number"
                                    id="shirt_number"
                                    defaultValue={isEditing.shirt_number}
                                    required
                                />
                                <label htmlFor="position_name">Position Name</label>
                                <input
                                    type="text"
                                    id="position_name"
                                    defaultValue={isEditing.position_name}
                                    required
                                />
                                <label htmlFor="position_code">Position Code</label>
                                <input
                                    type="text"
                                    id="position_code"
                                    defaultValue={isEditing.position_code}
                                    required
                                />
                                <label htmlFor="starter">Starter</label>
                                <input
                                    type="text"
                                    id="starter"
                                    defaultValue={isEditing.starter}
                                    required
                                />
                                <label htmlFor="substitute">Substitute</label>
                                <input
                                    type="text"
                                    id="substitute"
                                    defaultValue={isEditing.substitute}
                                    required
                                />
                                <button type="submit">Save</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
