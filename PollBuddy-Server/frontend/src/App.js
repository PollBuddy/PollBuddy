import React from 'react';
import { Router, Link } from "@reach/router";


import './App.css';
import Myclasses from './pages/myclasses'
import Homepage from './pages/homepage'
import Login from './pages/login'
import Classcreation from './pages/classcreation'

function App() {

  return (
    <React.Fragment>
      {/* 
        Reach Router implementation.
        Each page/component with a path has its own route defined below.
        Link to them with link tags
      */}  
      <Router>
        <Myclasses path="/myclasses" />
        <Homepage path="/" />
        <Login path= "/login" />
        <Classcreation path= "/classcreation" />
      </Router>
    </React.Fragment>
  );
}


export default App;
