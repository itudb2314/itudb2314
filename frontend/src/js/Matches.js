import React, { useEffect, useState } from 'react';
import '../css/Matches.css';

export default function Matches() {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/matches')
            .then((response) => response.json())
            .then((data) => {
                setMatches(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const style = {
        alignSelf: 'center',
        padding: '2rem 0 0 2rem',
    };

    return (
        <div className="matches">
            <h1 style={style}>Matches</h1>
            {matches.map((match) => (
                <Match key={match.match_id} {...match} />
            ))}
        </div>
    );
}

function Match(match) {
    return (
        <div>
            <h2>
                {match.match_stage} / {match.match_name}
            </h2>
            <div>
                <p>match_date: {match.match_date}</p>
                <p>match_time : {match.match_time}</p>
                <p>home_team_id: {match.home_team_id}</p>
                <p>away_team_id: {match.away_team_id}</p>
                <p>home_team_score: {match.home_team_score}</p>
                <p>away_team_score: {match.away_team_score}</p>
            </div>
        </div>
    );
}
