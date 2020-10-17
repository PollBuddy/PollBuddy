import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import Group from "./pages/Groups/Groups";
import Homepage from "./pages/Homepage/Homepage";
import LoginWithPollBuddy from "./pages/LoginWithPollBuddy/LoginWithPollBuddy";
import GroupCreation from "./pages/GroupCreation/GroupCreation";
import GroupEditor from "./pages/GroupEditor/GroupEditor";
import GroupPolls from "./pages/GroupPolls/GroupPolls";
import PollEditor from "./pages/PollEditor/PollEditor";
import Notfound from "./pages/Error404/Error404";
import Template from "./pages/Template/Template";
import FAQ from "./pages/FAQ/FAQ";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import Privacy from "./pages/Privacy/Privacy";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import RegisterDefault from "./pages/RegisterDefault/RegisterDefault";
import RegisterWithSchool from "./pages/RegisterWithSchool/RegisterWithSchool";
import RegisterWithPollBuddy from "./pages/RegisterWithPollBuddy/RegisterWithPollBuddy";
import PollViewer from "./pages/PollViewer/PollViewer";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import PollResults from "./pages/PollResults/PollResults";
import PollManager from "./pages/PollManager/PollManager";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import QuestionEnded from "./pages/QuestionEnded/QuestionEnded";
import AnswerRecorded from "./pages/AnswerRecorded/AnswerRecorded";
import LoginDefault from "./pages/LoginDefault/LoginDefault";
import LoginWithSchool from "./pages/LoginWithSchool/LoginWithSchool";
import PollHistory from "./pages/PollHistory/PollHistory";

import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";

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

        <MDBContainer id="wrapper">

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

            <Route exact path="/about">
              <About updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/contact">
              <Contact updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/faq">
              <FAQ updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/privacy">
              <Privacy updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/groups">
              <Group updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/groups/new">
              <GroupCreation updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/groups/:groupID/polls">
              <GroupPolls updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/groups/:groupID/edit">
              <GroupEditor updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/polls/:pollID/view">
              <PollViewer updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/polls/:pollID/edit">
              <PollEditor updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/polls/:pollID/manage">
              <PollManager updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/polls/:pollID/results">
              <PollResults updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/questionEnded">
              <QuestionEnded updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/answerRecorded">
              <AnswerRecorded updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/login">
              <LoginDefault updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/login/pollbuddy">
              <LoginWithPollBuddy updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/login/school">
              <LoginWithSchool updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/login/forgot">
              <ForgotPassword updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/login/reset">
              <ResetPassword updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/register">
              <RegisterDefault updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/register/pollbuddy">
              <RegisterWithPollBuddy updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/register/school">
              <RegisterWithSchool updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/account">
              <AccountInfo updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/template">
              <Template updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/polls/:pollID/history">
              <PollHistory updateTitle={this.updateTitle} />
            </Route>

            {/* Default route/error page */}
            <Route>
              <Notfound updateTitle={this.updateTitle} />
            </Route>
          </Switch>

          <Footer/>

        </MDBContainer>

      </BrowserRouter>

    );
  }
}
