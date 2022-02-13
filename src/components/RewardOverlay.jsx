import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {socketIoHost} from "../util/host";
import "../css/RewardOverlay.css";

export const RewardOverlay = () => {
    const params = useParams();
    const user = params.user;
    const rewardId = params.rewardId;
    const [count, setCount] = useState(5);

    useEffect(() => {
        const socket = io(socketIoHost, { query: `user=${user}&rewardId=${rewardId}`});
        socket.on('connect', () => {
            console.log('Connected to socketio server');
        });
        socket.on('reward_count', (data) => {
            const eventRewardId = data.rewardId;
            const rewardAmount = data.rewardAmount;
            if (eventRewardId && rewardId === eventRewardId) {
                setCount(rewardAmount);
            }
        });
    }, []);

    return <div className="counter-container">
        <div>
            <img src="../../../Smug.png" className="smug-image" />
        </div>
        <div className="counter">
            {count} Kneecaps
        </div>
    </div>
};