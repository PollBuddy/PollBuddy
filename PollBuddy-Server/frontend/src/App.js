import React from 'react';
import { Router } from "@reach/router";

// ---- MDBReact ----
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import './App.css';
import Homepage from './pages/homepage'
import About from './pages/about/about.js'
import Myclasses from './pages/myclasses'
import Settings_page from './pages/settings_page'
import Lessons from './pages/lessons';
import Lesson from './pages/lesson';
import Notfound from './pages/notfound'

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
        <About path="/about" />
        <Myclasses path="/myclasses" />
        <Settings_page path="/settings_page" />
        <Lessons path="/lessons" />
        <Lesson path="/lesson/:lessonId" />
        <Notfound default />
      </Router>
    </React.Fragment>
  );
}


export default App;
