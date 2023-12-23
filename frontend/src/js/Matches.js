import React, {useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Matches.css';
import '../css/Filters.css';
import getCountryISO2 from 'country-iso-3-to-2';
import Match from "./Match";
import { useHistory } from 'react-router-dom';

export default function Matches() {
    const [matches, setMatches] = useState([]);
    const [goals, setGoals] = useState([]);
    const [match, setMatch] = useState([]);
    const [goals_by_id, setGoals_by_id] = useState([]);
    const {match_id} = useParams();
    const [matchDeleted, setMatchDeleted] = useState(false);
    const [matchAdded, setMatchAdded] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [chosentournament, setChosenTournament] = useState('NULL');
    const [chosenstage, setChosenStage] = useState('NULL');
    const [tournamentstages, setTournamentStages] = useState([]);
    const [groupnames, setGroupNames] = useState([]);
    const [stadiums, setStadiums] = useState([]);
    const [hometeams, setHomeTeams] = useState([]);
    const [awayteams, setAwayTeams] = useState([]);
    const [sort, setSort] = useState('tournament_name');
    const [order, setOrder] = useState('desc');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const divRef = useRef(null);
    const [filter, setFilter] = useState('All');
    const [allteams, setAllTeams] = useState([]);
    const [alltournaments, setAllTournaments] = useState([]);
    const [filter_value, setFilterValue] = useState('All');
    const [updateTrigger, setUpdateTrigger] = useState(false);


    function handleScroll() {
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        if(scrollTop + clientHeight >= scrollHeight - 5) {
            setOffset(offset + 10);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    useEffect(() => {
        setOffset(0);
    }, [filter_value, sort, order]);

    useEffect(() => {
        if(!match_id) {
            Promise.all([ //fetching data from backend
                fetch(`http://localhost:5000/matches/${sort}/${order}/${offset}/${limit}/${filter}/${filter_value}`).then((response) => response.json()),
                fetch('http://localhost:5000/goals').then((response) => response.json()),
            ])

            .then(([matches_data, goals_data]) => { //converting response to json])
                if(sort === 'tournament_name' && (filter === 'All' || filter === 'tournament')) {
                    //convert existing matches to an object with tournament_id as its key
                    const prevMatches = matches.reduce((acc, curr) => {
                        acc[curr[0].tournament_id] = curr;
                        return acc;
                    }, {});

                    //appennd new matches to appropriate tournament
                    matches_data.forEach(match => {
                        const key = match.tournament_id;
                        if(!prevMatches[key]) {
                            prevMatches[key] = [];
                        }
                        prevMatches[key].push(match);
                    })
                
                    setMatches(Object.values(prevMatches)); //set matches to array of arrays of matches
                } else {
                    if(Array.isArray(matches_data) && matches_data.length !== 0) {
                        setMatches((prevMatches) => [...prevMatches, ...matches_data]);
                    }
                }

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
                fetch(`http://localhost:5000/bookings/${match_id}`).then((response) => response.json()),
            ])
            .then(([match_data, goals_data, bookings_data]) => {
                //process and set matches
                setMatch(match_data);

                //process and set goals
                setGoals_by_id(goals_data);

                //process and set bookings
                setBookings(bookings_data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            }); 
        }
    }, [match_id, matchAdded, matchDeleted, sort, order, offset, filter_value, updateTrigger]);
    const style = {
        margin: '2rem 0 2rem 0',
        color: 'reds',
    };

    function onMatchDelete(state) {
        setMatchDeleted(state);
    }

    //insert function
    const [showInsertForm, setShowInsertForm] = useState(false);
    const toggleInsertForm = () => setShowInsertForm(!showInsertForm);
    const handleInsertMatch = (event) => {
        event.preventDefault();
        const formdata = new FormData(event.target);
        const matchdata = {
            tournament_id: formdata.get('Tournament'),
            match_id: formdata.get('match_id'),
            match_name: formdata.get('match_name'),
            stage_name: formdata.get('stage'),
            group_name: formdata.get('group_name'),
            group_stage: formdata.get('group-stage'),
            knockout_stage: formdata.get('knockout'),
            replayed: formdata.get('replayed'),
            replay: formdata.get('replay'),
            match_date: formdata.get('match_date'),
            match_time: formdata.get('match_time'),
            stadium_id: formdata.get('stadium_name'),
            home_team_id: formdata.get('hometeam_name'),
            away_team_id: formdata.get('awayteam_name'),
            score: formdata.get('score'),
            home_team_score: formdata.get('home_team_score'),
            away_team_score: formdata.get('away_team_score'),
            home_team_score_margin: formdata.get('home_team_score_margin'),
            away_team_score_margin: formdata.get('away_team_score_margin'),
            extra_time: formdata.get('extra-time'),
            penalty_shootout: formdata.get('penalty-shootout'),
            score_penalties: formdata.get('score_penalties'),
            home_team_score_penalties: formdata.get('home_team_score_penalties'),
            away_team_score_penalties: formdata.get('away_team_score_penalties'),
            result: formdata.get('result'),
            home_team_win: formdata.get('home_team_win'),
            away_team_win: formdata.get('away_team_win'),
            draw: formdata.get('draw'),
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
            setMatchAdded(true);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        if(offset > 0) {
            setOffset(0);
        }
        setMatchAdded(false);
    };
 
    //tournament stage validation
    const handleTournamentChange = (event) => {
        setChosenTournament(event.target.value);
    }

    useEffect(() => {
        if(chosentournament !== 'NULL' && showInsertForm) {
            fetch(`http://localhost:5000/tournamentstages/${chosentournament}`)
            .then((response) => response.json())
            .then((data) => {
                setTournamentStages(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [chosentournament]);


    const [isgroupstage, setIsGroupStage] = useState(false);
    const [isknockoutstage, setIsKnockoutStage] = useState(false);

    //group number validation
    const handleStageChange = (event) => {
        const select_stage = event.target.value;
        setChosenStage(select_stage);
            //stage validation

        const group_stages = ['group stage', 'first round', 'first group stage', 'second group stage', 'final round']

        if(group_stages.includes(select_stage.toLowerCase())) {
            setIsGroupStage(true);
            setIsKnockoutStage(false);
        } else {
            setIsGroupStage(false);
            setIsKnockoutStage(true);            
        }
    }

    useEffect(() => {
        if(chosentournament !== 'NULL' && chosenstage !== 'NULL' && showInsertForm) {
            fetch(`http://localhost:5000/groupnames/${chosentournament}/${chosenstage}`)
            .then((response) => response.json())
            .then((data) => {
                setGroupNames(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [chosentournament, chosenstage]);

    //stadiums validation
    useEffect(() => {
        if(showInsertForm) {
            fetch(`http://localhost:5000/stadiums/${chosentournament}`)
            .then((response) => response.json())
            .then((data) => {
                setStadiums(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [chosentournament]);


    //teams validation
    useEffect(() => {
        if(showInsertForm) {
            Promise.all([ //fetching data from backend
                fetch(`http://localhost:5000/tournament_home_teams/${chosentournament}`).then((response) => response.json()),
                fetch(`http://localhost:5000/tournament_away_teams/${chosentournament}`).then((response) => response.json()),
            ])
            .then(([hometeam_data, awayteam_data]) => {
                setHomeTeams(hometeam_data);
                setAwayTeams(awayteam_data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [chosentournament]);


    //wins validation
    const [home_score, setHomeScore] = useState(0);
    const [away_score, setAwayScore] = useState(0);
    const [match_outcome, setMatchOutcome] = useState({home_win: false, away_win: false, draw: false});

    useEffect(()=> {
        if(home_score > away_score) {
            setMatchOutcome({home_win: true, away_win: false, draw: false})
        }else if(away_score > home_score) {
            setMatchOutcome({home_win: false, away_win: true, draw: false})
        }else {
            setMatchOutcome({home_win: false, away_win: false, draw: true})
        }
    }, [home_score, away_score])


    //filters
    function sortMatches(e) {
        setMatches([]);
        setSort(e.target.value)
    }

    function orderMatches(e) {
        setMatches([]);
        setOrder(e.target.value)
    }

    function filterMatches(e) {
        setFilter(e.target.value)
    }

    function filterValue(e) {
        setMatches([]);
        setFilterValue(e.target.value)
    }

    useEffect(() => {
        if(filter === 'team' || filter === 'All') {
            fetch(`http://localhost:5000/tournaments/teams`)
            .then((response) => response.json())
            .then((data) => {
                setAllTeams(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [filter]);

    useEffect(() => {
        if(filter === 'tournament' || showInsertForm) {
            fetch(`http://localhost:5000/tournaments`)
            .then((response) => response.json())
            .then((data) => {
                setAllTournaments(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [filter, showInsertForm]);


    return (
        <div className="matches">
            {/*Filters and sorting */}
            {match_id ?  (<></>):
                <div className="filter-block">
                    <div className="filter">
                        <label>Sort By</label>
                        <select className="filter_select" onChange={sortMatches}>
                            <option value="tournament_name">Tournament</option>
                            <option value="Stage">Stage</option>
                            <option value="Score-margin">Score Margin</option>
                            <option value="Goals-Scored">Goals Scored</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label>Order</label>
                        <select className="filter_select" onChange={orderMatches}>
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label>Filter</label>
                        <select className="filter_select" onChange={filterMatches}>
                            <option value="select" default disabled> Select </option>
                            <option value="team">Teams</option>
                            <option value="tournament">Tournaments</option>
                        </select>
                    </div>         
                    <div className="filter">
                    <label>Options</label>
                    {(filter === 'team' || filter == 'All') ? (
                                <select className="filter_select" onChange={filterValue}>
                                <option value="select" default disabled> Select </option>
                                {allteams.map((team) => (
                                    <option value={team.team_id}>{team.team_name}</option>
                                ))}
                                </select>
                        ) : (<></>)}
                    {filter === 'tournament' ? (
                                <select className="filter_select" onChange={filterValue}>
                                <option value="select" default disabled> Select </option>
                                {alltournaments.map((tournament) => (
                                    <option value={tournament.tournament_id}>{tournament.tournament_name}</option>
                                ))}
                                </select>
                        ) : (<></>)}
                    </div>       
                </div>
            }
            {/*button to toggle insert form*/}
            {match_id ?  (<></>): (<button onClick={toggleInsertForm} className='insert-button'>Insert Match</button>)}
            {/*conditional rendering for insertion form*/}
            {showInsertForm && (
                <div className='form'>
                    <div className='form-content'>
                        <h2>Insert Match</h2> 
                        <form id = "insert-form" onSubmit={handleInsertMatch}>
                            <label for="Tournament"> Tournament ID </label> <br/>
                            <select id="Tournament" className='input-text-select' name="Tournament" value={chosentournament} onChange={handleTournamentChange}>
                                <option value='NULL' disabled>select</option>
                                {Array.isArray(alltournaments) && alltournaments.map((tournament) => (
                                    <option value={tournament['tournament_id']}>{tournament['tournament_name']}</option>
                                ))}
                            </select>
                            <label for="matchid"> Match ID </label>
                            <input id="matchid" type="text" className='input-text-select' name="match_id" pattern="^M-\d{4}-\d{2,}$" placeholder='M-YEAR-MATCHNUMBER' required/>
                            <label for="match_name"> Match Name </label>
                            <input id= "match_name" type="text" className='input-text-select' name="match_name" placeholder='HOMETEAM vs AWAYTEAM' required/>
                            {Array.isArray(tournamentstages) && <label for="stage"> Stage Name </label>}
                            {Array.isArray(tournamentstages) && (
                                <select id="stage" name="stage" value={chosenstage} onChange={handleStageChange}>
                                    <option value='NULL' disabled>select</option>
                                    {tournamentstages.map((stage) => (
                                        <option value={stage}>{stage}</option>
                                    ))}
                                </select>
                            )}
                            {Array.isArray(groupnames) && <label for="group_name"> Group Name </label>}
                            {Array.isArray(groupnames) && (
                                <select id="group_name" name="group_name" className='input-text-select'>
                                    <option value='NULL' disabled>select</option>
                                    {groupnames.length === 0 && <option value='not applicable'>not applicable</option>}
                                    {groupnames.map((groupname) => (
                                        <option value={groupname}>{groupname}</option>
                                    ))}
                                </select>
                            )
                            }
                            <label> Group Stage </label><br/>
                            <input type="radio" id="group_stage_true" name="group-stage" value="1" checked={isgroupstage} disabled required/>
                            <label for="group_stage_true" className='radio-label'> True </label> 
                            <input type="radio" id="group_stage_false" name="group-stage" value="0" checked={!isgroupstage} disabled required/>
                            <label for="group_stage_false" className='radio-label'> False </label> <br/>
                            <label> Knockout Stage </label><br/>
                            <input type="radio" id="knockout_true" name="knockout" value="1" checked={isknockoutstage} disabled required/>
                            <label for="knockout_true" className='radio-label'> True </label>
                            <input type="radio" id="knockout_false" name="knockout" value="0" checked={!isknockoutstage} disabled required/>
                            <label for="knockout_false" className='radio-label'> False </label> <br/>
                            <label> Replayed </label><br/>
                            <input type="radio" id="true" name="replayed" value="1" required/>
                            <label for="true" className='radio-label'> True </label>
                            <input type="radio" id="false" name="replayed" value="0" required/>
                            <label for="false" className='radio-label'> False </label> <br/>
                            <label> Replay </label><br/>
                            <input type="radio" id="true" name="replay" value="1" required/>
                            <label for="true" className='radio-label'> True </label> 
                            <input type="radio" id="false" name="replay" value="0" required/>
                            <label for="false" className='radio-label'> False </label> <br/>
                            <label> Match Date </label>
                            <input type="text" name="match_date" className='input-text-select' pattern="\d{4}-\d{2}-\d{2}" placeholder='YYYY-MM-DD' required/>
                            <label> Match Time </label>
                            <input type="text" name="match_time" placeholder='HH:MM' required/>
                            <label> Stadium </label>
                            {Array.isArray(stadiums) && (
                                <select id="stadium_name" className='input-text-select' name="stadium_name" required>
                                    <option value='NULL' disabled>select</option>
                                    {stadiums.map((stadium) => (
                                        <option value={stadium['stadium_id']}>{stadium['stadium_name']}</option>
                                    ))}
                                </select>
                            )}
                            <label> Home Team </label>
                            {Array.isArray(hometeams) && (
                                <select id="hometeam_name" className='input-text-select' name="hometeam_name" required>
                                    <option value='NULL' disabled>select</option>
                                    {hometeams.map((hometeam) => (
                                        <option value={hometeam["team_id"]}>{hometeam["team_name"]}</option>
                                    ))}
                                </select>
                            )}
                            <label> Away Team </label>
                            {Array.isArray(awayteams) && (
                                <select id="awayteam_name"className='input-text-select' name="awayteam_name" required>
                                    <option value='NULL' disabled>select</option>
                                    {awayteams.map((awayteam) => (
                                        <option value={awayteam["team_id"]}>{awayteam["team_name"]}</option>
                                    ))}
                                </select>
                            )}
                            <label> Score </label>
                            <input type="text" name="score" pattern="\b\d{1,2}-\d{1,2}\b" placeholder='HomeTeamScore - AwayTeamScore' className='input-text-select' required/>
                            <label> Home Team Score </label>
                            <input type="number" min="0" step="1" className='input-text-select' name="home_team_score" onChange={(event) => setHomeScore(parseInt(event.target.value, 10))} required/>
                            <label> Away Team Score </label>
                            <input type="number" min="0" step="1" className='input-text-select' name="away_team_score"  onChange={(event) => setAwayScore(parseInt(event.target.value, 10))} required/>
                            <label> Home Team Score Margin </label>
                            <input type="number" name="home_team_score_margin" className='input-text-select' placeholder='HomeTeamScoreMargin = HomeTeamScore - AwayTeamScore' required/>
                            <label> Away Team Score Margin </label>
                            <input type="number" name="away_team_score_margin" className='input-text-select' placeholder='AwayTeamScoreMargin = AwayTeamScore - HomeTeamScore' required/>
                            <label> Extra Time </label><br/>
                            <input type="radio" id="true" name="extra-time" value="1" required/>
                            <label for="true" className='radio-label'> True </label>
                            <input type="radio" id="false" name="extra-time" value="0" required/>
                            <label for="false" className='radio-label'> False </label> <br/>
                            <label> Penalty Shootout </label><br/>
                            <input type="radio" id="true" name="penalty-shootout" value="1" required/>
                            <label for="true" className='radio-label'> True </label>
                            <input type="radio" id="false" name="penalty-shootout" value="0" required/>
                            <label for="false" className='radio-label'> False </label> <br/>
                            <label> Score Penalties </label>
                            <input type="text" name="score_penalties" className='input-text-select' pattern="\b\d{1,2}-\d{1,2}\b" placeholder='HomeTeam - AwayTeam' required/>
                            <label> Home Team Score Penalties </label>
                            <input type="number" min="0" step="1" className='input-text-select' name="home_team_score_penalties" required/>
                            <label> Away Team Score Penalties </label>
                            <input type="number" min="0" step="1" className='input-text-select' name="away_team_score_penalties" required/>
                            <label> Result </label>
                            <input type="text" name="result" className='input-text-select' placeholder='HomeTeamWin or AwayTeamWin or Draw' required/>
                            <label> Home Team Win </label><br/>
                            <input type="radio" id="home_team_win_true" name="home_team_win" value="1" checked={match_outcome.home_win} disabled/>
                            <label for="home_team_win_true" className='radio-label'> True </label>
                            <input type="radio" id="home_team_win_false" name="home_team_win" value="0" checked={!match_outcome.home_win} required disabled/>
                            <label for="home_team_win_false" className='radio-label'> False </label> <br/>
                            <label> Away Team Win </label><br/>
                            <input type="radio" id="away_team_win_true" name="away_team_win" value="1" checked={match_outcome.away_win} disabled/>
                            <label for="away_team_win_true" className='radio-label'> True </label>
                            <input type="radio" id="away_team_win_false" name="away_team_win" value="0" checked={!match_outcome.away_win} required disabled/>
                            <label for="away_team_win_false" className='radio-label'> False </label> <br/>
                            <label> Draw </label><br/>
                            <input type="radio" id="draw_true" name="draw" value="1" checked={match_outcome.draw} required disabled/>
                            <label for="draw_true" className='radio-label'> True </label>
                            <input type="radio" id="draw_false" name="draw" value="0"  checked={!match_outcome.draw} disabled/>
                            <label for="draw_false" className='radio-label'> False </label> <br/>
                        </form>
                        <button onClick={toggleInsertForm}>Close</button>
                        <button type='submit' form='insert-form' value='Submit'>Submit</button>
                    </div>
                </div>
            )}
            {match_id ? (
                <MatchScoreBoard key={match.match_id}  match={match} goals={goals_by_id} bookings={bookings}/>
            ) : ( 
                (sort === 'tournament_name' && (filter === 'All' || filter === 'tournament' || (filter === 'team' && filter_value === 'All'))) ?
                    matches.map((tournament_matches, i) => (
                        Array.isArray(tournament_matches) ?
                        <div key={i}>
                            <h2 style={style}>{tournament_matches[0]?.tournament_name}</h2>
                            {tournament_matches.map((match) => (
                                <Match key={match.match_id}  match={match} goals={goals[match.match_id]}  setMatchDeleted={onMatchDelete} setMatch={setMatch} setUpdate={setUpdateTrigger}/>
                            ))}
                        </div>
                        : <></>
                    ))
                : 
                    Array.isArray(matches) ?
                    matches.map((match) => (
                        <Match key={match.match_id}  match={match} goals={goals[match.match_id]}  setMatchDeleted={onMatchDelete} setMatch={setMatch}/>
                    ))
                    : <></>

            )}
            {matches.length > 0 && (
                <div ref={divRef} style={{marginTop: "40px"}}>
                </div>
            )}
        </div>
    );
}


function MatchScoreBoard({match, goals, bookings}) {
    //images
    const home_iso2 = getCountryISO2(match.home_team_code);
    const away_iso2 = getCountryISO2(match.away_team_code);
    const homeflagUrl = `https://flagsapi.com/${home_iso2}/flat/64.png`;
    const awayflagUrl = `https://flagsapi.com/${away_iso2}/flat/64.png`;
    const history = useHistory();

    function renderEvent(event) {
        if(event.yellow_card) {
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="20" fill="#FFD700" />
                </svg>
            )
        } else if(event.red_card) {
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="20" fill="#FF0000" />
                </svg>
            )
        } else if(event.second_yellow_card) {
            return (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="20" fill="#FFD700" />
                    <rect x="5" y="5" width="10" height="20" fill="#FFD700" />  
                </svg>
            )
        } else {
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.98677 6.89536L4.89862 6.95942L4.93229 7.06306L6.05115 10.5062L6.08483 10.6099H6.19381H9.81438H9.92336L9.95704 10.5062L11.0759 7.06306L11.1096 6.95942L11.0214 6.89536L8.09228 4.7666L8.00409 4.70251L7.91591 4.7666L4.98677 6.89536ZM9.96907 7.32959L9.21794 9.6394H6.78891L6.03907 7.32962L8.00409 5.90168L9.96907 7.32959Z" fill="#000F2C" stroke="#000F2C" strokeWidth="0.3"></path><path d="M8.00541 0.516748H7.85541V0.518264C4.85605 0.578871 2.062 2.45346 0.975303 5.4415C-0.437249 9.32423 1.56395 13.6176 5.44677 15.0302C6.29182 15.338 7.15569 15.4834 8.00541 15.4834C11.0612 15.4834 13.9307 13.5964 15.0355 10.5586L15.0355 10.5586C16.4466 6.67591 14.4455 2.38261 10.5627 0.969997C9.76731 0.680294 8.9565 0.534412 8.15541 0.51826V0.516748H8.00541ZM13.9628 10.6251L13.8 10.6701L10.6431 11.5431L10.589 11.5581L10.558 11.605L8.75189 14.3372L8.65742 14.4801C8.44152 14.5019 8.22305 14.5129 8.00261 14.5129C7.78308 14.5129 7.56468 14.5018 7.34739 14.4797L7.25339 14.3373L5.45009 11.6051L5.41911 11.5581L5.3649 11.5431L2.20947 10.6701L2.05044 10.6261C1.87348 10.2249 1.73648 9.80589 1.64279 9.37576L1.74622 9.24592L3.78699 6.68415L3.82201 6.64018L3.81951 6.58403L3.67424 3.31266L3.66701 3.14966C3.99472 2.85716 4.35098 2.59807 4.72983 2.37682L4.884 2.43453L7.95143 3.58272L8.00401 3.6024L8.05659 3.58272L11.124 2.43453L11.2847 2.37439C11.6671 2.597 12.0208 2.8555 12.3426 3.14354L12.3352 3.31273L12.1913 6.58409L12.1888 6.64018L12.2238 6.68411L14.2632 9.24588L14.3699 9.37998C14.3084 9.66377 14.2273 9.94672 14.1253 10.2277C14.0748 10.3624 14.0206 10.495 13.9628 10.6251ZM13.1723 6.3205L13.2548 4.43709L13.4842 4.5124C14.0756 5.44013 14.4204 6.50226 14.4875 7.60325L14.3471 7.79692L13.1723 6.3205ZM6.23724 1.90436L6.37978 1.70905C7.43502 1.43749 8.5716 1.43749 9.62685 1.70905L9.76941 1.90439L8.00399 2.5655L6.23724 1.90436ZM2.75196 4.43583L2.83566 6.32046L1.65997 7.79531L1.52047 7.60205C1.58754 6.50096 1.93238 5.43874 2.52389 4.51094L2.75196 4.43583ZM5.61871 14.0442C4.5973 13.6405 3.69501 12.9839 2.99259 12.1326L2.99191 11.8933L4.81029 12.3956L5.84957 13.9693L5.61871 14.0442ZM11.1977 12.397L13.0161 11.8947L13.0154 12.1326C12.313 12.984 11.4106 13.6406 10.3877 14.0443L10.1575 13.9703L11.1977 12.397Z" fill="#000F2C" stroke="#000F2C" strokeWidth="0.3"></path></svg>
            )
        }
    }

    function handleTeamClick(match) {
            history.push(`/squads/${match.tournament_id}/${match.home_team_id}`);
    }

    function handleAwayTeamClick(match) {
        history.push(`/squads/${match.tournament_id}/${match.away_team_id}`);
    }

    function handlePlayerClick(goal){
        history.push(`/players/${goal.player_id}`); 
    }

    return (
        <div className="match-scoreboard">
          <div className="teams-div">
            <div className="team-name">
              <img src={homeflagUrl} alt={`${match.home_team_name} Flag`} style={{ width: '64px', height: 'auto' }} />
              <h2 onClick={() => handleTeamClick(match)} style={{ cursor: 'pointer' }}>
                {match.home_team_name}
              </h2>
              <ul className="goals">
                {Array.isArray(goals) && goals
                  .concat(bookings)
                  .filter((event) => event.team_id === match.home_team_id)
                  .sort((a, b) => parseInt(a.minute_label) - parseInt(b.minute_label))
                  .map((event, index) => (
                    <li key={index}>
                      <p onClick={() => handlePlayerClick(event)} style={{cursor:'pointer'}}>
                            {renderEvent(event)} {event.minute_label} {event.given_name} {event.family_name}{event.penalty ? (<span>(P)</span>) : (<></>)}
                      </p>                   
                    </li>
                ))}
              </ul>
            </div>
            <div className="vs">{match.home_team_score} - {match.away_team_score}</div>
            <div className="team-name">
              <img src={awayflagUrl} alt={`${match.away_team_name} Flag`} style={{ width: '64px', height: 'auto' }} />
              <h2 onClick={() => handleAwayTeamClick(match)} style={{cursor:'pointer'}}>
                {match.away_team_name}
              </h2>
              <ul className="goals">
              {Array.isArray(goals) && goals
                  .concat(bookings)
                  .filter((event) => event.team_id === match.away_team_id)
                  .sort((a, b) => parseInt(a.minute_label) - parseInt(b.minute_label))
                  .map((event, index) => (
                    <li key={index}>
                      <p onClick={() => handlePlayerClick(event)} style={{cursor:'pointer'}}>
                            {renderEvent(event)} {event.minute_label} {event.given_name} {event.family_name}{event.penalty ? (<span>(P)</span>) : (<></>)}
                      </p>
                    </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="match-info">
            {match.penalty_shootout ? (
                <p className='match_time_item'>({match.home_team_score_penalties} - {match.away_team_score_penalties})</p>
            ) : null}
            <p>{match.city_name}</p>
            <p>{match.stadium_name}</p>
            <p>{match.match_time}</p>
          </div>
        </div>
      );
}
