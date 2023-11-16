import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Tournaments from './js/Tournament';
import Squads from './js/Squads'; // Assuming you have a Squads component

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Squads} />
                <Route path="/tournaments" exact component={Tournaments} />
                <Route path="/squads" exact component={Squads} />
            </Switch>
        </Router>
    );
}

export default App;
