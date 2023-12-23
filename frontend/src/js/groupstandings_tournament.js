import "../css/Groups_and_standing.css";
import {Link, useParams} from "react-router-dom";

import React, { useEffect, useState } from 'react';

export default function Groupstanding_tournament() {
    const [allgroups, setgroupstandings] = useState([])
    const { id } = useParams();


    useEffect(() => {
        fetch(`http://localhost:5000/groupstanding/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setgroupstandings(data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    return (
        <div className="groupstanding">
            <h1 style={{ textAlign: "center" }}>Group Standings</h1>
            {allgroups.map(alls => (
                <div key={alls.tournament_id} className="tournament-group">
                    {alls.stagedlist.map(staged => (
                        <div style={{ textAlign: 'center' }} key={alls.tournament_id / staged.stage_number} className="stage-group">
                            {staged.grouplist.map(grouped => (
                                <div key={alls.tournament_id / staged.stage_number / grouped.group_name} className="group-group">
                                    <div className="table-div">
                                        <h4 style={{ textAlign: 'center' }}>
                                            {grouped.group_name}
                                        </h4>

                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Position</th>
                                                        <th>Team</th>
                                                        <th>P</th>
                                                        <th>W</th>
                                                        <th>D</th>
                                                        <th>L</th>
                                                        <th>GF</th>
                                                        <th>GA</th>
                                                        <th>GD</th>
                                                        <th>Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {grouped.group_standings.map(groupstanding => (
                                                        <Groupstanding key={groupstanding.tournament_id / groupstanding.stage_number / groupstanding.group_name} {...groupstanding} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function Groupstanding({
    position,
    team_name,
    played,
    wins,
    draws,
    losses,
    goals_for,
    goals_against,
    goal_difference,
    points,
    advanced,
}) {
    return (
        <tr>
            <td>{position}</td>
            <td>{team_name}</td>
            <td>{played}</td>
            <td>{wins}</td>
            <td>{draws}</td>
            <td>{losses}</td>
            <td>{goals_for}</td>
            <td>{goals_against}</td>
            <td>{goal_difference}</td>
            <td>{points}</td>
        </tr>
    );
}