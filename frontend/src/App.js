import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './js/Header';
import Tournaments from './js/Tournament';
import TournamentDetails from './js/TournamentDetails';
import Squads from './js/Squads'; // Assuming you have a Squads component
import Matches from './js/Matches';
import Teams from './js/Teams';
import Groupstandings from './js/Groups_and_standing';
import Managers from './js/Managers';
import PlayerPage from './js/Player';
import Players from './js/Players';
import SingleSquadPage from './js/Squad';
import Awards from "./js/Awards";
import Appearances from "./js/appearances";
import Teamstats from './js/Teamstats';

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/tournaments" exact component={Tournaments} />
                <Route path="/tournaments/:id" component={TournamentDetails} />
                <Route path="/squads" exact component={Squads} />
                <Route path="/matches/:match_id?" exact component={Matches} />
                <Route path="/teams" exact component={Teams} />
                <Route path="/teams/:id" exact component={Teamstats} />
                <Route path="/groups_and_standings" exact component={Groupstandings} />
                <Route path="/managers" exact component={Managers} />
                <Route path="/players" exact component={Players} />
                <Route path="/players/:playerId" exact component={PlayerPage} />
                <Route path="/squads/:tournamentId/:teamId" exact component={SingleSquadPage} />
                <Route path="/awards" exact component={Awards} />
                <Route path="/appearances" exact component={Appearances} />
            </Switch>
        </Router>
    );
}

export default App;
