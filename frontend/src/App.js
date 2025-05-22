import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import SubmitTalk from './pages/SubmitTalk';
import Talks from './pages/Talks';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <h1 className="logo">NDC Oslo 2025</h1>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/submit">Submit Talk</Link></li>
              <li><Link to="/talks">Talks</Link></li>
            </ul>
          </div>
        </nav>

        <div className="container main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/submit" element={<SubmitTalk />} />
            <Route path="/talks" element={<Talks />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 NDC Oslo. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;