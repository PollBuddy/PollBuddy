import React from 'react';
import { Router, Link } from "@reach/router";


import './App.css';
import Homepage from './pages/homepage'
import Myclasses from './pages/myclasses'
import Lessons from './pages/lessons';
import Lesson from './pages/lesson';

function App() {

  return (
    <React.Fragment>
      {/* 
        Reach Router implementation.
        Each page/component with a path has its own route defined below.
        Link to them with link tags
      */}  
      <Router>
        <Homepage path="/" />
        <Myclasses path="/myclasses" />
        <Lessons path="/lessons" />
        <Lesson path="/lesson" />
      </Router>
    </React.Fragment>
  );
}


export default App;
