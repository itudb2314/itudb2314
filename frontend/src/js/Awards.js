import '../css/Tournament.css';
import '../css/Buttons.css';
import '../css/Filters.css';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";


export default function Awards() {
    const [awards, setAwards] = useState([])
    const [awardFilter, setAwardFilter] = useState('all')
    const [updateFilter, setUpdateFilter] = useState(false)
    const [tournamentFilter, setTournamentFilter] = useState('all')
    const [tournaments, setTournaments] = useState([])

    useEffect(() => {
        fetch(`http://localhost:5000/awards/${tournamentFilter}/${awardFilter}`)
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
            </div>
            <div className="awards">
                {awards.map((award) => (
                    <Award award={award}/>
                ))}
            </div>
        </div>
    );
}

function Award({award}) {
    return (
        <div key={award.award_id + award.tournament_id}  className="award">
            <Link to={`/tournaments/${award.tournament_id}`}>
                <h3>{award.tournament_name}</h3>
            </Link>
                <h3>{award.award_name}</h3>
            <Link to={`/players/${award.player_id}`}>
                <p>{award.player_name}</p>
            </Link>
        </div>
    )
}