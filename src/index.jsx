import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Overlay} from "./components/Overlay";
import {RewardOverlay} from "./components/RewardOverlay";
import {HamsterOverlay} from "./components/Hamster";

/* @ts-ignore */
ReactDOM.render(
  <React.StrictMode>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="overlay/:user" element={<Overlay />} />
                  <Route path="overlay/rewards/:user/:rewardId" element={<RewardOverlay />} />
                  <Route path="hamster" element={<HamsterOverlay />} />
              </Routes>
          </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
