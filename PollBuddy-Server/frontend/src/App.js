import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import Group from "./pages/groups/groups";
import Homepage from "./pages/homepage/homepage";
import Login from "./pages/loginPage/login";
import GroupCreation from "./pages/groupCreation/groupCreation";
import Polls from "./pages/groupPolls/groupPolls";
import Poll from "./pages/pollEditor/pollEditor";
import Notfound from "./pages/notFound/notFound";
import Template from "./pages/template/template";
import FAQ from "./pages/faq/faq";
import AccountInfo from "./pages/accountInfo/accountInfo";
import Privacy from "./pages/privacy/privacy";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import RegisterDefault from "./pages/registerDefault/registerDefault";
import RegisterWithSchool from "./pages/registerWithSchool/registerWithSchool";
import RegisterWithPollBuddy from "./pages/registerWithPollBuddy/registerWithPollBuddy";
import PollViewer from "./pages/pollViewer/pollViewer";
import ResetPassword from "./pages/resetPassword/resetPassword";
import PollDataView from "./pages/pollDataView/pollDataView";

import Header from "./components/header/header.js";
import Footer from "./components/footer/footer.js";

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
            <Route exact path="/privacy">
              <Privacy updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/faq">
              <FAQ updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/pollEditor/:pollID/edit">
              <Poll updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/groups">
              <Group updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/groups/groupPolls">
              <Polls updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/groups/new">
              <GroupCreation updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/polls/:pollID/results">
              <PollDataView updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/poll/:pollID/view">
              <PollViewer updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/login">
              <Login updateTitle={this.updateTitle} />
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
            <Route exact path="/register/school">
              <RegisterWithSchool updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/register/pollbuddy">
              <RegisterWithPollBuddy updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/account">
              <AccountInfo updateTitle={this.updateTitle} />
            </Route>

            <Route exact path="/template">
              <Template updateTitle={this.updateTitle} />
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
