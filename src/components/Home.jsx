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
        <input type="button" onClick={() => setShouldNavigate(true)} value="Show overlay" />
    </div>
  );
}

export default Home;
