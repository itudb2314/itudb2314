import "../css/Groupstanding.css";
import React, { useEffect, useState } from 'react';

export default function Groupstandings() {
    const [allgroups, setgroupstanding] = useState([])

    useEffect(() => {
        fetch("http://localhost:5000/groupstandings")
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const sorted_data = data.sort((a, b) => (a.tournament_id || 0) - (b.tournament_id || 0));
                setgroupstanding(sorted_data);
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
                    <h2 style={{textAlign:'center'}}>
                        {alls.tournament_id}
                    </h2>
                    {alls.stagedlist.map(staged => (
                        <div style={{ textAlign: 'center' }} key={alls.tournament_id / staged.stage_number} className="stage-group">
                            <h3 style={{textAlign:'center'}}>
                                {staged.stage_name}
                            </h3>
                            {staged.grouplist.map(grouped => (
                                <div key={alls.tournament_id / staged.stage_number / grouped.group_name} className="group-group">
                                    <div className="table-div">
                                        <h4 style={{textAlign :'center'}}>
                                            {grouped.group_name}
                                        </h4>
                                    
                                        <div className="table-container">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Position</th>
                                                        <th>Team ID</th>
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
    team_id,
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
            <td>{team_id}</td>
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