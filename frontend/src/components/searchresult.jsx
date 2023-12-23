import React from "react";
import { useHistory } from "react-router-dom";
import "../css/searchresult.css";

export const SearchResult = ({ result }) => {
    const history = useHistory();

    const handleResultClick = () => {
        history.push(`/players/${result.player_id}`);
    };

    return <div className="search-result" onClick={handleResultClick}>
        {result.given_name} {result.family_name}
    </div>;

}
