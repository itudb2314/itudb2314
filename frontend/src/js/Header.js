import React from "react";
import { Link } from "react-router-dom";
import '../css/Header.css';

export default function Header() {
    return (
        <header>
            <ul>
                <li><Link className="menu_item" to="/tournaments">Tournaments</Link></li>
                <li><Link className="menu_item" to="/squads">Squads</Link></li>
                <li><Link className="menu_item" to="/players">Players</Link></li>
                <li><Link className="menu_item" to="/matches">Matches</Link></li>
                <li><Link className="menu_item" to="/teams">Teams</Link></li>
                <li><Link className="menu_item" to="/groups_and_standings">Groups and Standings</Link></li>
                <li><Link className="menu_item" to="/managers">Managers</Link></li>
                <li><Link className="menu_item" to="/awards">Awards</Link></li>
                <li><Link className="menu_item" to="/appearances">Appearances</Link></li>
            </ul>
        </header>
    );
}
