import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import '../css/TournamentDetails.css';
import '../css/Groupstanding.css'
import '../css/Awards.css'
import Match from './Match'
import Groupstanding from './Groupstanding'

export default function TournamentDetails() {
    const { id } = useParams();
    const [tournamentDetails, setTournamentDetails] = useState([]);
    const [round_of_16, setRound_of_16] = useState([]);
    const [quarter_final, setQuarter_final] = useState([]);
    const [semi_final, setSemi_final] = useState([]);
    const [final, setFinal] = useState([]);
    const [matchDeleted, setMatchDeleted] = useState(false);
    const [awards, setAwards] = useState([]);
    const [groupStanding, setGroupStanding] = useState([]);

    function onMatchDelete() {
        setMatchDeleted(!matchDeleted);
    }

    useEffect(() => {
        fetch(`http://localhost:5000/tournaments/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setTournamentDetails(data);
                if (id === 'WC-1950'){
                    return
                }
                setRound_of_16(data.filter((tournament) => { return tournament.stage_name === "round of 16" }));
                setQuarter_final(data.filter((tournament) => { return tournament.stage_name === "quarter-finals" ||
                    tournament.stage_name === "quarter-final" }));
                setFinal(data.filter((tournament) => { return tournament.stage_name === "final" }));
                setSemi_final(data.filter((tournament) => { return tournament.stage_name === "semi-finals" ||
                    tournament.stage_name === "semi-final"}));

                console.log(data.length)

                if (data.length === 2) {
                    return
                }
                reorderMatches(data)

            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


        console.log("Hello")
        fetch(`http://localhost:5000/awards/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setAwards(data);

            }).catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [matchDeleted]);

    function reorderMatches(data) {
        const round_of_16 = data.filter((tournament) => {
            return tournament.stage_name === "round of 16"
        });
        const quarter_final = data.filter((tournament) => {
            return tournament.stage_name === "quarter-finals" ||
                tournament.stage_name === "quarter-final"
        });
        const semi_final = data.filter((tournament) => {
            return tournament.stage_name === "semi-finals" ||
                tournament.stage_name === "semi-final"
        });

        // reorder quarter_final according to the semi_final
        for (let i = 0; i < 2; i++) {
            const team1 = semi_final[i].team1;
            const team2 = semi_final[i].team2;

            let k = i * 2;
            for (let j = 0; j < 4; j++) {
                if (quarter_final[j].team1 === team1 || quarter_final[j].team2 === team1
                    || quarter_final[j].team1 === team2 || quarter_final[j].team2 === team2) {
                    let match = quarter_final[k];
                    quarter_final[k] = quarter_final[j];
                    quarter_final[j] = match;
                    k += 1;
                    if (k === 2) {
                        break;
                    }
                }
            }
        }
        setQuarter_final(quarter_final);
        if (data.length !== 16) {
            return;
        }

        // reorder round_of_16 according to the quarter_final
        for (let i = 0; i < 4; i++) {
            const team1 = quarter_final[i].team1;
            const team2 = quarter_final[i].team2;

            let k = i * 2;
            for (let j = 0; j < 8; j++) {
                if (round_of_16[j].team1 === team1 || round_of_16[j].team2 === team1
                    || round_of_16[j].team1 === team2 || round_of_16[j].team2 === team2) {

                    let match = round_of_16[k];
                    round_of_16[k] = round_of_16[j];
                    round_of_16[j] = match;
                    k += 1;
                    if (k === 4) {
                        break;
                    }
                }
            }
        }
        setRound_of_16(round_of_16);
    }

    function getGroupStanding() {
        fetch(`http://localhost:5000/groupstanding/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setGroupStanding(data);
            }).catch((error) => {
            console.error("Error fetching data:", error);
        });

        return(
            <div className="groupstanding">
                {groupStanding.map( all => (
                    <div key={all.tournament_id} className="tournament-group">
                        <h2 style={{textAlign: 'center'}}>
                            {all.tournament_id}
                        </h2>
                        {all.stagedlist.map(staged => (
                            <div style={{textAlign: 'center'}} key={all.tournament_id / staged.stage_number} className="stage-group">
                                {staged.grouplist.map(grouped => (
                                    <div key={all.tournament_id / staged.stage_number / grouped.group_name} className="group-group">
                                        <div className="table-div">
                                            <h4 style={{textAlign: 'center'}}>
                                                {grouped.group_name}
                                            </h4>

                                            <div className="table-container">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th>Position</th>
                                                        <th>Team</th>
                                                        <th>P</th>
                                                        <th>W</th>
                                                        <th>D</th>
                                                        <th>L</th>
                                                        <th>GF</th>
                                                        <th>GA</th>
                                                        <th>GD</th>
                                                        <th>Points</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {grouped.group_standings.map(groupstanding => (
                                                        <Groupstanding key={groupstanding.tournament_id / groupstanding.stage_number / groupstanding.group_name} {...groupstanding} />
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        )
    }


        



    function matchComponent(match) {
        return (
            <Link style={{text_decoration:'none'}} to={`/matches/${match.match_id}`}>
                {(match.winner) ?
                <p><span className="winner">{match.team1} {match.home_team_score}</span> - {match.away_team_score} {match.team2}</p>
                :
                <p>{match.team1} {match.home_team_score} - <span className="winner"> {match.away_team_score} {match.team2}</span></p>
                }
            </Link>
        )
    }

    return (
        <div>
            {
            (tournamentDetails.length >= 16 ) ? (
            <div className="wrapper">
                <div className="item">
                    <div className="item-parent">
                        {matchComponent(final[0])}
                    </div>
                    <div className="item-childrens">
                        <div className="item-child">
                            <div className="item">
                                <div className="item-parent">
                                    {matchComponent(semi_final[0])}
                                </div>
                                <div className="item-childrens">
                                    <div className="item-child">
                                        <div className="item">
                                            <div className="item-parent">
                                                {matchComponent(quarter_final[0])}
                                            </div>
                                            <div className="item-childrens">
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[0])}
                                                </div>
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[1])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-child">
                                        <div className="item">
                                            <div className="item-parent">
                                                {matchComponent(quarter_final[1])}
                                            </div>
                                            <div className="item-childrens">
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[2])}
                                                </div>
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[3])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item-child">
                            <div className="item">
                                <div className="item-parent">
                                    {matchComponent(semi_final[1])}
                                </div>
                                <div className="item-childrens">
                                    <div className="item-child">
                                        <div className="item">
                                            <div className="item-parent">
                                                {matchComponent(quarter_final[2])}
                                            </div>
                                            <div className="item-childrens">
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[4])}
                                                </div>
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[5])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="item-child">
                                        <div className="item">
                                            <div className="item-parent">
                                                {matchComponent(quarter_final[3])}
                                            </div>
                                            <div className="item-childrens">
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[6])}
                                                </div>
                                                <div className="item-child">
                                                    {matchComponent(round_of_16[7])}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) :
            (
            (tournamentDetails.length === 8) ? (
            <div className="wrapper">
                <div className="item">
                    <div className="item">
                        <div className="item-parent">
                            {matchComponent(final[0])}
                        </div>
                        <div className="item-childrens">
                            <div className="item-child">
                                <div className="item">
                                    <div className="item-parent">
                                        {matchComponent(semi_final[0])}
                                    </div>
                                    <div className="item-childrens">
                                        <div className="item-child">
                                            {matchComponent(quarter_final[0])}
                                        </div>
                                        <div className="item-child">
                                            {matchComponent(quarter_final[1])}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="item-child">
                                <div className="item">
                                    <div className="item-parent">
                                        {matchComponent(semi_final[1])}
                                    </div>
                                    <div className="item-childrens">
                                        <div className="item-child">
                                            {matchComponent(quarter_final[2])}
                                        </div>
                                        <div className="item-child">
                                            {matchComponent(quarter_final[3])}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) :
            (
            (tournamentDetails.length === 4 || tournamentDetails.length === 3) ? (
            <div className="wrapper">
                <div className="item">
                    <div className="item">
                        <div className="item-parent">
                            {matchComponent(final[0])}
                        </div>
                        <div className="item-childrens">
                            <div className="item-child">
                                <div className="item">
                                    <div className="item">
                                        {matchComponent(semi_final[0])}
                                    </div>
                                </div>
                            </div>
                            <div className="item-child">
                                <div className="item">
                                    <div className="item">
                                        {matchComponent(semi_final[1])}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) :
            (
            (tournamentDetails.length === 2) ?
            (
            <div className="wrapper">
                <div className="item">
                    <div className="item">
                        <div className="item" style={{marginTop: "20px"}}>
                            {matchComponent(final[0])}
                        </div>
                    </div>
                </div>
            </div>
            ) :
            (
            <div className={"matches"}>
                <div>
                    {tournamentDetails.map((match, index) => (
                        <Match key={index} match={match} goals={[]} onMatchDelete={onMatchDelete} />
                    ))}
                </div>
            </div>
            )
            )
            )
            )
            }
            <div style={{padding: '30px'}}>
                <h4 className="awards-title">Tournament Awards</h4>
                <div className="awards">
                    {awards.map((award) => (
                            <div className="award">
                                <h3>{award.award_name}</h3>
                                <Link style={{text_decoration:'none'}} to={`/players/${award.player_id}`}>
                                    <p>{award.given_name} {award.family_name}</p>
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}