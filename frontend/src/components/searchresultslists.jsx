import React from "react";
import "../css/searchresultslist.css";
import { SearchResult } from "./searchresult";

export const SearchResultsList = ({ results }) => {
    return <div className="results-list">
        {
            (results.length !== 0 && results.map((result, id) => {
                return <SearchResult result={result} key={id} />
            }))
        }

    </div>

}