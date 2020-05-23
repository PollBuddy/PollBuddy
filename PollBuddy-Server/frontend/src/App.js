import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'

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
import Privacy from './pages/privacy/privacy'
import PollCode from './pages/pollCode'
import ForgotPassword from './pages/forgotPassword'
import RegisterDefault from "./pages/registerDefault";
import RegisterWithSchool from "./pages/registerWithSchool";
import RegisterWithPollBuddy from "./pages/registerWithPollBuddy";
import ResetPassword from "./pages/resetPassword";
import PollDataView from "./pages/pollDataView";

import Header from "./components/header/header.js"
import Footer from "./components/footer/footer.js"

export default class App extends React.Component {

  state = {
    pageTitle: "",
    userInfo: {
      sessionIdentifier: ""
    }
  };

  updateTitle(t) {
    this.setState({pageTitle: t});
    document.title = t;
  }

  render() {
    this.updateTitle = this.updateTitle.bind(this);
     return (
          <BrowserRouter>

            <Header title={this.state.pageTitle} userInfo={this.state.userInfo} />

            {/*
            Using React BrowserRouter now

            See https://codeburst.io/getting-started-with-react-router-5c978f70df91
            We will likely want to nest a lot of these later, this link has some details how
          */}

            <Switch>
              <Route exact path="/">
                <Homepage/>
              </Route>
              <Route exact path="/myclasses">
                <Myclasses/>
              </Route>
              <Route exact path="/lessons">
                <Lessons/>
              </Route>
              <Route exact path="/lesson/:lessonId">
                <Lesson/>
              </Route>
              <Route exact path="/login">
                <Login/>
              </Route>
              <Route exact path="/classcreation">
                <Classcreation/>
              </Route>
              <Route exact path="/template">
                <Template/>
              </Route>
              <Route exact path="/accountinfo">
                <AccountInfo/>
              </Route>
              <Route exact path="/pollCode">
                <PollCode/>
              </Route>
              <Route exact path="/forgotPassword">
                <ForgotPassword/>
              </Route>
              <Route exact path="/registerDefault">
                <RegisterDefault/>
              </Route>
              <Route exact path="/registerWithSchool">
                <RegisterWithSchool/>
              </Route>
              <Route exact path="/registerWithPollBuddy">
                <RegisterWithPollBuddy/>
              </Route>
              <Route exact path="/privacy">
                <Privacy/>
              </Route>
              <Route exact path="/resetPassword">
                <ResetPassword/>
              </Route>
              <Route exact path="/pollDataView">
                <PollDataView/>
              </Route>
              {/* Default route/error page */}
              <Route component={Notfound}/>
            </Switch>

            <Footer/>

          </BrowserRouter>

    )
  }
}

