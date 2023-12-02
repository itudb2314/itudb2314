import React, {useEffect} from "react";
import { useParams } from "react-router-dom";

export default function TournamentDetails() {
    const { id } = useParams();
    function getTournamentDetails(){
        return fetch(`http://localhost:5000/tournaments/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    useEffect(() => {
        getTournamentDetails();
    }, []);
}