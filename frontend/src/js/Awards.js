import '../css/Tournament.css';
import '../css/Buttons.css';
import '../css/Filters.css';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar";


export default function Awards() {
    const [awards, setAwards] = useState([])
    const [awardFilter, setAwardFilter] = useState('all')
    const [update, setUpdate] = useState(false)
    const [tournamentFilter, setTournamentFilter] = useState('all')
    const [tournaments, setTournaments] = useState([])
    const [sort, setSort] = useState('tournament_name')
    const [addModal, setAddModal] = useState(false)

    useEffect(() => {
        fetch(`http://localhost:5000/awards/${tournamentFilter}/${awardFilter}/${sort}`)
            .then(response => response.json())
            .then(data => {
                setAwards(data)
            });

        fetch(`http://localhost:5000/tournaments`)
            .then(response => response.json())
            .then(data => {
                setTournaments(data)
            });

    }, [update]);

    function filterAwards(e) {
        if (e.target.value !== awardFilter) {
            setAwardFilter(e.target.value)
            setUpdate(!update)
        }
    }

    function filterTournaments(e) {
        if (e.target.value !== tournamentFilter) {
            setTournamentFilter(e.target.value)
            setUpdate(!update)
        }
    }

    function sortAwards(e) {
        if (e.target.value !== sort) {
            setSort(e.target.value)
            setUpdate(!update)
        }
    }

    function searchAwards(e) {
        // Skip the search if the search bar is empty
        // instead get all the awards
        if (e.target.value === "") {
            setUpdate(!update)
            return
        }

        fetch(`http://localhost:5000/awards/${tournamentFilter}/${awardFilter}/${sort}/${e.target.value}`)
            .then(response => response.json())
            .then(data => {
                setAwards(data)
            });
    }

    function addAward(e) {
        e.preventDefault()
        const newAward = {
            award_id: e.target[0].value,
            tournament_id: e.target[1].value,
            player_id: e.target[2].value,
            team_id: e.target[3].value
        }

        console.log(newAward)

        fetch(`http://localhost:5000/awards`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAward)
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setUpdate(!update)
            })
        setAddModal(!addModal)
        setUpdate(!update)
    }

    function cancelAdd() {
        console.log("cancel")
        setAddModal(!addModal)
    }

    return (
        <div>
            <div className="filter-block">
                <div className="filter">
                    <label>Award Name</label>
                    <select className="filter_select" onChange={filterAwards}>
                        <option value="all">All</option>
                        <option value="golden_boot">Golden Boot</option>
                        <option value="golden_ball">Golden Ball</option>
                        <option value="golden_glove">Golden Glove</option>
                        <option value="silver_ball">Silver Ball</option>
                        <option value="silver_boot">Silver Boot</option>
                        <option value="bronze_ball">Bronze Ball</option>
                        <option value="bronze_boot">Bronze Boot</option>
                        <option value="best_young_player">Best Young Player</option>
                    </select>
                </div>
                <div className="filter">
                    <label>Tournament</label>
                    <select className="filter_select" onChange={filterTournaments}>
                        <option value="all">All</option>
                        {tournaments.map((tournament) => (
                            <option key={tournament.tournament_id} value={tournament.tournament_id}>{tournament.tournament_name}</option>
                        ))}
                    </select>
                </div>
                <div className="filter">
                    <label>Sort By</label>
                    <select className="filter_select" onChange={sortAwards}>
                        <option value="tournament_name">Tournament Name</option>
                        <option value="award_name">Award Name</option>
                        <option value="player_name">Player Name</option>
                    </select>
                </div>
                <div className="filter">
                    <label>Search Player</label>
                    <SearchBar apiFunction={searchAwards}/>
                </div>
            </div>
            <div className="awards">
                {awards.length === 0 && <h1>No Awards Found</h1>}
                {awards.map((award) => (
                        (<Award key={award.award_id + award.tournament_id + award.player_name} award={award}
                                update={() => setUpdate(!update)}/>)
                ))}
            </div>
            <button className="add-button" onClick={() => {setAddModal(true)}}>+ Add Award</button>
            {addModal &&
                <AddAwards tournaments={tournaments} addAward={addAward} cancel={cancelAdd}/>}
        </div>
    );
}

function Award({award, update}) {
    function deleteAward() {
        fetch(`http://localhost:5000/awards/${award.tournament_id}/${award.award_id}/${award.player_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json())
            .then(data => {
                update()
            })
    }

    return (
        <div key={award.award_id + award.tournament_id}  className="award">
            <Link to={`/tournaments/${award.tournament_id}`}>
                <h3>{award.tournament_name}</h3>
            </Link>
            <h3>{award.award_name}</h3>
            <Link to={`/players/${award.player_id}`}>
                <p>{award.player_name}</p>
            </Link>
            <div>
                <button className="delete-button-danas" onClick={deleteAward}>Delete</button>
            </div>
        </div>
    )
}

function AddAwards({tournaments, addAward, cancel}) {
    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={addAward} style={{height: "350px"}}>
                    <label>Award Name</label>
                    <select className="edit-select">
                        <option value="A-1">Golden Ball</option>
                        <option value="A-2">Silver Ball</option>
                        <option value="A-3">Bronze Ball</option>
                        <option value="A-4">Golden Boot</option>
                        <option value="A-5">Silver Boot</option>
                        <option value="A-6">Bronze Boot</option>
                        <option value="A-7">Golden Glove</option>
                        <option value="A-8">Best Young Player</option>
                    </select>
                    <label style={{marginTop: "10px"}}>Tournament</label>
                    <select className="edit-select">
                        {tournaments.map((tournament) => (
                            <option key={tournament.tournament_id} value={tournament.tournament_id}>{tournament.tournament_name}</option>
                        ))}
                    </select>
                    <label style={{marginTop: "10px"}}>Player ID</label>
                    <input style={{height: "50%"}} type="text" placeholder="P-XXXX" required={true}/>
                    <label >Team ID</label>
                    <input style={{height: "50%"}} type="text" placeholder="T-XX" required={true}/>
                    <div style={{alignSelf: "flex-end"}} className="buttons">
                        <button className="save-button" type="submit">Save</button>
                        <button className="save-button" type="button" onClick={cancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>

    )
}
