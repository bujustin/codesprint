import React from 'react';
import Home from './Home';
import AppNavbar from './AppNavbar';
import About from './About';
import SoloGame from './SoloGame';
import MultiGame from './MultiGame';
import '../css/App.css';
import { BrowserRouter as Router, Route } from "react-router-dom"; 

function App() {
  return (
    <Router>
      <AppNavbar />
      <div className="App">

        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/solo-game" component={SoloGame} />
        <Route exact path="/multi-game/:roomName" component={MultiGame} />
      </div>
    </Router>
  );
}

export default App;