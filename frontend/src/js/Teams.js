import '../css/Teams.css';
import '../css/Buttons.css';
import {useEffect, useState} from "react";

export default function Teams() {
    const [teams, setTeams] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)

    useEffect(() => {
        fetch('http://localhost:5000/tournaments/teams')
            .then(response => response.json())
            .then(data => {
                setTeams(data)
                console.log(teams)
            })
    }, [deleteTrigger])



    function deleteTeam(team) {
        fetch('http://localhost:5000/tournaments/teams', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team.team_id),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger)
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }


    return (
    <div className='teams'>
        {teams.map(team => (
            <Team key={team.team_id} t={team}/>
        ))}
    </div>
);
}


function Team({t}){
    const [team, setTeam] = useState(t);
    const [isEditing, setIsEditing] = useState(false);

    function editTeam() { setIsEditing(true)}
    
    function deleteTeam() {}
    
    function submitTeam(e) {
        e.preventDefault();
        setIsEditing(false);
        const newTeam = {...team};
        newTeam.team_name = e.target.team_name.value;
        newTeam.team_code = e.target.team_code.value;
        newTeam.confederation_id= e.target.confederation_id.value;
        newTeam.federation_wikipedia_link = e.target.federation_wikipedia_link.value;

        fetch('http://localhost:5000/tournaments/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTeam}),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setTeam(newTeam);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        setIsEditing(false);
    }

    return (
        <div className='team'>
            {isEditing ? (
                <div className='edit-form' onSubmit={submitTeam}>
                    <form>
                        <label htmlFor="team_name">Team Name</label>
                        <input id='team_name' type="text" defaultValue={team.team_name}/>
                        <label htmlFor="team_code">Team Code</label>
                        <input id='team_code'type="text" defaultValue={team.team_code}/>
                        <label htmlFor="confederation_id">Confederation ID</label>
                        <input id='confederation_id'type="text" defaultValue={team.confederation_id}/>
                        <label htmlFor="federation_wikipedia_link">Federation Wikipedia Link</label>
                        <input id='federation_wikipedia_link'type="text" defaultValue={team.federation_wikipedia_link}/>
                        <button className="save-button" type='submit'>Save</button>
                    </form>
                </div>
            ) : (
            <>
            <h3>
                {team.team_name}
            </h3>
            <h3>
                {team.team_id}
            </h3>
            <p>({team.team_code})</p>
            <a href={team.mens_team_wikipedia_link}></a>
            {team.mens_team ? (
                <a href={team.mens_team_wikipedia_link}>Mens' National Team</a>
            ) : (
                <a href={team.womens_team_wikipedia_link}>Womens' National Team</a>
            )
            }
            <div className='buttons'>
                <button className="edit-button" onClick={editTeam}>Edit</button>
                <button className="delete-button" onClick={deleteTeam}>Delete</button>
            </div>
            </>
            )}
        </div>
    );
}