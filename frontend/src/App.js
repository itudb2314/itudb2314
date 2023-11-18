import './App.css';
import React from 'react';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

import Header from './js/Header';
import Tournaments from './js/Tournament';
import Squads from './js/Squads'; // Assuming you have a Squads component

function App() {
    return (
        <div className="App">
            <Router>
                <Header/>
                <Switch>
                    <Route path="/tournaments" exact component={Tournaments} />
                    <Route path="/squads" exact component={Squads} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
