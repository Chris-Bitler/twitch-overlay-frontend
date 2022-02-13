import React, {useEffect, useState} from 'react';
import '../css/Home.css';
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const navigate = useNavigate();
  const showUserOverlay = () => navigate(`/overlay/${username}`);

  useEffect(() => {
      if (shouldNavigate) {
          showUserOverlay();
      }
  }, [shouldNavigate]);

  return (
    <div className="App">
        Overlay:<br />
        Enter your twitch username and hit the button<br />
        <input type="text" onChange={(evt) => setUsername(evt?.target?.value)} /><br />
        <input type="button" onClick={() => setShouldNavigate(true)} value="Show overlay" /><br />
        <a href="https://id.twitch.tv/oauth2/authorize?client_id=mqjwij4mecjwx1phznndq706k7o4uh&redirect_uri=https://void-twitch-overlay.herokuapp.com/&response_type=code&scope=channel:read:subscriptions%20bits:read%20channel:read:redemptions">
            Click here to give the app permission to access your sub/raid/follower/reward redemption alerts
        </a>
    </div>
  );
}

export default Home;
