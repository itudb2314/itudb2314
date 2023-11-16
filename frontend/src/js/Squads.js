import '../css/Squads.css'; // Create a new CSS file for styling Squads
import { useEffect, useState } from 'react';

export default function Squads() {
    const [squads, setSquads] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/resources/squads/all')
            .then((response) => response.json())
            .then((data) => {
                setSquads(data);
            });
    }, []);

    const style = {
        alignSelf: 'center',
        padding: '2rem 0 0 2rem',
    };

    return (
        <div className="squads">
            <h1 style={style}>Squads</h1>
            {squads.map((squadGroup, index) => (
                <SquadGroup key={index} squadGroup={squadGroup} />
            ))}
        </div>
    );
}

function SquadGroup({ squadGroup }) {
    return (
        <div className="squad-group">
            {squadGroup.map((squad) => (
                <Squad key={squad.player_id} {...squad} />
            ))}
        </div>
    );
}

function Squad(squad) {
    return (
        <div className="squad">
            <h2>{squad.tournament_id}</h2>
            <div className="squad-details">
                <p>Team: {squad.team_id}</p>
                <p>Player: {squad.player_id}</p>
                <p>Shirt Number: {squad.shirt_number}</p>
                <p>Position: {squad.position_name}</p>
            </div>
        </div>
    );
}
