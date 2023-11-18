import '../css/Tournament.css';
import '../css/Buttons.css';
import {useEffect, useState} from "react";

export default function Tournaments() {
    const [tournaments, setTournaments] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)

    useEffect(() => {
        fetch('http://localhost:5000/tournaments')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setTournaments(data)
            })
    }, [deleteTrigger])

    const deleteTournament = (tournament) => {
        fetch('http://localhost:5000/tournaments', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tournament.tournament_id),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger)
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

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
            }).map(tournament => (
                <Tournament key={tournament.year} t={tournament} deleteHandle={deleteTournament}/>
            ))}
        </div>
    );
}

const Tournament = ({t, deleteHandle}) => {
    const [tournament, setTournament] = useState(t);

    const [isEditing, setIsEditing] = useState(false);
    const editTournament = () => setIsEditing(true);
    const submitForm = (event) => {
        event.preventDefault();
        const newTournament = {...tournament};
        newTournament.tournament_name = event.target.tournament_name.value;
        newTournament.winner = event.target.winner.value;
        newTournament.host_country = event.target.host_country.value;
        newTournament.year = event.target.year.value;

        fetch('http://localhost:5000/tournaments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTournament}),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setTournament(newTournament);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        setIsEditing(false);
    }

    const deleteTournament = () => {
        deleteHandle(tournament);
    }

    return (
        <div className="tournament">
            <div className="tournament-details">
                {!isEditing ? (
                    <>
                        <h3>{tournament.tournament_name}</h3>
                        <p>Winner: {tournament.winner}</p>
                        <div className="buttons">
                            <button className="edit-button" onClick={editTournament}>Edit</button>
                            <button className="delete-button" onClick={deleteTournament}>Delete</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submitForm}>
                        <label htmlFor="tournament_name">Tournament Name</label>
                        <input
                            type="text"
                            id="tournament_name"
                            defaultValue={tournament.tournament_name}
                        />
                        <label htmlFor="winner">Winner</label>
                        <input
                            type="text"
                            id="winner"
                            defaultValue={tournament.winner}
                        />
                        <label htmlFor="host_country">Host Country</label>
                        <input
                            type="text"
                            id="host_country"
                            defaultValue={tournament.host_country}
                        />
                        <label htmlFor="year">Label</label>
                        <input
                            type="text"
                            id="year"
                            defaultValue={tournament.year}
                        />
                        <button className="save-button" type="submit">Save</button>
                    </form>
                )}
            </div>
        </div>
    );
};
