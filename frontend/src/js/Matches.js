import React, { useEffect, useState } from 'react';
import '../css/Matches.css';

export default function Matches() {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/matches') //fetching data from backend
            .then((response) => response.json()) //converting response to json
            .then((data) => {  //data is the json response
                //grouping matches
                const tournament_matches = data.reduce((tournament, match) => {
                    const key = match.tournament_id;  //key based on which matches are grouped
                    if(!tournament[key])   //check if array exits
                        tournament[key] = [];
                    tournament[key].push(match);
                    return tournament;
                }, {});  //initial value of tournament is an empty object
                const matches_array = Object.values(tournament_matches); //converting object to array
                setMatches(matches_array);
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
                        <Match key={match.match_id} {...match} />
                    ))}
                </div>
            ))}
        </div>
    );
}

function Match(match) {
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
            <div className='match_time'>
                {match.penalty_shootout ?  (
                    <p className='match_time_item'>({match.home_team_score_penalties} - {match.away_team_score_penalties})</p>
                ) : null}
                <p className='match_time_item'>{match.match_time}</p>
                <p className='match_time_item'>{match.stadium_name}</p>
                <p className='match_time_item'>{match.city_name}</p>
            </div>
        </div>
    );
}
