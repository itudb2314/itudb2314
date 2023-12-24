import React, { useEffect, useState } from 'react';
import '../css/Buttons.css';

export default function Group_standings() {

    const [group_standings, setGroup_standings] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false);
    const [editTrigger, setEditTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [ tournaments, setTournaments ] = useState([]);
    const [ teams, setTeams ] = useState([]);
    

    useEffect(() => {
        fetch('http://localhost:5000/group_standings')
            .then(response => response.json())
            .then(data => {
                setGroup_standings(data)
                console.log(group_standings)
            })
    }, [deleteTrigger, addTrigger, editTrigger])

    useEffect(() => {
        fetch('http://localhost:5000/tournaments')
            .then(response => response.json())
            .then(data => {
                setTournaments(data)
                console.log(tournaments)
            })  
    }, [])

    useEffect(() => {
        fetch('http://localhost:5000/tournaments/teams')
            .then(response => response.json())
            .then(data => {
                setTeams(data)
                console.log(teams)
            })
    }, [])



    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    function editGroup_standings(e) {
        setIsEditing(e);
        toggleModal();
    }

    function saveGroup_standings(e) {
        e.preventDefault();
        const updated = {
            tournament_id: e.target.elements.tournament_id.value,
            stage_number: e.target.elements.stage_number.value,
            stage_name: e.target.elements.stage_name.value,
            group_name: e.target.elements.group_name.value,
            position: e.target.elements.position.value,
            team_id: e.target.elements.team_id.value,
            played: e.target.elements.played.value,
            wins: e.target.elements.wins.value,
            draws: e.target.elements.draws.value,
            losses: e.target.elements.losses.value,
            goals_for: e.target.elements.goals_for.value,
            goals_against: e.target.elements.goals_against.value,
            goal_difference: e.target.elements.goal_difference.value,
            points: e.target.elements.points.value,
            advanced: e.target.elements.advanced.value,
        }

        fetch('http://localhost:5000/group_standings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updated }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setEditTrigger(!editTrigger);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

            setModalVisible(false);
            setAddTrigger(!addTrigger);

        }

    function addGroup_standings(e) {
        e.preventDefault();
        const newGroup_standings = {
            tournament_id: e.target.elements.tournament_id.value,
            stage_number: e.target.elements.stage_number.value,
            stage_name: e.target.elements.stage_name.value,
            group_name: e.target.elements.group_name.value,
            team_id: e.target.elements.team_id.value,
            played: e.target.elements.played.value,
            wins: e.target.elements.wins.value,
            draws: e.target.elements.draws.value,
            losses: e.target.elements.losses.value,
            goals_for: e.target.elements.goals_for.value,
            goals_against: e.target.elements.goals_against.value,
            goal_difference: e.target.elements.goal_difference.value,
            points: e.target.elements.points.value,
            position: e.target.elements.position.value
        }

        fetch('http://localhost:5000/group_standings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newGroup_standings }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setAddTrigger(!addTrigger);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        setModalVisible(false);
        setAddTrigger(!addTrigger);
    }

    function deleteGroup_standings(group_standing) {
        fetch('http://localhost:5000/group_standings', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({tournament_id: group_standing.tournament_id, stage_number: group_standing.stage_number, group_name: group_standing.group_name, position: group_standing.position}) ,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Delete successful:', data);
                setDeleteTrigger(!deleteTrigger);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    //satır satır çıktı yazavağım
    const style = {
        alignSelf: "center",
        padding: "0 0 0 2rem",
        textAlign: "center"
    }

    return (
        <div className='g_s'>
            <h1 style={style}  >Group Standings</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Tournament ID</th>
                        <th>Stage Name</th>
                        <th>Group Name</th>
                        <th>Team ID</th>
                        <th>Played</th>
                        <th>Wins</th>
                        <th>Draws</th>
                        <th>Losses</th>
                        <th>Goals For</th>
                        <th>Goals Against</th>
                        <th>Goal Diffirance</th>
                        <th>Points</th>
                        <th>Position</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {group_standings.map(group_standing => (
                        <tr key={group_standing.group_name + group_standing.tournament_id + group_standing.stage_number + group_standing.position}>
                            <td>{group_standing.tournament_id}</td>
                            <td>{group_standing.stage_name}</td>
                            <td>{group_standing.group_name}</td>
                            <td>{group_standing.team_id}</td>
                            <td>{group_standing.played}</td>
                            <td>{group_standing.wins}</td>
                            <td>{group_standing.draws}</td>
                            <td>{group_standing.losses}</td>
                            <td>{group_standing.goals_for}</td>
                            <td>{group_standing.goals_against}</td>
                            <td>{group_standing.goal_difference}</td>
                            <td>{group_standing.points}</td>
                            <td>{group_standing.position}</td>
                            <td>
                                <button className='edit-button' onClick={() => editGroup_standings(group_standing) }>Edit</button>
                                <button className='delete-button-danas' onClick={() => deleteGroup_standings(group_standing)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className='add-button' onClick={toggleModal}>Add Group Standings</button>
            {modalVisible &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => {toggleModal(); setIsEditing(0)}}>&times;</span>
                        {!isEditing ? (
                            <form onSubmit={(e) => addGroup_standings(e)}>
                                <label htmlFor="tournament_id">Tournament:</label>
                                <select id="tournament_id" name="tournament_id">
                                    <option>All</option>
                                    {tournaments.map(tournament => (
                                        <option key={tournament.tournament_id} value={tournament.tournament_id}>{tournament.tournament_name}</option>
                                    ))}
                                </select>
                                <label htmlFor="stage_number">Stage Number:</label>
                                <input type="number" id="stage_number" name="stage_number" required/>
                                <label htmlFor="stage_name">Stage Name:</label>
                                <input type="text" id="stage_name" name="stage_name" required />
                                <label htmlFor="group_name">Group Name:</label>
                                <input type="text" id="group_name" name="group_name" required />
                                <label htmlFor="team_id">Team ID:</label>
                                <select id="team_id" name="team_id">
                                    <option>All</option>
                                    {teams.map(team => (
                                        <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                                    ))}
                                </select>
                                <label htmlFor="played">Played:</label>
                                <input type="number" id="played" name="played" required />
                                <label htmlFor="wins">Wins:</label>
                                <input type="number" id="wins" name="wins"required />
                                <label htmlFor="draws">Draws:</label>
                                <input type="number" id="draws" name="draws" required />
                                <label htmlFor="losses">Losses:</label>
                                <input type="number" id="losses" name="losses" required/>
                                <label htmlFor="goals_for">Goals For:</label>
                                <input type="number" id="goals_for" name="goals_for" required />
                                <label htmlFor="goals_against">Goals Against:</label>
                                <input type="number" id="goals_against" name="goals_against" required />
                                <label htmlFor="goal_difference">Goal Difference:</label>
                                <input type="number" id="goal_difference" name="goal_difference" required />
                                <label htmlFor="points">Points:</label>
                                <input type="number" id="points" name="points" required />
                                <label htmlFor="position">Position:</label>
                                <input type="number" id="position" name="position" required />
                                <button type="submit">Add</button>
                            </form>
                        ) : (
                            
                            <form onSubmit={(e) => saveGroup_standings(e)}>
                                
                                <input type="hidden" id="tournament_id" name="tournament_id" value={isEditing.tournament_id} required />
                                <input type="hidden" id="stage_number" name="stage_number" value={isEditing.stage_number} required />
                                <input type="hidden" id="stage_name" name="stage_name" value={isEditing.stage_name}  required/>
                                <input type="hidden" id="group_name" name="group_name" value={isEditing.group_name} required/>
                                <input type="hidden" id="position" name="position" defaultValue={isEditing.position} required/>
                                <input type="hidden" id="advanced" name="advanced" defaultValue={isEditing.advanced}  required/>
                                

                                <label htmlFor="team_id">Team ID:</label>
                                <select id="team_id" name="team_id">
                                    <option>All</option>
                                    {teams.map(team => (
                                        <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
                                    ))}
                                </select>
                                
                                <label htmlFor="played">Played:</label>
                                <input type="number" id="played" name="played" defaultValue={isEditing.played} />
                                <label htmlFor="wins">Wins:</label>
                                <input type="number" id="wins" name="wins" defaultValue={isEditing.wins} />
                                <label htmlFor="draws">Draws:</label>
                                <input type="number" id="draws" name="draws" defaultValue={isEditing.draws} />
                                <label htmlFor="losses">Losses:</label>
                                <input type="number" id="losses" name="losses" defaultValue={isEditing.losses}/>
                                <label htmlFor="goals_for">Goals For:</label>
                                <input type="number" id="goals_for" name="goals_for" defaultValue={isEditing.goals_for} />
                                <label htmlFor="goals_against">Goals Against:</label> 
                                <input type="number" id="goals_against" name="goals_against" defaultValue={isEditing.goals_against} />
                                <label htmlFor="goal_difference">Goal Difference:</label>
                                <input type="number" id="goal_difference" name="goal_difference" defaultValue={isEditing.goal_difference} />
                                <label htmlFor="points">Points:</label>
                                
                                <input type="number" id="points" name="points" defaultValue={isEditing.points}/>
                                
                                <button type="submit">Save</button>
                            </form>
                            
                        )}
                    </div>
                </div>
            }

        </div>

    );
}

