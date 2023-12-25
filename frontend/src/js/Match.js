import React, { useState } from "react";
import '../css/Matches.css';
import '../css/Buttons.css';
import { useHistory } from "react-router-dom";

export default function Match({ match, goals, setMatchDeleted, setMatch, setUpdate }) {
    const history = useHistory();
    const [isupdating, setUpdating] = useState(false);

    const handleUpdateMatch = () => setUpdating(!isupdating);
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedMatch = {...match, 
            match_name: formData.get('match_name'),
            replayed: formData.get('replayed'),
            replay: formData.get('replay'),
            match_date: formData.get('match_date'),
            match_time: formData.get('match_time'),
            extra_time: formData.get('extra-time'),
        };

        fetch(`http://localhost:5000/matches`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({updatedMatch : updatedMatch}),
        }).then((response) => response.json())
            .then(data => {
                setMatch(data);
                setUpdate(true);
            }).catch((error) => {
                console.error('Error:', error);
            });

        setUpdating(false);
        setUpdate(false);
    }

    const handleDeleteMatch = () => {
        try {
            deleteMatchbyID(match.match_id);
        }
        catch (error) {
            console.error('Error:', error);
            setMatchDeleted(false);
        }
        setMatchDeleted(false);
    }

    const deleteMatchbyID = async (match_id) => {
        fetch(`http://localhost:5000/matches/${match_id}`, {
            method: 'DELETE',
            headers: {
                'Const-Type': 'application/json',
            },
            body: JSON.stringify({ match_id }),
        }).then((response) => response.json())
            .then(() => {
                setMatchDeleted(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        setMatchDeleted(false);
    };

    const match_style = {
        border: '1px solid black',
        margin: '1rem',
        borderRadius: '10px',
        width: '75%',
    }

    function handleHomeTeamClick(match) {
        history.push(`/squads/${match.tournament_id}/${match.home_team_id}`);
    }

    function handleAwayTeamClick(match) {
        history.push(`/squads/${match.tournament_id}/${match.away_team_id}`);
    }

    function handlePlayerClick(goal){
        history.push(`/players/${goal.player_id}`); 
    }

    function goalIcon() {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.98677 6.89536L4.89862 6.95942L4.93229 7.06306L6.05115 10.5062L6.08483 10.6099H6.19381H9.81438H9.92336L9.95704 10.5062L11.0759 7.06306L11.1096 6.95942L11.0214 6.89536L8.09228 4.7666L8.00409 4.70251L7.91591 4.7666L4.98677 6.89536ZM9.96907 7.32959L9.21794 9.6394H6.78891L6.03907 7.32962L8.00409 5.90168L9.96907 7.32959Z" fill="#000F2C" stroke="#000F2C" stroke-width="0.3"></path><path d="M8.00541 0.516748H7.85541V0.518264C4.85605 0.578871 2.062 2.45346 0.975303 5.4415C-0.437249 9.32423 1.56395 13.6176 5.44677 15.0302C6.29182 15.338 7.15569 15.4834 8.00541 15.4834C11.0612 15.4834 13.9307 13.5964 15.0355 10.5586L15.0355 10.5586C16.4466 6.67591 14.4455 2.38261 10.5627 0.969997C9.76731 0.680294 8.9565 0.534412 8.15541 0.51826V0.516748H8.00541ZM13.9628 10.6251L13.8 10.6701L10.6431 11.5431L10.589 11.5581L10.558 11.605L8.75189 14.3372L8.65742 14.4801C8.44152 14.5019 8.22305 14.5129 8.00261 14.5129C7.78308 14.5129 7.56468 14.5018 7.34739 14.4797L7.25339 14.3373L5.45009 11.6051L5.41911 11.5581L5.3649 11.5431L2.20947 10.6701L2.05044 10.6261C1.87348 10.2249 1.73648 9.80589 1.64279 9.37576L1.74622 9.24592L3.78699 6.68415L3.82201 6.64018L3.81951 6.58403L3.67424 3.31266L3.66701 3.14966C3.99472 2.85716 4.35098 2.59807 4.72983 2.37682L4.884 2.43453L7.95143 3.58272L8.00401 3.6024L8.05659 3.58272L11.124 2.43453L11.2847 2.37439C11.6671 2.597 12.0208 2.8555 12.3426 3.14354L12.3352 3.31273L12.1913 6.58409L12.1888 6.64018L12.2238 6.68411L14.2632 9.24588L14.3699 9.37998C14.3084 9.66377 14.2273 9.94672 14.1253 10.2277C14.0748 10.3624 14.0206 10.495 13.9628 10.6251ZM13.1723 6.3205L13.2548 4.43709L13.4842 4.5124C14.0756 5.44013 14.4204 6.50226 14.4875 7.60325L14.3471 7.79692L13.1723 6.3205ZM6.23724 1.90436L6.37978 1.70905C7.43502 1.43749 8.5716 1.43749 9.62685 1.70905L9.76941 1.90439L8.00399 2.5655L6.23724 1.90436ZM2.75196 4.43583L2.83566 6.32046L1.65997 7.79531L1.52047 7.60205C1.58754 6.50096 1.93238 5.43874 2.52389 4.51094L2.75196 4.43583ZM5.61871 14.0442C4.5973 13.6405 3.69501 12.9839 2.99259 12.1326L2.99191 11.8933L4.81029 12.3956L5.84957 13.9693L5.61871 14.0442ZM11.1977 12.397L13.0161 11.8947L13.0154 12.1326C12.313 12.984 11.4106 13.6406 10.3877 14.0443L10.1575 13.9703L11.1977 12.397Z" fill="#000F2C" stroke="#000F2C" stroke-width="0.3"></path></svg>
        )
    }

    function capitalizeWords(str) {
        return str ? str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';
    }


    return (
        <div style={match_style} className='center_div'>
            <h2 className="match_header" onClick={()=>{history.push(`/matches/${match.match_id}`)}} style={{ cursor: 'pointer' }}>
                {capitalizeWords(match.stage_name)} / {match.match_name}
            </h2>
            {!isupdating ? (
                <>
                <div className='match_details'>
                    <p className='team_names' onClick={() => handleHomeTeamClick(match)} style={{ cursor: 'pointer' }}>
                        {match.home_team_name}
                    </p>
                    <p className='team_score'>{match.home_team_score}   -   {match.away_team_score}</p>
                    <p className='team_names' onClick={() => handleAwayTeamClick(match)} style={{ cursor: 'pointer' }}>
                        {match.away_team_name}
                    </p>
                </div>
                <div className='match_statistics'>
                    <div className='match_goals'>
                        {goals && goals
                            .filter((goal) => goal.team_id === match.home_team_id)
                            .map((goal, index) => (
                                <div key={index}>
                                    <p onClick={() => handlePlayerClick(goal)} style={{ cursor: 'pointer' }}>{goalIcon()} {goal.minute_label}  {goal.given_name}  {goal.family_name}{goal.penalty ? (<span>(P)</span>) : (<></>)}</p>
                                </div>
                            ))}
                    </div>
                    <div className='match_time'>
                        {match.penalty_shootout ? (
                            <p className='match_time_item'>({match.home_team_score_penalties} - {match.away_team_score_penalties})</p>
                        ) : null}
                        <p className='match_time_item'>{match.match_time}</p>
                        <p className='match_time_item'>{match.stadium_name}</p>
                        <p className='match_time_item'>{match.city_name}</p>
                    </div>
                    <div className='match_goals'>
                        {goals && goals
                            .filter((goal) => goal.team_id === match.away_team_id)
                            .map((goal, index) => (
                                <div key={index}>
                                    <p onClick={() => handlePlayerClick(goal)} style={{ cursor: 'pointer' }}>{goalIcon()} {goal.minute_label}  {goal.given_name}  {goal.family_name}{goal.penalty ? (<span>(P)</span>) : (<></>)}</p>
                                </div>
                            ))}
                    </div>
                </div>
                <div style={{gap:'200px'}}>   
                    <button onClick={handleUpdateMatch} className='edit-button'>
                        Update
                    </button>
                    <button onClick={handleDeleteMatch} style={{paddingRight: '5px'}}className='delete-button-danas'>
                        Delete
                    </button>
                </div>
                </>
            ) : (
                 <div>
                    <div>
                        <h2>Update Match</h2> 
                        <form id = "update-form" onSubmit={handleFormSubmit}>
                            <label for="match_name"> Match Name </label>
                            <input id= "match_name" type="text" name="match_name" className="input-text-select" placeholder='HOMETEAM vs AWAYTEAM' required/>
                            <label> Replayed </label><br/>
                            <input type="radio" id="true-replayed" name="replayed" value="1" required/>
                            <label for="true-replayed" className='radio-label'> True </label>
                            <input type="radio" id="false-replayed" name="replayed" value="0" required/>
                            <label for="false-replayed" className='radio-label'> False </label> <br/>
                            <label> Replay </label><br/>
                            <input type="radio" id="true-replay" name="replay" value="1" required/>
                            <label for="true-replay" className='radio-label'> True </label> 
                            <input type="radio" id="false-replay" name="replay" value="0" required/>
                            <label for="false-replay" className='radio-label'> False </label> <br/>
                            <label> Match Date </label>
                            <input type="text" name="match_date" pattern="\d{4}-\d{2}-\d{2}" placeholder='YYYY-MM-DD'  className="input-text-select" required/>
                            <label> Match Time </label>
                            <input type="text" name="match_time" pattern="\d{2}:\d{2}" placeholder='HH:MM' className="input-text-select" required/>
                            <label> Extra Time </label><br/>
                            <input type="radio" id="true" name="extra-time" value="1" required/>
                            <label for="true" className='radio-label'> True </label>
                            <input type="radio" id="false" name="extra-time" value="0" required/>
                            <label for="false" className='radio-label'> False </label> <br/>
                        </form>
                        <button type='submit' form='update-form' value='Submit'>Submit</button>
                        <button onClick={handleUpdateMatch}>close</button>
                    </div>
                </div>
            )}
            </div>        
    );
}
