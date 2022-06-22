import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import {socketIoHost} from "../util/host";
import {useParams} from "react-router-dom";
import {useInterval} from "../util/useInterval";

import drinkBits from '../img/TomaSip.gif';
import blowKiss from '../img/TomaBlowKiss.gif';
import sleep from '../img/TomaSleep.gif';
import exclaim from '../img/TomaExclaim.gif';
import lightstick from '../img/TomaLightStick.gif';
import wave from '../img/TomaWave.gif';
import gift from '../img/TomaGift.gif';
import idle from '../img/TomaBase.gif';

import '../css/TomaAnimations.css';

const EVENT_TYPES = {
    KISS: 'KISS',
    SLEEP: 'SLEEP',
    BITS: 'BITS',
    EXCLAIM: 'EXCLAIM',
    LIGHTSTICK: 'LIGHTSTICK',
    WAVE: 'WAVE',
    GIFT: 'GIFT',
}

/**
 * Handle chat message events
 * @param {string} username - the chatting user's name
 * @param {boolean} isMod - If the user is a stream mod
 * @param {boolean} isFirst - Is it the user's first message
 * @param {string} message - The message the user sent
 */
const getEventFromChatMessage = (username, isMod, isFirst, message, key) => {
    const normalizedMessage = message.toLowerCase();

    // Wave
    if (isFirst) {
        return {
            type: EVENT_TYPES.WAVE,
            image: wave,
            duration: 3000,
            key,
            text: `Hi, ${username}`,
        }
    }

    // Kiss
    const modNames = ['void', 'hamster', 'hampter', 'viking', 'nikko', 'niko', 'nikkouru', 'ice', 'adobo', 'panda']
        .filter((name) => {
            return normalizedMessage.includes(name);
        });
    if (modNames.length > 0) {
        return {
            type: EVENT_TYPES.KISS,
            image: blowKiss,
            duration: 3000,
            key,
        };
    }

    // Sleep
    if (normalizedMessage.startsWith('!lurk')) {
        return {
            type: EVENT_TYPES.SLEEP,
            image: sleep,
            duration: 5000,
            key,
            text: `Enjoy the lurk, ${username}`
        };
    }
    if (normalizedMessage.includes('toemaComfy') || normalizedMessage.includes('toemaComf')) {
        return {
            type: EVENT_TYPES.SLEEP,
            image: sleep,
            duration: 3000,
            key,
        };
    }

    // Exclaim
    if (normalizedMessage.startsWith("!so") && isMod) {
        const messageSplit = normalizedMessage.split(" ");
        if (messageSplit.length >= 2) {
            const userToShoutOut = messageSplit[1];
            return {
                type: EVENT_TYPES.EXCLAIM,
                image: exclaim,
                duration: 3000,
                key,
                text: 'Cutie spotted!',
                subText: `Check out ${userToShoutOut}`
            }
        }
    }
    if (['!patreon', '!throne', '!socials', '!discord', '!youtube']
        .filter(cmd => normalizedMessage.startsWith(cmd)).length > 0) {
        return {
            type: EVENT_TYPES.EXCLAIM,
            image: exclaim,
            duration: 3000,
            key,
        }
    }

    // Lightstick
    if (['bebebe', 'toemaCheer', 'toemaRave']
        .filter(word => normalizedMessage.includes(word)).length > 0) {
        return {
            type: EVENT_TYPES.LIGHTSTICK,
            image: lightstick,
            duration: 3000,
            key,
        }
    }
}

export const Toma = () => {
    const params = useParams();
    const [events, setEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState(null);
    const durationLeft = useRef(0);
    const eventsRef = useRef([]);

    const addEvent = (type, image, duration, key, text, subText) => {
        setEvents([...eventsRef.current, {
            type,
            image,
            duration,
            key,
            text,
            subText,
        }]);
    }

    useEffect(() => {
        eventsRef.current = events;
    }, [events, setEvents]);

    useEffect(() => {
        const socket = io(socketIoHost, { query: `user=${params.user}`});

        socket.on('disconnect', () => {
            console.log('Disconnected from socketio server');
        });

        socket.on('chat', data => {
            const key = new Date().getTime();
            const event = getEventFromChatMessage(
               data.username,
               data.isMod,
               data.isFirst,
               data.message,
               key
           );
           if (event)
               addEvent(
                   event.type,
                   event.image,
                   event.duration,
                   event.key,
                   event.text,
                   event.subText
               );
        });
        socket.on('hosted', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.EXCLAIM,
                exclaim,
                8000,
                key,
                `${data.username} is hosting with ${data.viewers} viewers!`,
            )
        });
        socket.on('gift_sub', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.GIFT,
                gift,
                8000,
                key,
                `${data.gifter} has gifted ${data.giftAmount} subs!`
            )
        });
        socket.on('sub', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.GIFT,
                gift,
                8000,
                key,
                `${data.subber} just subbed!`,
                data.message
            )
        });
        socket.on('tmi_resubbed', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.GIFT,
                gift,
                8000,
                key,
                `${data.username} just resubbed!`,
                data.message
            )
        });
        socket.on('raid', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.LIGHTSTICK,
                lightstick,
                8000,
                key,
                `${data.raider} is raiding with ${data.viewers}`,
            );
        });
        socket.on('cheer', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.BITS,
                drinkBits,
                8000,
                key,
                `${data.cheerer} cheered ${data.amount} bits!`,
                data.amount >= 200 ? data.message : null
            );
        });
        socket.on('follow', data => {
            const key = new Date().getTime();
            addEvent(
                EVENT_TYPES.WAVE,
                wave,
                3000,
                key,
                `${data.follower} just followed!`
            );
        })
        socket.on('redeem', data => {
           const key = new Date().getTime();
           addEvent(EVENT_TYPES.WAVE, wave, 3000, key, `Hi, ${data.redeemer}!`);
        });
    }, []);

    useInterval(() => {
        if (durationLeft.current > 0) {
            durationLeft.current -= 1000;
        } else {
            if (events.length > 0) {
                setCurrentEvent(null);
                const event = events.shift();
                setEvents(events);
                durationLeft.current = event.duration;
                setCurrentEvent(event);
            } else {
                if (currentEvent != null) {
                    setCurrentEvent(null);
                }
            }
        }
    }, 1000);

    const imageToUse = currentEvent ? currentEvent.image : idle;
    const textToShow = currentEvent ? currentEvent.text : null;
    const subTextToShow = currentEvent ? currentEvent.subText : null;
    const key = currentEvent ? currentEvent.key : '1';

    return <div className="toma-animations">
        <div>
            {currentEvent && <div key={key}><img src={imageToUse} width={449.5} height={283.75} key={key} /></div>}
            {!currentEvent && <div><img src={idle} width={449.5} height={283.75} key={key} /></div>}
        </div>
        {(textToShow || subTextToShow) && (
            <div className="text-area">
                {textToShow && <div className="text">{textToShow}</div>}
                {subTextToShow && <div className="subtext">{subTextToShow}</div>}
            </div>
        )}
    </div>
};