import '../css/Tournament.css';
import {useEffect, useState} from "react";

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([])
    useEffect(() => {
        fetch('http://localhost:5000/')
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
        <>
            <div className="tournaments">
                <h1 style={style}>Tournaments</h1>
                {tournaments.sort((a,b) => {
                    if (a.year < b.year) {
                        return 1
                    }
                }).map(tournament => (
                    <Tournament key={tournament.id} {...tournament} />
                ))}
            </div>
        </>
    );
}

function Tournament(tournament){
    function handleFocus(e){
        e.target.classList.toggle("focus")
    }

    return (
        <div className="tournament" onFocus={handleFocus}>
            <h2>{tournament.year}</h2>
            <div className="tournament-details">
                <h3>{tournament.tournament_name}</h3>
                <p>Winner: {tournament.winner}</p>
            </div>
        </div>
    );
}
