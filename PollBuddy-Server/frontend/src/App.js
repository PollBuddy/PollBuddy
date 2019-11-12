import React from 'react';
import { Router } from "@reach/router";

// ---- MDBReact ----
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';

import './App.css';
import Homepage from './pages/homepage'
import Myclasses from './pages/myclasses'
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
        <Myclasses path="/myclasses" />
        <Lessons path="/lessons" />
        <Lesson path="/lesson/:lessonId" />
        <Notfound default />
      </Router>
    </React.Fragment>
  );
}


export default App;
