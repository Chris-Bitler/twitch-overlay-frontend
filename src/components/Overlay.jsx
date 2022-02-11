import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import '../css/Overlay.css';
import useWebSocket from "react-use-websocket";
import { convertEventToUserDisplay } from "../util/eventConverters";
import {OverlayPart} from "./OverlayPart";

export const Overlay = () => {
    const params = useParams();
    const { sendJsonMessage, lastMessage, readyState } = useWebSocket("wss://void-twitch-overlay.herokuapp.com/ws", {
        shouldReconnect: true,
        reconnectAttempts: 10,
        reconnectInterval: 3000
    });
    const [recentEvents, setRecentEvents] = useState([]);
    useEffect(() => {
        if (readyState === 1) {
            const showUser = {
                type: 'ADD_USER',
                user: params.user
            };
            sendJsonMessage(showUser);
        }
    }, [readyState]);

    useEffect(() => {
       if (lastMessage != null) {
           const eventMessage = convertEventToUserDisplay(JSON.parse(lastMessage?.data));
           // @ts-ignore
           eventMessage.key = new Date().getTime();
           if (recentEvents.length >= 4) {
               setRecentEvents([eventMessage, ...recentEvents.slice(0,3)]);
           } else {
               setRecentEvents([eventMessage, ...recentEvents]);
           }
       }
    }, [lastMessage]);


    return <div>
        {recentEvents.map((event, index) => {
            return <OverlayPart event={event} num={index} key={event.key} />
        })}
    </div>
}