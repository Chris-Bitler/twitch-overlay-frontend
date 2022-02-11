import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Overlay} from "./components/Overlay";

/* @ts-ignore */
ReactDOM.render(
  <React.StrictMode>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="overlay/:user" element={<Overlay />} />
              </Routes>
          </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
