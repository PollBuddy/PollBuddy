import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import Group from "./pages/Groups/Groups";
import Homepage from "./pages/Homepage/Homepage";
import LoginWithPollBuddy from "./pages/LoginWithPollBuddy/LoginWithPollBuddy";
import GroupCreation from "./pages/GroupCreation/GroupCreation";
import GroupEdit from "./pages/GroupEdit/GroupEdit";
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
import RegisterWithSchoolStep2 from "./pages/RegisterWithSchoolStep2/RegisterWithSchoolStep2";
import RegisterWithPollBuddy from "./pages/RegisterWithPollBuddy/RegisterWithPollBuddy";
import PollViewer from "./pages/PollViewer/PollViewer";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import PollResults from "./pages/PollResults/PollResults";
import PollManager from "./pages/PollManager/PollManager";
import PollHistory from "./pages/PollHistory/PollHistory";
import Contact from "./pages/Contact/Contact";
import About from "./pages/About/About";
import QuestionEnded from "./pages/QuestionEnded/QuestionEnded";
import AnswerRecorded from "./pages/AnswerRecorded/AnswerRecorded";
import LoginDefault from "./pages/LoginDefault/LoginDefault";
import LoginWithSchool from "./pages/LoginWithSchool/LoginWithSchool";
import Code from "./pages/Code/Code";

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

          <Header userInfo={this.state.userInfo} />

          {/*
            Using React BrowserRouter now

            See https://codeburst.io/getting-started-with-react-router-5c978f70df91
            We will likely want to nest a lot of these later, this link has some details how
          */}

          <Switch>

            {/* --- Main Site Pages --- */}

            {/* Home Page */}
            <Route exact path="/">
              <Homepage updateTitle={this.updateTitle} />
            </Route>

            {/* About Poll Buddy Page */}
            <Route exact path="/about">
              <About updateTitle={this.updateTitle} />
            </Route>

            {/* Contact Us Page */}
            <Route exact path="/contact">
              <Contact updateTitle={this.updateTitle} />
            </Route>

            {/* Frequently Asked Questions (FAQ) Page */}
            <Route exact path="/faq">
              <FAQ updateTitle={this.updateTitle} />
            </Route>

            {/* Data Privacy Page */}
            <Route exact path="/privacy">
              <Privacy updateTitle={this.updateTitle} />
            </Route>

            {/* Enter Poll Code Page */}
            <Route exact path="/code">
              <Code updateTitle={this.updateTitle} />
            </Route>


            {/* --- Group Pages --- */}

            {/* My Groups Page */}
            <Route exact path="/groups">
              <Group updateTitle={this.updateTitle} />
            </Route>

            {/* Group Creation Page */}
            <Route exact path="/groups/new">
              <GroupCreation updateTitle={this.updateTitle} />
            </Route>

            {/* Group's Polls Page */}
            <Route exact path="/groups/:groupID/polls">
              <GroupPolls updateTitle={this.updateTitle} />
            </Route>

            {/* Group Edit Page */}
            {/*use the render function so that we can retrieve :groupID from inside the component*/}
            <Route exact path="/groups/:groupID/edit"
              render={ (props) => (<GroupEdit {...props} updateTitle={this.updateTitle} />) }
            />


            {/* --- Poll Pages --- */}

            {/* Poll Viewer Page */}
            <Route exact path="/polls/:pollID/view"
              render={ (props) => (<PollViewer {...props} updateTitle={this.updateTitle} />) }
            />

            {/* Poll Editor Page */}
            <Route exact path="/polls/:pollID/edit">
              <PollEditor updateTitle={this.updateTitle}/>
            </Route>

            {/* Poll Manager Page */}
            <Route exact path="/polls/:pollID/manage">
              <PollManager updateTitle={this.updateTitle} />
            </Route>

            {/* Poll Results Page */}
            {/*use the render function so that we can retrieve :groupID from inside the component*/}
            <Route exact path="/polls/:pollID/results"
              render={ (props) => (<PollResults {...props} updateTitle={this.updateTitle} />) }
            />

            {/* My Poll Histories Page */}
            <Route exact path="/polls/history">
              <PollHistory updateTitle={this.updateTitle} />
            </Route>

            {/* Question Ended Page */}
            {/* A page that shows when a question is closed by an instructor
                Note: this will be removed soon I believe. */}
            <Route exact path="/questionEnded">
              <QuestionEnded updateTitle={this.updateTitle} />
            </Route>

            {/* Answer Recorded Page */}
            {/* A page that shows after you answered the question, or after time runs out.
             Note: this will be removed soon I believe. */}
            <Route exact path="/answerRecorded">
              <AnswerRecorded updateTitle={this.updateTitle} />
            </Route>


            {/* --- Login Pages --- */}

            {/* Login Main Page */}
            <Route exact path="/login">
              <LoginDefault updateTitle={this.updateTitle} />
            </Route>

            {/* Login with Poll Buddy Account Page */}
            <Route exact path="/login/pollbuddy">
              <LoginWithPollBuddy updateTitle={this.updateTitle} />
            </Route>

            {/* Login with School Account Page */}
            <Route exact path="/login/school">
              <LoginWithSchool updateTitle={this.updateTitle} />
            </Route>

            {/* Forgot Password Page */}
            <Route exact path="/login/forgot">
              <ForgotPassword updateTitle={this.updateTitle} />
            </Route>

            {/* Reset Password Page */}
            <Route exact path="/login/reset">
              <ResetPassword updateTitle={this.updateTitle} />
            </Route>


            {/* --- Registration Pages --- */}

            {/* Register Main Page */}
            <Route exact path="/register">
              <RegisterDefault updateTitle={this.updateTitle} />
            </Route>

            {/* Register with Poll Buddy Account Page */}
            <Route exact path="/register/pollbuddy">
              <RegisterWithPollBuddy updateTitle={this.updateTitle} />
            </Route>

            {/* Register with School Account Page */}
            <Route exact path="/register/school">
              <RegisterWithSchool updateTitle={this.updateTitle} />
            </Route>

            {/* Register with School Account Step 2 Page */}
            {/*use the render function so that we can retrieve :groupID from inside the component*/}
            <Route exact path="/register/school/step2"
              render={ (props) => (<RegisterWithSchoolStep2 {...props} updateTitle={this.updateTitle}
                userInfo={this.state.userInfo} />) }
            />


            {/* --- Account and User Settings Pages --- */}

            {/* Account Info Page */}
            <Route exact path="/account">
              <AccountInfo updateTitle={this.updateTitle} />
            </Route>


            {/* --- Other Pages --- */}

            {/* Template Page */}
            <Route exact path="/template">
              <Template updateTitle={this.updateTitle} />
            </Route>

            {/* Default Route/Error 404 Page */}
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
