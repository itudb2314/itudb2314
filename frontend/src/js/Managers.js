import '../css/Managers.css'
import {useEffect, useState} from "react";

export default function Managers() {
    const [managers, setManagers] = useState([])

    useEffect(() => {
        fetch('http://localhost:5000/managers')
            .then(response => response.json())
            .then(data => {
                setManagers(data)
                console.log(managers)
            })
    }, [])

    return (
        <div className='managers'>
            {managers.map(manager => (
                <Manager key={manager.manager_id} m={manager}/>
            ))}
        </div>
    );
}

function Manager({m}){

    return (
        <div className='manager'>
            <h1 className='name'>{m.given_name} {m.family_name}</h1>
            <a className='link' href={m.manager_wikipedia_link}>{m.manager_id}</a>
        </div>
    );
}