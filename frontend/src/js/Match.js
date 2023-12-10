import React, { useState } from "react";
import '../css/Matches.css';
import { useHistory } from "react-router-dom";

export default function Match({ match, goals, setMatchDeleted }) {
    const history = useHistory();
    const [deleting, setDeleting] = useState(false);

    const handleDeleteMatch = () => {
        try {
            setDeleting(true);
            deleteMatchbyID(match.match_id);
            setDeleting(false);
        }
        catch (error) {
            console.error('Error:', error);
            setDeleting(false);
        }
    }

    const deleteMatchbyID = async (match_id) => {
        fetch(`http://localhost:5000/matches/${match_id}`, {
            method: 'DELETE',
            headers: {
                'Const-Type': 'application/json',
            },
            body: JSON.stringify({ match_id }),
        }).then((response) => response.json())
            .then(() => {
                setMatchDeleted();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setMatchDeleted();
    };

    const match_style = {
        border: '1px solid black',
        margin: '1rem',
        borderRadius: '50px',
        width: '75%',
    }

    function handleHomeTeamClick(match) {
        history.push(`/squads/${match.tournament_id}/${match.home_team_id}`);
    }
    function handleAwayTeamClick(match) {
        history.push(`/squads/${match.tournament_id}/${match.away_team_id}`);
    }

    return (
        <div style={match_style} className='center_div'>
            <h2 className="match_header">
                {match.stage_name}
            </h2>
            <div className='match_details'>
                <p className='team_names' onClick={() => handleHomeTeamClick(match)} style={{ cursor: 'pointer' }}>
                    {match.home_team_name}
                </p>
                <p className='team_score'>{match.home_team_score}   -   {match.away_team_score}</p>
                <p className='team_names' onClick={() => handleAwayTeamClick(match)} style={{ cursor: 'pointer' }}>
                    {match.away_team_name}
                </p>
            </div>
            <div className='match_statistics'>
                <div className='match_goals'>
                    {goals && goals
                        .filter((goal) => goal.team_id === match.home_team_id)
                        .map((goal, index) => (
                            <div key={index}>
                                <p>{goal.minute_label}  {goal.given_name}  {goal.family_name}</p>
                            </div>
                        ))}
                </div>
                <div className='match_time'>
                    {match.penalty_shootout ? (
                        <p className='match_time_item'>({match.home_team_score_penalties} - {match.away_team_score_penalties})</p>
                    ) : null}
                    <p className='match_time_item'>{match.match_time}</p>
                    <p className='match_time_item'>{match.stadium_name}</p>
                    <p className='match_time_item'>{match.city_name}</p>
                </div>
                <div className='match_goals'>
                    {goals && goals
                        .filter((goal) => goal.team_id === match.away_team_id)
                        .map((goal, index) => (
                            <div key={index}>
                                <p>{goal.minute_label}  {goal.given_name}  {goal.family_name}</p>
                            </div>
                        ))}
                </div>
            </div>
            <button onClick={handleDeleteMatch} disabled={deleting} className='delete-button-danas'>
                {deleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
}
