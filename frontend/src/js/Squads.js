import React, { useEffect, useState } from 'react';
import '../css/Squads.css';

export default function Squads() {
    const [squads, setSquads] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/squads')
            .then((response) => response.json())
            .then((data) => {
                setSquads(data);
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
        <div className="squads">
            <h1 style={style}>Squads</h1>
            {squads.map((actualSquad) => (
                <div key={`${actualSquad.tournament_id}-${actualSquad.team_id}`} className="squad-group">
                    <h2>
                        {actualSquad.tournament_id} / {actualSquad.team_id}
                    </h2>
                    {actualSquad.squad.map((squad) => (
                        <Squad key={squad.player_id} {...squad} />
                    ))}
                </div>
            ))}
        </div>
    );
}

function Squad({ player_id, team_id, shirt_number, position_name }) {
    return (
        <div className="squad">
            <div className="squad-details">
                <p>Player: {player_id}</p>
                <p>Shirt Number: {shirt_number}</p>
                <p>Position: {position_name}</p>
            </div>
        </div>
    );
}
