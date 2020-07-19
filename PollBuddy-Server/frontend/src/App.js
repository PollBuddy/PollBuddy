import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom"

import Myclasses from "./pages/myclasses/myclasses"
import Homepage from "./pages/homepage/homepage"
import Login from "./pages/loginPage/login"
import Classcreation from "./pages/classcreation/classcreation"
import Lessons from "./pages/lessons/lessons"
import Lesson from "./pages/lesson/lesson"
import Notfound from "./pages/notfound/notfound"
import Template from "./pages/template/template"
import AccountInfo from "./pages/accountinfo/accountinfo"
import Privacy from "./pages/privacy/privacy"
import ForgotPassword from "./pages/forgotPassword/forgotPassword"
import RegisterDefault from "./pages/registerDefault/registerDefault";
import RegisterWithSchool from "./pages/registerWithSchool/registerWithSchool";
import RegisterWithPollBuddy from "./pages/registerWithPollBuddy/registerWithPollBuddy";
import PollViewer from "./pages/pollviewer/pollviewer";
import ResetPassword from "./pages/resetPassword/resetPassword";
import PollDataView from "./pages/pollDataView/pollDataView";

import Header from "./components/header/header.js"
import Footer from "./components/footer/footer.js"

import "./styles/main.scss";

export default class App extends React.Component {

  state = {
    pageTitle: "",
    userInfo: {
      sessionIdentifier: ""
    }
  };

  updateTitle(t) {
    this.setState({pageTitle: t});
    document.title = t + " - Poll Buddy";
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
            <Homepage updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/myclasses">
            <Myclasses updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/lessons">
            <Lessons updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/lesson/:lessonId">
            <Lesson updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/login">
            <Login updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/classcreation">
            <Classcreation updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/template">
            <Template updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/accountinfo">
            <AccountInfo updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/forgotPassword">
            <ForgotPassword updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/registerDefault">
            <RegisterDefault updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/registerWithSchool">
            <RegisterWithSchool updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/registerWithPollBuddy">
            <RegisterWithPollBuddy updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/privacy">
            <Privacy updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/resetPassword">
            <ResetPassword updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/pollDataView">
            <PollDataView updateTitle={this.updateTitle} />
          </Route>
          <Route exact path="/pollviewer">
            <PollViewer updateTitle={this.updateTitle} />
          </Route>
       
          {/* Default route/error page */}
          <Route>
            <Notfound updateTitle={this.updateTitle} />
          </Route>
        </Switch>

        <Footer/>

      </BrowserRouter>

    )
  }
}

