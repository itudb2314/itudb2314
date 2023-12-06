import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Matches.css';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [goals, setGoals] = useState([]);
    const [match, setMatch] = useState([]);
    const [goals_by_id, setGoals_by_id] = useState([]);
    const {match_id} = useParams();
    const [matchAdded, setMatchAdded] = useState(false);

    useEffect(() => {
        if(!match_id) {
            Promise.all([ //fetching data from backend
                fetch('http://localhost:5000/matches').then((response) => response.json()),
                fetch('http://localhost:5000/goals').then((response) => response.json()),
            ])

            .then(([matches_data, goals_data]) => { //converting response to json])
                //process and set matches
                const tournament_matches = matches_data.reduce((tournament, match) => {
                    const key = match.tournament_id;  //key based on which matches are grouped
                    if(!tournament[key])   //check if array exits
                        tournament[key] = [];
                    tournament[key].push(match);
                    return tournament;
                }, {});  //initial value of tournament is an empty object
                setMatches(Object.values(tournament_matches)); //set matches to array of arrays of matches

                //process and set goals
                const match_goals = goals_data.reduce((match, goal) => {
                    const key = goal.match_id;  //key based on which goals are grouped
                    if(!match[key])   //check if array exits
                        match[key] = [];
                    match[key].push(goal);
                    return match;
                }, {});  //initial value of match is an empty object
                setGoals(match_goals); //set goals to array of arrays of goals
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }); 
        } else {
            Promise.all([ //fetching data from backend
                fetch(`http://localhost:5000/matches/${match_id}`).then((response) => response.json()),
                fetch(`http://localhost:5000/goals/${match_id}`).then((response) => response.json()),
            ])
            .then(([match_data, goals_data]) => {
                //process and set matches
                setMatch(match_data);

                //process and set goals
                setGoals_by_id(goals_data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }); 
        }
    }, [match_id, ]);
    const style = {
        margin: '2rem 0 2rem 0',
        color: 'reds',
    };

    //delete function
    const deleteMatchbyID = async (match_id) => {
        await fetch(`http://localhost:5000/matches/${match_id}`, {
            method: 'DELETE',
        });
        setMatches(matches.filter((match) => match.match_id !== match_id));
    };

    //insert function
    const [showInsertForm, setShowInsertForm] = useState(false);
    const toggleInsertForm = () => setShowInsertForm(!showInsertForm);
    const handleInsertMatch = (event) => {
        event.preventDefault();
        const matchdata = {
            tournament_id: event.target.tournament_id.value,
            match_id: event.target.match_id.value,
            match_name: event.target.match_name.value,
            stage_name: event.target.stage_name.value,
            group_name: event.target.group_name.value,
            group_stage: event.target.group_stage.value,
            knockout_stage: event.target.knockout_stage.value,
            replayed: event.target.replayed.value,
            replay: event.target.replay.value,
            match_date: event.target.match_date.value,
            match_time: event.target.match_time.value,
            stadium_id: event.target.stadium_id.value,
            home_team_id: event.target.home_team_id.value,
            away_team_id: event.target.away_team_id.value,
            score: event.target.score.value,
            home_team_score: event.target.home_team_score.value,
            away_team_score: event.target.away_team_score.value,
            home_team_score_margin: event.target.home_team_score_margin.value,
            away_team_score_margin: event.target.away_team_score_margin.value,
            extra_time: event.target.extra_time.value,
            penalty_shootout: event.target.penalty_shootout.value,
            score_penalties: event.target.score_penalties.value,
            home_team_score_penalties: event.target.home_team_score_penalties.value,
            away_team_score_penalties: event.target.away_team_score_penalties.value,
            result: event.target.result.value,
            home_team_win: event.target.home_team_win.value,
            away_team_win: event.target.away_team_win.value,
            draw: event.target.draw.value
        };

        fetch('http://localhost:5000/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({matchdata}),
        })
        .then((response) => response.json())
        .then((data) => {
            toggleInsertForm();
            setMatchAdded(!matchAdded);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        setMatchAdded(!matchAdded);
    };

    return (
        <div className="matches">
            {/*button to toggle insert form*/}
            <button onClick={toggleInsertForm}>Insert Match</button>
            {/*conditional rendering for insertion form*/}
            {showInsertForm && (
                <div className='form'>
                    <div className='form-content'>
                        <h2>Insert Match</h2> 
                        <form onSubmit={handleInsertMatch}>
                            <label> Tournament ID </label>
                            <input type="text" name="tournament_id" placeholder='WC-YEAR'/>
                            <label> Match ID </label>
                            <input type="text" name="match_id" placeholder='M-YEAR-MATCHNUMBER'/>
                            <label> Match Name </label>
                            <input type="text" name="match_name" placeholder='HOMETEAM vs AWAYTEAM'/>
                            <label> Stage Name </label>
                            <input type="text" name="stage_name" placeholder='ex:Group Stage'/>
                            <label> Group Name </label>
                            <input type="text" name="group_name" placeholder='ex:Group 1 or not applicable'/>
                            <label> Group Stage </label>
                            <input type="text" name="group_stage" placeholder='True or False'/>
                            <label> Knockout Stage </label>
                            <input type="text" name="knockout_stage" placeholder='True or False'/>
                            <label> Replayed </label>
                            <input type="text" name="replayed" placeholder='True or False'/>
                            <label> Replay </label>
                            <input type="text" name="replay" placeholder='True or False'/>
                            <label> Match Date </label>
                            <input type="text" name="match_date" placeholder='YYYY-MM-DD'/>
                            <label> Match Time </label>
                            <input type="text" name="match_time" placeholder='HH:MM'/>
                            <label> Stadium ID </label>
                            <input type="text" name="stadium_id" placeholder='S-NUMBER'/>
                            <label> Home Team ID </label>
                            <input type="text" name="home_team_id" placeholder='T-NUMBER'/>
                            <label> Away Team ID </label>
                            <input type="text" name="away_team_id" placeholder='T-NUMBER'/>
                            <label> Score </label>
                            <input type="text" name="score" placeholder='HomeTeamScore - AwayTeamScore'/>
                            <label> Home Team Score </label>
                            <input type="text" name="home_team_score"/>
                            <label> Away Team Score </label>
                            <input type="text" name="away_team_score"/>
                            <label> Home Team Score Margin </label>
                            <input type="text" name="home_team_score_margin" placeholder='HomeTeamScoreMargin = HomeTeamScore - AwayTeamScore'/>
                            <label> Away Team Score Margin </label>
                            <input type="text" name="away_team_score_margin" placeholder='AwayTeamScoreMargin = AwayTeamScore - HomeTeamScore'/>
                            <label> Extra Time </label>
                            <input type="text" name="extra_time" placeholder='True or False'/>
                            <label> Penalty Shootout </label>
                            <input type="text" name="penalty_shootout" placeholder='True or False'/>
                            <label> Score Penalties </label>
                            <input type="text" name="score_penalties" placeholder='HomeTeam - AwayTeam'/>
                            <label> Home Team Score Penalties </label>
                            <input type="text" name="home_team_score_penalties"/>
                            <label> Away Team Score Penalties </label>
                            <input type="text" name="away_team_score_penalties"/>
                            <label> Result </label>
                            <input type="text" name="result" placeholder='HomeTeamWin or AwayTeamWin or Draw'/>
                            <label> Home Team Win </label>
                            <input type="text" name="home_team_win" placeholder='True or False'/>
                            <label> Away Team Win </label>
                            <input type="text" name="away_team_win" placeholder='True or False'/>
                            <label> Draw </label>
                            <input type="text" name="draw" placeholder='True or False'/>
                            <button type = "submit">Insert</button> 
                        </form>
                        <button onClick={toggleInsertForm}>Close</button>
                    </div>
                </div>
            )}
            {match_id ? (
                <MatchScoreBoard key={match.match_id}  match={match} goals={goals_by_id}/>
            ) : (
                matches.map((tournament_matches, i) => (
                    <div key={i}>
                        <h2 style={style}>{tournament_matches[0].tournament_name}</h2>
                        {tournament_matches.map((match) => (
                            <Match key={match.match_id}  match={match} goals={goals[match.match_id]}  onDeleteMatch={deleteMatchbyID}/>
                        ))}
                    </div>
                )))} 
        </div>
    );
}

function Match({match, goals, onDeleteMatch}) {
    const [deleting, setDeleting] = useState(false);

    const handleDeleteMatch = () => {
        setDeleting(true);
        onDeleteMatch(match.match_id);
    }

    const match_style = {
        border: '1px solid black',
        margin: '1rem',
        borderRadius: '50px',
        width: '75%',
    }
    return (
        <div style={match_style} className='center_div'>
            <h2 className = "match_header">
                {match.stage_name} 
            </h2>
            <div className='match_details'>
                <p className='team_names'>{match.home_team_name}</p>
                <p className='team_score'>{match.home_team_score}   -   {match.away_team_score}</p>
                <p className='team_names'>{match.away_team_name}</p>
            </div>
            <div className='match_statistics'>
                <div className='match_goals'>
                {goals &&  goals
                .filter((goal) => goal.team_id === match.home_team_id)
                .map((goal, index) => (
                    <div key={index}> 
                        <p>{goal.minute_label}  {goal.given_name}  {goal.family_name}</p>
                    </div>
                ))}
                </div>
                <div className='match_time'>
                    {match.penalty_shootout ?  (
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
                        <p>{goal.minute_label}  {goal.given_name}  {goal.family_name}</p>
                    </div>
                ))}
                </div>
            </div>
            <button onClick={handleDeleteMatch} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete Match'}
            </button>
        </div>
    );
}

function MatchScoreBoard({match, goals}) {
    return (
        <div className="match-scoreboard">
          <div className="teams">
            <div className="team">
              <h2>{match.home_team_name}</h2>
              <ul className="goals">
                {Array.isArray(goals) ? (goals
                  .filter((goal) => goal.team_id === match.home_team_id)
                  .map((goal, index) => (
                    <li key={index}>
                      <p>{goal.minute_label} {goal.given_name} {goal.family_name}</p>
                    </li>
                  ))) : null}
              </ul>
            </div>
            <div className="vs">{match.home_team_score} - {match.away_team_score}</div>
            <div className="team">
              <h2>{match.away_team_name}</h2>
              <ul className="goals">
                {Array.isArray(goals) ? (goals
                  .filter((goal) => goal.team_id === match.away_team_id)
                  .map((goal, index) => (
                    <li key={index}>
                      <p>{goal.minute_label} {goal.given_name} {goal.family_name}</p>
                    </li>
                  ))) : null}
              </ul>
            </div>
          </div>
          <div className="match-info">
            <p>{match.city_name}</p>
            <p>{match.stadium_name}</p>
            <p>{match.match_time}</p>
          </div>
        </div>
      );
}