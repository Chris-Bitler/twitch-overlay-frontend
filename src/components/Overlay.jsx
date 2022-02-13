import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import '../css/Overlay.css';
import { OverlayPart } from "./OverlayPart";
import { io } from "socket.io-client";
import { socketIoHost } from "../util/host";

export const Overlay = () => {
    const params = useParams();
    const [recentEvents, setRecentEvents] = useState([]);
    const recentEventsRef = useRef([]);

    const addToRecentEvents = (event) => {
        if (recentEventsRef.current.length >= 4) {
            setRecentEvents([event, ...recentEventsRef.current.slice(0,3)]);
        } else {
            setRecentEvents([event, ...recentEventsRef.current]);
        }
    };

    useEffect(() => {
        recentEventsRef.current = recentEvents
    }, [recentEvents, setRecentEvents]);

    useEffect(() => {
        const socket = io(socketIoHost, { query: `user=${params.user}`});
        const key = new Date().getTime();
        socket.on('connect', () => {
            console.log('Connected to socketio server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from socketio server');
        });
        socket.on('sub', data => {
            addToRecentEvents({ username: data.subber, text: 'Sub', key });
        });
        socket.on('raid', data => {
            addToRecentEvents({ username: data.raider, text: `Raid (${data.viewers} viewers)`, key })
        });
        socket.on('cheer', data => {
           addToRecentEvents({ username: data.cheerer, text: `${data.amount} bits`, key })
        });
        socket.on('follow', data => {
            addToRecentEvents({ username: data.follower, text: 'Follow', key });
        })
        socket.on('gift_sub', data => {
            let text = 'Gift x1';
            if (data.giftAmount) {
                text = `Gift x${data.giftAmount}`;
            }
            if (data.cumulativeGiftAmount) {
                text += ` (${data.cumulativeGiftAmount})`;
            }
            addToRecentEvents({ username: data.gifter, text, key });
        });
        return () => {
            socket.disconnect();
        }
    }, []);

    return <div>
        {recentEvents.map((event, index) => {
            return <OverlayPart event={event} num={index} key={event.key} />
        })}
    </div>
}