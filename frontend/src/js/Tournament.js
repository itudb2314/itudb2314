import '../css/Tournament.css';
import '../css/Buttons.css';
import '../css/Filters.css';
import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [sort, setSort] = useState('winner')
    const [order, setOrder] = useState('asc')
    const [gender, setGender] = useState('all')

    useEffect(() => {
        fetch(`http://localhost:5000/tournaments/${sort}/${order}/${gender}`)
            .then(response => response.json())
            .then(data => {
                setTournaments(data)
                console.log(data)
            })
    }, [deleteTrigger, addTrigger, sort, order, gender])

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
        padding: "0 0 0 2rem",
        textAlign: "center"
    }

    function sortTournaments(e) {
        setSort(e.target.value)
    }

    function orderTournaments(e) {
        setOrder(e.target.value)
    }

    function setWoman() {
        setGender("woman")
    }

    function setMan() {
        setGender("man")
    }

    function setAll() {
        setGender("all")
    }

    return (
        <div className="tournament-container" style={{minWidth: "100%",display:"flex", flexDirection: "column", alignItems: "center"}}>
            <h1 style={style}>Tournaments</h1>
            <div className="filter-block">
                <div className="filter">
                    <label>Sort By</label>
                    <select className="filter_select" onChange={sortTournaments}>
                        <option value="tournament_name">Tournament Name</option>
                        <option value="year">Year</option>
                        <option value="start_date">Start Date</option>
                        <option value="end_date">End Date</option>
                        <option value="host_country">Host Country</option>
                        <option value="winner">Winner</option>
                        <option value="count_teams">Count Teams</option>
                    </select>
                </div>
                <div className="filter">
                    <label>Order</label>
                    <select className="filter_select" onChange={orderTournaments}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className="filter" style={{flexDirection: "column"}}>
                    <label htmlFor="all">All Tournaments</label>
                    <input type="radio" id="all" name="gender" style={{marginLeft: "10px"}} onClick={setAll}/>
                </div>
                <div className="filter" style={{flexDirection: "column"}}>
                    <label htmlFor="woman">Woman's Tournaments</label>
                    <input type="radio" id="woman" name="gender" style={{marginLeft: "10px"}} onClick={setWoman}/>
                </div>
                <div className="filter" style={{flexDirection: "column"}}>
                    <label htmlFor="man">Men's Tournaments</label>
                    <input type="radio" id="man" name="gender" style={{marginLeft: "10px"}} onClick={setMan}/>
                </div>
            </div>
            <div className="tournaments">
                {tournaments.map(tournament => (
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
                                    required/> <label htmlFor="end_date">End Date</label>
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
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="host_won"
                                    />
                                    <label htmlFor="host_won">Host Won</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="group_stage"
                                    />
                                    <label htmlFor="group_stage">Group Stage</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="second_group_stage"
                                    />
                                    <label htmlFor="second_group_stage">Second Group Stage</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="final_round"
                                    />
                                    <label htmlFor="final_round">Final Round</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="round_of_16"
                                    />
                                    <label htmlFor="round_of_16">Round of 16</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="quarter_finals"
                                    />
                                    <label htmlFor="quarter_finals">Quarter Finals</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="semi_finals"
                                    />
                                    <label htmlFor="semi_finals">Semi Finals</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
                                           type="checkbox"
                                           id="third_place_match"
                                    />
                                    <label htmlFor="third_place_match">Third Place Match</label>
                                </div>
                                <div>
                                    <input style={{marginLeft: '0'}}
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
        newTournament.start_date = event.target.start_date.value;
        newTournament.end_date = event.target.end_date.value;
        newTournament.count_teams = event.target.count_teams.value;
        newTournament.group_stage = event.target.group_stage.checked;
        newTournament.second_group_stage = event.target.second_group_stage.checked;
        newTournament.final_round = event.target.final_round.checked;
        newTournament.round_of_16 = event.target.round_of_16.checked;
        newTournament.quarter_finals = event.target.quarter_finals.checked;
        newTournament.semi_finals = event.target.semi_finals.checked;
        newTournament.third_place_match = event.target.third_place_match.checked;
        newTournament.final = event.target.final.checked;

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

    function toDateFormat(date) {
        return new Date(date).toISOString().slice(0, 10);
    }

    return (
        <div className="tournament">
            <div className="tournament-details">
                {!isEditing ? (
                    <>
                        <h3 onClick={handleClick} style={{cursor: 'pointer'}}>{tournament.tournament_name}</h3>
                        <p style= {{padding: 0, margin: 0}}>Host: {tournament.host_country}</p>
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
                            placeholder={tournament.tournament_name}
                            defaultValue={tournament.tournament_name}
                        />
                        <label htmlFor="winner">Winner</label>
                        <input
                            type="text"
                            id="winner"
                            placeholder={tournament.winner}
                            defaultValue={tournament.winner}
                        />
                        <label htmlFor="host_country">Host Country</label>
                        <input
                            type="text"
                            id="host_country"
                            placeholder={tournament.host_country}
                            defaultValue={tournament.host_country}
                        />
                        <label htmlFor="year">Year</label>
                        <input
                            type="text"
                            id="year"
                            placeholder={tournament.year}
                            defaultValue={tournament.year}
                        />
                        <label htmlFor="start_date">Start Date</label>
                        <input
                            type="date"
                            id="start_date"
                            placeholder={tournament.start_date}
                            defaultValue={toDateFormat(tournament.start_date)}
                        />
                        <label htmlFor="end_date">End Date</label>
                        <input
                            type="date"
                            id="end_date"
                            placeholder={tournament.end_date}
                            defaultValue={toDateFormat(tournament.end_date)}
                        />
                        <label htmlFor="count_teams">Count Teams</label>
                        <input
                            type="number"
                            id="count_teams"
                            placeholder={tournament.count_teams}
                            defaultValue={tournament.count_teams}
                        />
                        <div className="checkboxes">
                            <div>
                                <label htmlFor="group_stage">Group Stage</label>
                                <input
                                    type="checkbox"
                                    id="group_stage"
                                    placeholder={tournament.group_stage}
                                    defaultChecked={tournament.group_stage === 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="second_group_stage">Second Group Stage</label>
                                <input
                                    type="checkbox"
                                    id="second_group_stage"
                                    placeholder={tournament.second_group_stage}
                                    defaultChecked={tournament.second_group_stage === 1}
                                />
                            </div>

                            <div>
                                <label htmlFor="final_round">Final Round</label>
                                <input
                                    type="checkbox"
                                    id="final_round"
                                    placeholder={tournament.final_round}
                                    defaultChecked={tournament.final_round === 1}
                                />
                            </div>

                            <div>
                                <label htmlFor="round_of_16">Round of 16</label>
                                <input
                                    type="checkbox"
                                    id="round_of_16"
                                    placeholder={tournament.round_of_16}
                                    defaultChecked={tournament.round_of_16 === 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="quarter_finals">Quarter Finals</label>
                                <input
                                    type="checkbox"
                                    id="quarter_finals"
                                    placeholder={tournament.quarter_finals}
                                    defaultChecked={tournament.quarter_finals === 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="semi_finals">Semi Finals</label>
                                <input
                                    type="checkbox"
                                    id="semi_finals"
                                    placeholder={tournament.semi_finals}
                                    defaultChecked={tournament.semi_finals === 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="third_place_match">Third Place Match</label>
                                <input
                                    type="checkbox"
                                    id="third_place_match"
                                    placeholder={tournament.third_place_match}
                                    defaultChecked={tournament.third_place_match === 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="third_place_match">Final Match</label>
                                <input
                                    type="checkbox"
                                    id="final"
                                    defaultChecked={tournament.final === 1}
                                />
                            </div>
                        </div>
                        <button className="save-button" type="submit">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};
