import React from "react";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useHistory} from "react-router-dom";
import '../css/Teams.css';
import '../css/Buttons.css';
import '../css/Filters.css';
import {Link} from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Teamstats() {
    const [teamstat, setTeamstats] = useState([])
    const [tournamentFilter, setTournamentFilter] = useState('all');
    const [update, setUpdate] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetch(`http://localhost:5000/team_stats/${id}/${tournamentFilter}`)
            .then(response => response.json())
            .then(data => {
                setTeamstats(data);
            })

        fetch(`http://localhost:5000/tournaments`)
            .then(response => response.json())
            .then(data => {
                setTournaments(data);
            });
    }, [id, tournamentFilter, update])

    function filterTournaments(e) {
        if (e.target.value !== tournamentFilter) {
            setTournamentFilter(e.target.value);
            setUpdate(!update);
        }
    }

    return (
        <div>
            <div className="filter-block">
                <div className="filter">
                    <label>Tournament</label>
                    <select className="filter_select" onChange={filterTournaments}>
                        <option value="all">All</option>
                        {tournaments.map((tournament) => (
                            <option key={tournament.tournament_id} value={tournament.tournament_id}>{tournament.tournament_name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <h1>Team Stats</h1>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">Team ID</th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Tournament ID</th>
                    <th scope="col">Award Count</th>
                    <th scope="col">Number of Goals</th>
                    <th scope="col">Number of Wins</th>
                    <th scope="col">Number of Draws</th>
                    <th scope="col">Number of Losses</th>
                </tr>
                </thead>
                <tbody>
                    {teamstat.map((teamstat) =>
                    <tr key={teamstat.team_id + teamstat.tournament_id}>
                        <td>{teamstat.team_id}</td>
                        <td>{teamstat.team_name}</td>
                        <td>{teamstat.tournament_id}</td>
                        <td>{teamstat.award_count}</td>
                        <td>{teamstat.number_of_goals}</td>
                        <td>{teamstat.number_of_wins}</td>
                        <td>{teamstat.number_of_draws}</td>
                        <td>{teamstat.number_of_losses}</td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}