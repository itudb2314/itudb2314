import '../css/Managers.css'
import '../css/Buttons.css'
import {useEffect, useState} from "react";

export default function Managers() {
    const [managers, setManagers] = useState([])
    cosnt [deleteTrigger, setDeleteTrigger] = useState(false)
    const [addTrigger, setAddTrigger] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/managers')
            .then(response => response.json())
            .then(data => {
                setManagers(data)
                console.log(managers)
            })
    }, [deleteTrigger, addTrigger])

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    }

    function addManager(e) {
        e.preventDefault();
        const newManager = {
            manager_id: e.target.manager_id.value,
            family_name: e.target.family_name.value,
            given_name: e.target.given_name.value,
            female : e.target.female.value,
            country_name: e.target.country_name.value,
            manager_wikipedia_link: e.target.manager_wikipedia_link.value,
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

    const style = {
        alignSelf: "center",
        padding: "0 0 0 2rem"
    }

    return (
        <div className='managers'>
            <h1 style={style}>Managers</h1>
            {managers.map(manager => (
                <Manager key={manager.manager_id} m={manager} deleteHandle={deleteManager} />
            ))}

            <button className="add-button" onClick={() => setModalVisible(true)}>+ Add Manager</button>
            {modalVisible && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='close' onClick={toggleModal}>
                            &times;    
                        </span>
                        <form onSubmit={addManager}>
                            <label htmlFor='manager_id'>Manager ID</label>
                            <input id='manager_id' type='text' required/> 
                            <label htmlFor='family_name'>Family Name</label>
                            <input id='family_name' type='text' required/>
                            <label htmlFor='given_name'>Given Name</label>
                            <input id='given_name' type='text' required/>   
                            <label htmlFor='female'>Is Female (true or false)</label>
                            <input id='female' type='text' required/>
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
    );
}

function Manager(m,deleteHandle) {

    const [manager, setManager] = useState(m);
    const [isEditing, setIsEditing] = useState(false);
    const editManager = () => {
        setIsEditing(true);
    }

    const submitForm = (event) => {
        event.preventDefault();
        const newManager = {... manager};
        newManager.manager_id = event.target.manager_id.value;
        newManager.family_name = event.target.family_name.value;
        newManager.given_name = event.target.given_name.value;
        newManager.female= event.target.female.value;
        newManager.country_name = event.target.country_name.value;
        newManager.manager_wikipedia_link = event.target.manager_wikipedia_link.value;

        fetch('http://localhost:5000/managers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newManager}),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setManager(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setIsEditing(false);
    }

    const deleteManager = () => {
        deleteHandle(manager);
    }

    return(
        <div className='manager'>
            <div className='manager-info'>
                {!isEditing ? (
                    <>
                        <h1 className='name'>{m.given_name} {m.family_name}</h1>
                        <a className='link' href={m.manager_wikipedia_link}>{m.manager_id}</a>
                        <div className='buttons'>
                            <button className='edit-button' onClick={editManager}>Edit</button>
                            <button className='delete-button' onClick={deleteManager}>Delete</button>
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
                        <label htmlFor='female' type='text' defaultValue={m.female} required/>
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
