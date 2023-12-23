import '../css/Managers.css'
import '../css/Buttons.css'

import {useEffect, useState} from "react";

export default function Managers() {
    const [managers, setManagers] = useState([])
    const [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false);
    const [editTrigger, setEditTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/managers')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setManagers(data)
                console.log(managers)
            })
    }, [deleteTrigger, addTrigger, editTrigger])

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    function addManager(e) {
        e.preventDefault();
        const newManager = {
            manager_id: e.target.elements.manager_id.value,
            family_name: e.target.elements.family_name.value,
            given_name: e.target.elements.given_name.value,
            female : e.target.elements.female.value,
            country_name: e.target.elements.country_name.value,
            manager_wikipedia_link: e.target.elements.manager_wikipedia_link.value,
        }

        fetch('http://localhost:5000/managers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newManager}),
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

    function deleteManager(manager) {
        fetch('http://localhost:5000/managers', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(manager.manager_id),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setDeleteTrigger(!deleteTrigger);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function editManager(manager) {
        fetch('http://localhost:5000/managers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({manager}),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setEditTrigger(!editTrigger);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const style = {
        alignSelf: "center",
        alignText: "center",
        padding: "0 0 0 2rem"
    }
        

    return (
    
        <div className="manager-container" style={{minWidth: "100%",display:"flex", flexDirection: "column", alignItems: "center"}}>

            <h1 style={style}>Managers</h1>
            <div className='managers'>
                
                {managers.map(manager => (
                    <Manager key={manager.manager_id} m={manager} deleteHandle={deleteManager} editHandle={editManager} />
                ))}

                <button className="add-button" onClick={() => setModalVisible(true)}>+ Add Manager</button>
                {modalVisible && (
                    <div className='modal'>
                        <div className='modal-content'>
                            <span className='close' onClick={toggleModal}>
                                &times;    
                            </span>
                            <form onSubmit={(e) => addManager(e)}>
                                <label htmlFor='manager_id'>Manager ID</label>
                                <input id='manager_id' type='text' required/> 
                                <label htmlFor='family_name'>Family Name</label>
                                <input id='family_name' type='text' required/>
                                <label htmlFor='given_name'>Given Name</label>
                                <input id='given_name' type='text' required/>   
                                <div className="radiocontainer">
                                    <label>
                                        <input
                                            type="radio"
                                            id="male"
                                            name="female"
                                            value={false}
                                            defaultChecked={true}
                                            required
                                        />
                                        Male
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            id="female"
                                            name="female"
                                            value={true}
                                            defaultChecked={false}
                                            required
                                        />
                                        Female
                                    </label>
                                </div>
                                <label htmlFor='country_name'>Country Name</label>
                                <input id='country_name' type='text' required/>
                                <label htmlFor='manager_wikipedia_link'>Manager Wikipedia Link</label>
                                <input id='manager_wikipedia_link' type='text' required/>
                                <button type='submit'>Add Manager</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Manager({m,deleteHandle, editHandle}) {

    const [manager, setManager] = useState(m);
    const [isEditing, setIsEditing] = useState(false);
    const editManager = () => {
        setIsEditing(true);
    }

    const submitForm = (event) => {
        event.preventDefault();

        const newManager = {
            manager_id: event.target.elements.manager_id.value,
            family_name: event.target.elements.family_name.value,
            given_name: event.target.elements.given_name.value,
            female : event.target.elements.female.value,
            country_name: event.target.elements.country_name.value,
            manager_wikipedia_link: event.target.elements.manager_wikipedia_link.value
        }


        editHandle(newManager);
        setIsEditing(false);
    }

    const delete_Manager = () => {
        deleteHandle(manager);
    }

    return(
        <div className='manager'>
            <div className='manager-info'>
                {!isEditing ? (
                    <>
                        <h1 className='name'>{m.given_name} {m.family_name}</h1>
                        <p >Country: {m.country_name}</p>
                        <a className='link' href={m.manager_wikipedia_link}>Wikipedia link </a>
                        <br/>
                        <div className='buttons' style={{display:'flex'}} >
                            <button className='edit-button' onClick={editManager}>Edit</button>
                            <button className='delete-button-danas' onClick={delete_Manager}>Delete</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={submitForm}>
                        <label htmlFor='manager_id'>Manager ID</label> 
                        <input id='manager_id' type='text' defaultValue={m.manager_id} required/>
                        <label htmlFor='family_name'>Family Name</label>
                        <input id='family_name' type='text' defaultValue={m.family_name} required/>
                        <label htmlFor='given_name'>Given Name</label>
                        <input id='given_name' type='text' defaultValue={m.given_name} required/>
                        <div className="radiocontainer">
                                    <label>
                                        <input
                                            type="radio"
                                            id="male"
                                            name="female"
                                            value={0}
                                            defaultChecked={!m.female}
                                            required
                                        />
                                        Male
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            id="female"
                                            name="female"
                                            value={1}
                                            defaultChecked={m.female}
                                            required
                                        />
                                        Female
                                    </label>
                                </div>
                        <label htmlFor='country_name'>Country Name</label>
                        <input id='country_name' type='text' defaultValue={m.country_name} required/>
                        <label htmlFor='manager_wikipedia_link'>Manager Wikipedia Link</label>
                        <input id='manager_wikipedia_link' type='text' defaultValue={m.manager_wikipedia_link} required/>
                        <button type='submit'>Save</button>
                    </form>
                )}
            </div>
        </div>
    )
}
