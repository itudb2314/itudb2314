import '../css/Tournament.css';
import '../css/Buttons.css';
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/tournaments')
            .then(response => response.json())
            .then(data => {
                setTournaments(data)
            })
    }, [deleteTrigger, addTrigger])

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const deleteTournament = (tournament) => {
        fetch('http://localhost:5000/tournaments', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tournament.tournament_id),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger)
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    function addTournament(e) {
        e.preventDefault();
        console.log(e.target.host_won.checked)
        console.log(e.target.final.checked)
        const newTournament = {
            tournament_id: e.target.tournament_id.value,
            tournament_name: e.target.tournament_name.value,
            year: e.target.year.value,
            start_date: e.target.start_date.value,
            end_date: e.target.end_date.value,
            host_country: e.target.host_country.value,
            winner: e.target.winner.value,
            count_teams: e.target.count_teams.value,
            host_won: e.target.host_won.checked,
            group_stage: e.target.group_stage.checked,
            second_group_stage: e.target.second_group_stage.checked,
            final_round: e.target.final_round.checked,
            round_of_16: e.target.round_of_16.checked,
            quarter_finals: e.target.quarter_finals.checked,
            semi_finals: e.target.semi_finals.checked,
            third_place_match: e.target.third_place_match.checked,
            final: e.target.final.checked,
        }

        fetch('http://localhost:5000/tournaments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTournament}),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setAddTrigger(!addTrigger)
            })
            .catch((error) => {
                console.log('Error:', error);
            });

        setModalVisible(false);
        setAddTrigger(!addTrigger)
    }


    const style = {
        alignSelf: "center",
        padding: "0 0 0 2rem"
    }

    return (
        <div className="tournaments">
            <h1 style={style}>Tournaments</h1>
            {tournaments.sort((a,b) => {
                if (a.year < b.year) {
                    return 1
                }
                if (a.year > b.year) {
                    return -1
                }
                return 0
            }).map(tournament => (
                <Tournament key={tournament.year} t={tournament} deleteHandle={deleteTournament}/>
            ))}
            <button className={'add-button'} onClick={() => setModalVisible(true)}>+ Add Tournament</button>
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        <form onSubmit={addTournament}>
                            <label htmlFor="tournament_id">Tournament ID</label>
                            <input
                                type="text"
                                id="tournament_id"
                                required
                            />
                            <label htmlFor="tournament_name">Tournament Name</label>
                            <input
                                type="text"
                                id="tournament_name"
                                required
                            />
                            <label htmlFor="year">Year</label>
                            <input
                                type="text"
                                id="year"
                                required
                            />
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                type="text"
                                id="start_date"
                                required /> <label htmlFor="end_date">End Date</label>
                            <input
                                type="text"
                                id="end_date"
                                required
                            />
                            <label htmlFor="host_country">Host Country</label>
                            <input
                                type="text"
                                id="host_country"
                                required
                            />
                            <label htmlFor="winner">Winner</label>
                            <input
                                type="text"
                                id="winner"
                                required
                            />
                            <label htmlFor="count_teams">Count Teams</label>
                            <input
                                type="text"
                                id="count_teams"
                                required
                            />
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="host_won"
                                />
                                <label htmlFor="host_won">Host Won</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="group_stage"
                                />
                                <label htmlFor="group_stage">Group Stage</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="second_group_stage"
                                />
                                <label htmlFor="second_group_stage">Second Group Stage</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="final_round"
                                />
                                <label htmlFor="final_round">Final Round</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="round_of_16"
                                />
                                <label htmlFor="round_of_16">Round of 16</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="quarter_finals"
                                />
                                <label htmlFor="quarter_finals">Quarter Finals</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="semi_finals"
                                />
                                <label htmlFor="semi_finals">Semi Finals</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="third_place_match"
                                />
                                <label htmlFor="third_place_match">Third Place Match</label>
                            </div>
                            <div>
                                <input style={{marginLeft:'0'}}
                                       type="checkbox"
                                       id="final"
                                />
                                <label htmlFor="final">Final</label>
                            </div>
                            <button type="submit">Add Tournament</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Tournament({t, deleteHandle}) {
    const [tournament, setTournament] = useState(t);

    const [isEditing, setIsEditing] = useState(false);
    const history = useHistory();

    const editTournament = () => setIsEditing(true);
    const submitForm = (event) => {
        event.preventDefault();
        const newTournament = {...tournament};
        newTournament.tournament_name = event.target.tournament_name.value;
        newTournament.winner = event.target.winner.value;
        newTournament.host_country = event.target.host_country.value;
        newTournament.year = event.target.year.value;

        fetch('http://localhost:5000/tournaments', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTournament}),
        }).then(response => response.json())
            .then(data => {
                setTournament(data);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        setIsEditing(false);
    }

    const deleteTournament = () => {
        deleteHandle(tournament);
    }

    function handleClick() {
        history.push(`/tournaments/${tournament.tournament_id}`);
    }

    return (
        <div className="tournament">
            <div className="tournament-details">
                {!isEditing ? (
                    <>
                        <h3 onClick={handleClick} style={{cursor: 'pointer'}}>{tournament.tournament_name}</h3>
                        <p>Winner: {tournament.winner}</p>
                        <div className="buttons">
                            <button className="edit-button" onClick={editTournament}>Edit</button>
                            <button className="delete-button-danas" onClick={deleteTournament}>Delete</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submitForm}>
                        <label htmlFor="tournament_name">Tournament Name</label>
                        <input
                            type="text"
                            id="tournament_name"
                            defaultValue={tournament.tournament_name}
                        />
                        <label htmlFor="winner">Winner</label>
                        <input
                            type="text"
                            id="winner"
                            defaultValue={tournament.winner}
                        />
                        <label htmlFor="host_country">Host Country</label>
                        <input
                            type="text"
                            id="host_country"
                            defaultValue={tournament.host_country}
                        />
                        <label htmlFor="year">Label</label>
                        <input
                            type="text"
                            id="year"
                            defaultValue={tournament.year}
                        />
                        <button className="save-button" type="submit">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};
