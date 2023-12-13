import '../css/Tournament.css';
import '../css/Buttons.css';
import '../css/Filters.css';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as PropTypes from "prop-types";
import SearchBar from "./SearchBar";


export default function Awards() {
    const [awards, setAwards] = useState([])
    const [awardFilter, setAwardFilter] = useState('all')
    const [updateFilter, setUpdateFilter] = useState(false)
    const [tournamentFilter, setTournamentFilter] = useState('all')
    const [tournaments, setTournaments] = useState([])
    const [sort, setSort] = useState('tournament_name')

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

    }, [updateFilter]);

    function filterAwards(e) {
        if (e.target.value !== awardFilter) {
            setAwardFilter(e.target.value)
            setUpdateFilter(!updateFilter)
        }
    }

    function filterTournaments(e) {
        if (e.target.value !== tournamentFilter) {
            setTournamentFilter(e.target.value)
            setUpdateFilter(!updateFilter)
        }
    }

    function sortAwards(e) {
        if (e.target.value !== sort) {
            setSort(e.target.value)
            setUpdateFilter(!updateFilter)
        }
    }

    function searchAwards(e) {
        // Skip the search if the search bar is empty
        // instead get all the awards
        if (e.target.value === "") {
            setUpdateFilter(!updateFilter)
            return
        }

        fetch(`http://localhost:5000/awards/${tournamentFilter}/${awardFilter}/${sort}/${e.target.value}`)
            .then(response => response.json())
            .then(data => {
                setAwards(data)
            });
    }

    function updateAward(award) {
        fetch(`http://localhost:5000/awards/${award.award_id}/${award.tournament_id}/${award.player_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(award)
        })
            .then(response => response.json())
            .then(data => {
                setUpdateFilter(!updateFilter)
            });
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
                            <option value={tournament.tournament_id}>{tournament.tournament_name}</option>
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
                    <label>Search</label>
                    <SearchBar apiFunction={searchAwards}/>
                </div>
            </div>
            <div className="awards">
                {awards.map((award) => (
                        (<Award award={award} deleteAward={() => {}} tournaments={tournaments}/>)
                ))}
            </div>
        </div>
    );
}

function Award({award, deleteAward, tournaments}) {
    const [edit, setEdit] = useState(false)

    function updateAward() {

    }

    return (
                <div key={award.award_id + award.tournament_id}  className="award">
                    {(edit) ? (<EditAwards awards={award} tournaments={tournaments} setEdit={setEdit} updateAward={updateAward}/>) :
                    (
                        <>
                            <Link to={`/tournaments/${award.tournament_id}`}>
                                <h3>{award.tournament_name}</h3>
                            </Link>
                            <h3>{award.award_name}</h3>
                            <Link to={`/players/${award.player_id}`}>
                                <p>{award.player_name}</p>
                            </Link>
                            <div>
                                <button className="edit-button" onClick={() => {setEdit(!edit)}}>Edit</button>
                                <button className="delete-button-danas" onClick={deleteAward}>Delete</button>
                            </div>
                        </>
                    )}
                </div>
    )
}

function EditAwards({award, tournaments, setEdit, updateAward}) {
    const style = {
        color: "white",
        backgroundColor: "#282c34",
        border: "none"
    }
    return (
        <div>
            <form className="edit-form" style={style}>
                <div className="filter" style={{padding: 0, marginBottom: "5px", marginTop: 0}}>
                    <label>Award Name</label>
                    <div className="filter-block" style={{padding: 0, fontSize: "1em", paddingTop: "10px"}}>
                        <select className="filter-select">
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
                </div>
                <div className="filter" style={{padding: 0, marginBottom: "5px", marginTop: 0}}>
                    <label>Tournament</label>
                    <div className="filter-block" style={{padding: 0, fontSize: "1em", paddingTop: "10px"}}>
                        <select className="filter-select">
                            {tournaments.map((tournament) => (
                                <option value={tournament.tournament_id}>{tournament.tournament_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                    <div className="filter" style={{padding: 0, marginBottom: "5px", marginTop: 0}}>
                    <label style={{paddingBottom: "10px"}}>Player ID</label>
                    <input className="edit-form-input" type="text" placeholder="P-XXXX" style={{color: "white", margin: 0,
                    width: "80%"}}/>
                </div>
                <div>
                    <button className="edit-button" onClick={setEdit}>Cancel</button>
                    <button className="edit-button" onClick={updateAward}>Save</button>
                </div>
            </form>

        </div>
    )
}