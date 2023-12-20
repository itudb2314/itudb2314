import '../css/Teams.css';
import '../css/Buttons.css';
import {useEffect, useState} from "react";
import getCountryISO2 from 'country-iso-3-to-2';
import { SearchBar } from '../components/searchteam';
import {useHistory} from "react-router-dom";


export default function Teams() {
    const [teams, setTeams] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [confederations, setConfederations] = useState([]);
    const[filteredTeams, setFilteredTeams] = useState([]);

    const updateSearchResults = (results) => {
        setFilteredTeams(results);
    };


    useEffect(() => {
        fetch('http://localhost:5000/tournaments/teams')
            .then(response => response.json())
            .then(data => {
                setTeams(data);
                setFilteredTeams(data);
            })

        // Fetch the confederation names from the API
        fetch('http://localhost:5000/confederations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => {
                setConfederations(data);
                console.log(confederations)
            })
            .catch((error) => {
                console.log('Error:', error);
            });

    }, [deleteTrigger, addTrigger])

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    function addTeam(e) {
        e.preventDefault();
        const newTeam = {
            team_id: e.target.team_id.value,
            team_name: e.target.team_name.value,
            team_code: e.target.team_code.value,
            confederation_id: e.target.confederation_id.value,
            federation_wikipedia_link: e.target.federation_wikipedia_link.value,
            mens_team_wikipedia_link: e.target.mens_team_wikipedia_link.value,
            womens_team_wikipedia_link: e.target.womens_team_wikipedia_link.value,
            womens_team: e.target.womens_team.checked,
            mens_team: e.target.mens_team.checked,
            federation_name: e.target.federation_name.value,
            region_name: e.target.region_name.value,
        }

        fetch('http://localhost:5000/tournaments/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTeam}),
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setAddTrigger(!addTrigger)
                toggleModal()
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    }

    function deleteTeam(team) {
        fetch('http://localhost:5000/tournaments/teams', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ team_id: team.team_id }),
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
    


    return (
    <div className='teams'>
        <SearchBar setResults={updateSearchResults} />
        <button className="add-button" onClick={toggleModal}>+ Add Team</button>
        {modalVisible && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={toggleModal}>&times;</span>
                    <form onSubmit={addTeam}>
                        <label htmlFor="team_id">Team ID</label>
                        <input id='team_id' type="text"/>
                        <label htmlFor="team_name">Team Name</label>
                        <input id='team_name' type="text"/>
                        <label htmlFor="team_code">Team Code</label>
                        <input id='team_code'type="text"/>
                        <label htmlFor="federation_name">Federation Name</label>
                        <input id='federation_name'type="text"/>
                        <label htmlFor="region_name">Region Name</label>
                        <input id='region_name'type="text"/>
                        <label htmlFor="confederation_id">Confederation ID</label>
                        <input id='confederation_id'type="text"/>
                        <label htmlFor="mens_team_wikipedia_link">Mens Team Wikipedia Link</label>
                        <input id='mens_team_wikipedia_link'type="text"/>
                        <label htmlFor="womens_team_wikipedia_link">Women Team Wikipedia Link</label>
                        <input id='womens_team_wikipedia_link'type="text"/>
                        <label htmlFor="federation_wikipedia_link">Federation Wikipedia Link</label>
                        <input id='federation_wikipedia_link'type="text"/>
                        <div className="checkbox">
                            <label htmlFor="mens_team">Mens Team</label>
                            <input id='mens_team' type="checkbox"/>
                        </div>
                        <div className="checkbox">
                            <label htmlFor="womens_team">Womens Team</label>
                            <input id='womens_team' type="checkbox"/>
                        </div>
                        <button className="save-button" type='submit'>Save</button>
                    </form>
                </div>
            </div>
        )}
        {filteredTeams.map(team => (
            <Team key={team.team_id} t={team} handleDeleteTeam={deleteTeam} confederations={confederations}/>
        ))}
    </div>
);
}


function Team({t, handleDeleteTeam, confederations}){
    const [team, setTeam] = useState(t);
    const [isEditing, setIsEditing] = useState(false);
    const iso2 = getCountryISO2(t.team_code);
    const flagUrl = `https://flagsapi.com/${iso2}/flat/64.png`;
    const history = useHistory();

    function editTeam() { setIsEditing(true)}
    
    function deleteTeam() {
        handleDeleteTeam(team)
    }

    function handleOnClick(e) {
        history.push(`/teams/${team.team_id}`);
    }


    function submitTeam(e) {
        e.preventDefault();
        const newTeam = {...team};
        newTeam.team_name = e.target.team_name.value;
        newTeam.team_code = e.target.team_code.value;
        newTeam.confederation_id = e.target.confederation_id.value;
        newTeam.federation_wikipedia_link = e.target.federation_wikipedia_link.value;
        console.log(newTeam)

        fetch('http://localhost:5000/tournaments/teams', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newTeam}),
        }).then(response => response.json())
            .then(data => {
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
                        <input id='team_code' type="text" defaultValue={team.team_code}/>
                        <label htmlFor="confederation_id">Confederation</label>
                        <select className={"form-option"} id='confederation_id' defaultValue={team.confederation_id}>
                            {confederations.map(confederation => (
                                <option key={confederation.confederation_id} value={confederation.confederation_id}>{confederation.confederation_name}</option>
                            ))}
                        </select>
                        <label htmlFor="federation_wikipedia_link">Wikipedia Link</label>
                        <input id='federation_wikipedia_link' type="text" defaultValue={team.federation_wikipedia_link}/>
                        <button className="save-button" type='submit'>Save</button>
                    </form>
                </div>
            ) : (
            <>
            <h3 onClick={handleOnClick} style={{cursor: 'pointer'}}>
                {team.team_name}
            </h3>
            {/* <h3>
                {team.team_id}
            </h3> */}
            <img src={flagUrl} alt={`${t.team_name} Flag`} style={{ width: '64px', height: 'auto' }} />
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
                <button className="delete-button-danas" onClick={deleteTeam}>Delete</button>
            </div>
            </>
            )}
        </div>
    );
}