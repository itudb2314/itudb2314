import React, { useEffect, useState } from 'react';
import '../css/Matches.css';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        Promise.all([ //fetching data from backend
            fetch('http://localhost:5000/matches').then((response) => response.json()),
            fetch('http://localhost:5000/goals').then((response) => response.json()),
        ])

        .then(([matches_data, goals_data]) => { //converting response to json])
            //process and set matches
            const tournament_matches = matches_data.reduce((tournament, match) => {
                const key = match.tournament_id;  //key based on which matches are grouped
                if(!tournament[key])   //check if array exits
                    tournament[key] = [];
                tournament[key].push(match);
                return tournament;
            }, {});  //initial value of tournament is an empty object
            setMatches(Object.values(tournament_matches)); //set matches to array of arrays of matches

            //process and set goals
            const match_goals = goals_data.reduce((match, goal) => {
                const key = goal.match_id;  //key based on which goals are grouped
                if(!match[key])   //check if array exits
                    match[key] = [];
                match[key].push(goal);
                return match;
            }, {});  //initial value of match is an empty object
            setGoals(match_goals); //set goals to array of arrays of goals
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        }); 
    }, []);

    const style = {
        margin: '2rem 0 2rem 0',
        color: 'reds',
    };

    return (
        <div className="matches">
            <h1>Matches</h1> 
            {matches.map((tournament_matches, i) => (
                <div key={i}>
                    <h2 style={style}>{tournament_matches[0].tournament_name}</h2>
                    {tournament_matches.map((match) => (
                        <Match key={match.match_id}  match={match} goals={goals[match.match_id]}/>
                    ))}
                </div>
            ))}
        </div>
    );
}

function Match({match, goals}) {
    const match_style = {
        border: '1px solid black',
        margin: '1rem',
        borderRadius: '50px',
        width: '75%',
    }
    return (
        <div style={match_style} className='center_div'>
            <h2 className = "match_header">
                {match.stage_name} 
            </h2>
            <div className='match_details'>
                <p className='team_names'>{match.home_team_name}</p>
                <p className='team_score'>{match.home_team_score}   -   {match.away_team_score}</p>
                <p className='team_names'>{match.away_team_name}</p>
            </div>
            <div className='match_statistics'>
                <div>
                {goals && goals
                .filter((goal) => goal.team_id === match.home_team_id)
                .map((goal, index) => (
                    <div key={index}>
                        <p>{goal.minute_label}  {goal.given_name}  {goals.family_name}</p>
                    </div>
                ))}
                </div>
                <div className='match_time'>
                    {match.penalty_shootout ?  (
                        <p className='match_time_item'>({match.home_team_score_penalties} - {match.away_team_score_penalties})</p>
                    ) : null}
                    <p className='match_time_item'>{match.match_time}</p>
                    <p className='match_time_item'>{match.stadium_name}</p>
                    <p className='match_time_item'>{match.city_name}</p>
                </div>
                <div>
                {goals && goals
                .filter((goal) => goal.team_id === match.away_team_id)
                .map((goal, index) => (
                    <div key={index}>
                        <p>{goal.minute_label}  {goal.given_name}  {goals.family_name}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}
