import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Header from './js/Header';
import Tournaments from './js/Tournament';
import Squads from './js/Squads'; // Assuming you have a Squads component
import Matches from './js/Matches'; 

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/tournaments" exact component={Tournaments} />
                <Route path="/squads" exact component={Squads} />
                <Route path="/matches" exact component={Matches} />
            </Switch>
        </Router>
    );
}

export default App;
