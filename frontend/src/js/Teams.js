import '../css/Tournament.css';
import '../css/Buttons.css';
import {useEffect, useState} from "react";

export default function Teams() {
    const [teams, setTeams] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/tournaments/teams')
            .then(response => response.json())
            .then(data => {
                setTeams(data)
                console.log(teams)
            })
    }, [])


    return (
        <div className='Teams'>
            <h2>
                jyfjyhfjytjy
            </h2>

            {teams.map(team => {
                <h2>{team.team_name}</h2>
            })}
        </div>
   );
}

function Team(t){
    return (
        <div className='Team'>
            <h2>
                {t.team_name}
            </h2>
        </div>
    );
}