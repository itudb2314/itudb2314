import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Tournaments from "./js/Tournament";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Tournaments}/>
            </Switch>
        </Router>
    );
}

function Hello() {
    return <div>
        <h1>Hello World</h1>
    </div>
}

export default App;
