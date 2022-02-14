import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import {socketIoHost} from "../util/host";
import "../css/Hamster.css";

export const HamsterOverlay = () => {
    const [currentHamster, setCurrentHamster] = useState(null);
    const [hamsterQueue, setHamsterQueue] = useState([]);
    const hamsterQueueRef = useRef([]);
    const currentHamsterRef = useRef(null);
    useEffect(() => {
        const socket = io(socketIoHost, {});
        socket.on('connect', () => {
            console.log('Connected to socketio server');
        });
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        socket.on('hamster', (data) => {
            setHamsterQueue([...hamsterQueueRef.current, data]);
        });
        setInterval(() => {
            setCurrentHamster(null);
            if (hamsterQueueRef.current.length > 0) {
                const hamster = hamsterQueueRef.current.pop();
                setHamsterQueue(hamsterQueueRef.current);
                setCurrentHamster(hamster);
            }
        }, 5000);
    }, []);

    useEffect(() => {
        currentHamsterRef.current = currentHamster;
    }, [setCurrentHamster, currentHamster]);

    useEffect(() => {
       hamsterQueueRef.current = hamsterQueue;
    }, [setHamsterQueue, hamsterQueue]);

    return currentHamster != null ? (
        <div className="hamster-container" key={currentHamster.id}>
            <div>
                <img className="hamster-image" src="./hamster.png" />
            </div>
            <div className="hamster-text">
                {currentHamster.redeemer} has squished the hamster!
            </div>
        </div>
    ) : <div />;
};