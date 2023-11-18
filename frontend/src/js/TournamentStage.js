import '../css/Tournament.css';
import {useEffect, useState} from "react";

export default function TournamentStages() {
    const [tournaments, setTournaments] = useState([])
    useEffect(() => {
        fetch('http://localhost:5000/tournamet_stages')
            .then(response => response.json())
            .then(data => {
                setTournaments(data)
            })
    }, [])

    const style = {
        alignSelf: "center",
        padding: "0 0 0 2rem"
    }

    return (
        <div className="tournaments">
            <h1 style={style}>Tournaments</h1>
            {tournaments.sort((a,b) => {
                if (a.year < b.year) {
                    return 1
                }
                if (a.year > b.year) {
                    return -1
                }
                return 0
            }).map(stage => (
                <TournamentStage key={stage.year} {...stage} />
            ))}
        </div>
    );
}

function TournamentStage(tournamentStage){
    function handleFocus(e){
        e.target.classList.toggle("focus")
    }

    return (
        <div className="tournament_stage" onFocus={handleFocus}>
            <h2>{tournamentStage.stage_name}</h2>
        </div>
    );
}
