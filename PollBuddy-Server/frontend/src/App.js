import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import About from "./pages/about/about";

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
            <Route exact path="/privacy">
              <Privacy updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/faq">
              <FAQ updateTitle={this.updateTitle} />
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
            <Route exact path="/polls/:pollID/results">
              <PollDataView updateTitle={this.updateTitle} />
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
            
            <Route exact path="/contact">
              <Contact updateTitle={this.updateTitle} />
            </Route>
            <Route exact path="/about">
              <About updateTitle={this.updateTitle} />
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
