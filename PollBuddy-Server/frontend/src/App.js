import React from 'react';
import { Router } from "@reach/router";


import './App.css';
import Myclasses from './pages/myclasses'
import Homepage from './pages/homepage'
import Login from './pages/Login Page/login'
import Classcreation from './pages/classcreation/classcreation'
import Lessons from './pages/lessons/lessons'
import Lesson from './pages/lesson'
import Notfound from './pages/notfound'
import Template from './pages/template/template'
import AccountInfo from './pages/accountinfo/accountinfo'
import PollCode from './pages/pollCode'
import ForgotPassword from './pages/forgotPassword'
import RegisterDefault from "./pages/registerDefault";
import RegisterWithSchool from "./pages/registerWithSchool";
import RegisterWithPollBuddy from "./pages/registerWithPollBuddy";

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
        <Lessons path="/lessons" />
        <Notfound default />
        <Lesson path="/lesson/:lessonId" />
        <Login path="/login" />
        <Classcreation path="/classcreation" />
        <Template path="/template" />
        <AccountInfo path="/accountinfo"/>
        <PollCode path="/pollCode" /> 
        <ForgotPassword path="/forgotPassword" />
        <RegisterDefault path="/registerDefault" />
        <RegisterWithSchool path="/registerWithSchool" />
        <RegisterWithPollBuddy path="/registerWithPollBuddy" />
      </Router>
    </React.Fragment>
  );
}


export default App;
