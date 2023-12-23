import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import messi from '../assets/messi.jpg';

const Home = () => {
    const history = useHistory();

    function handleClick() {
        history.push("/tournaments");
    }

    return (
        <div style={styles.container}>
            <div style={styles.overlay}>
                <h1 style={styles.title} onClick={handleClick}>FIFA WORLD CUP</h1>
            </div>
            <img src={messi} alt="Messi" style={styles.image} />
        </div>
    );
};

const styles = {
    container: {
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
    },
    overlay: {
        position: "absolute",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, 0)",
        textAlign: "center",
        color: "#fff",
        width: "100%",
        cursor: "pointer",
    },
    title: {
        fontSize: "2.5rem",
        margin: 0,
    },
    image: {
        width: "100%",
        height: "auto",
        objectFit: "cover",
    },
};

export default Home;
