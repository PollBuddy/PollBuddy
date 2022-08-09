import React from "react";
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import {MDBContainer} from "mdbreact";

import Groups from "./pages/Groups/Groups";
import Homepage from "./pages/Homepage/Homepage";
import LoginWithPollBuddy from "./pages/LoginWithPollBuddy/LoginWithPollBuddy";
import GroupCreation from "./pages/GroupCreation/GroupCreation";
import GroupJoin from "./pages/GroupJoin/GroupJoin";
import GroupEdit from "./pages/GroupEdit/GroupEdit";
import GroupInvite from "./pages/Invite/Invitepage"
import Group from "./pages/Group/Group";
import PollEditor from "./pages/PollEditor/PollEditor";
import Notfound from "./pages/Error404/Error404";
import FAQ from "./pages/FAQ/FAQ";
import QuickStartGuide from "./pages/QuickStartGuide/QuickStartGuide";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import Privacy from "./pages/Privacy/Privacy";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import RegisterDefault from "./pages/RegisterDefault/RegisterDefault";
import RegisterWithSchool from "./pages/RegisterWithSchool/RegisterWithSchool";
import RegisterWithSchoolStep2 from "./pages/RegisterWithSchoolStep2/RegisterWithSchoolStep2";
import RegisterWithPollBuddy from "./pages/RegisterWithPollBuddy/RegisterWithPollBuddy";
import PollCreation from "./pages/PollCreation/PollCreation";
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
import LoginWithSchoolStep2 from "./pages/LoginWithSchoolStep2/LoginWithSchoolStep2";

import Code from "./pages/Code/Code";
import PrivateComponent from "./components/PrivateComponent/PrivateComponent";

import Header from "./components/Header/Header.js";
import Footer from "./components/Footer/Footer.js";

//import Popup2 from "./components/Popup2/Popup2";
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
          {/* Popup2 test: Popup2 still needs a handleClose function that will activate onClick of the button, this handle func should probably be a prop passed from parent component*/}
          {/*<Popup2 dim={true} text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."/>*/}

          <Header userInfo={this.state.userInfo} />

          {/*
            Using React BrowserRouter now

            See https://codeburst.io/getting-started-with-react-router-5c978f70df91
            We will likely want to nest a lot of these later, this link has some details how
          */}

          <Routes>

            {/* --- Main Site Pages --- */}

            {/* Home Page */}
            <Route exact path="/" element={<Homepage updateTitle={this.updateTitle} />} />

            {/* About Poll Buddy Page */}
            <Route exact path="/about" element={<About updateTitle={this.updateTitle} />} />

            {/* Contact Us Page */}
            <Route exact path="/contact" element={<Contact updateTitle={this.updateTitle} />} />

            {/* Frequently Asked Questions (FAQ) Page */}
            <Route exact path="/faq" element={<FAQ updateTitle={this.updateTitle} />}/>

            {/* Data Privacy Page */}
            <Route exact path="/privacy" element={<Privacy updateTitle={this.updateTitle} />} />

            {/* Quick Start Guide */}
            <Route exact path="/quickstartguide" element={<QuickStartGuide updateTitle={this.updateTitle} />}/>


            {/* Enter Poll Code Page */}
            <Route exact path="/code" element={<Code updateTitle={this.updateTitle} />} />


            {/* --- Group Pages --- */}

            {/* My Groups Page */}
            <Route exact path="/groups" element={<PrivateComponent state = {true} element={<Groups updateTitle={this.updateTitle} />}/>}/>

            {/* Group Creation Page */}
            <Route exact path="/groups/new" element={<PrivateComponent state = {true} element={<GroupCreation updateTitle={this.updateTitle} />}/>}/>

            {/* Group's Page */}
            <Route exact path="/groups/:groupID" element={<PrivateComponent state = {true} element={<Group updateTitle={this.updateTitle} />}/>}/>

            {/* Group Edit Page */}
            <Route exact path="/groups/:groupID/edit" element={<PrivateComponent state = {true} element={<GroupEdit updateTitle={this.updateTitle} />}/>} />

            {/* Group Invite Page */}
            <Route exact path="/groups/:groupID/Invite" element={<PrivateComponent state = {true} element={<GroupInvite updateTitle={this.updateTitle} />}/>} />

            {/* Group Join Page */}
            <Route exact path="/groups/join" element={<PrivateComponent state = {true} element={<GroupJoin updateTitle={this.updateTitle} />}/>}/>

            {/* --- Poll Pages --- */}

            {/* My Poll Histories Page */}
            {/* This route (and any others that route through /polls/that are not polls)
                need to be listed BEFORE the Poll ID Redirect to ensure they are not
                treated like a :pollID */}
            <Route exact path="/polls/history" element={<PrivateComponent state = {true} element={<PollHistory updateTitle={this.updateTitle} />}/>}/>

            {/* Poll Creation */}
            <Route exact path="/polls/new" element={<PollCreation updateTitle={this.updateTitle} />}/>

            {/* Poll ID Redirect */}
            {/* Redirects from poll ID page (404) to view page */}
            <Route exact path="/polls/:pollID" element={<PrivateComponent state = {true} element={<Navigate to={"view"} push={true}/>}/>}/>


            {/* Poll Viewer Page */}
            <Route exact path="/polls/:pollID/view" element={<PollViewer updateTitle={this.updateTitle} />}/>

            {/* Poll Editor Page */}
            <Route exact path="/polls/:pollID/edit" element={<PrivateComponent state = {true} element={<PollEditor updateTitle={this.updateTitle} />}/>}/>

            {/* Poll Manager Page */}
            <Route exact path="/polls/:pollID/manage" element={<PrivateComponent state = {true} element={<PollManager updateTitle={this.updateTitle} />}/>}/>

            {/* Poll Results Page */}
            {/*use the render function so that we can retrieve :groupID from inside the component*/}
            <Route exact path="/polls/:pollID/results" element={<PollResults updateTitle={this.updateTitle} />}/>

            {/* QuestionResults Ended Page */}
            {/* A page that shows when a question is closed by an instructor
                Note: this will be removed soon I believe. */}
            <Route exact path="/questionEnded" element={<PrivateComponent state = {true} element={<QuestionEnded updateTitle={this.updateTitle} />}/>}/>

            {/* Answer Recorded Page */}
            {/* A page that shows after you answered the question, or after time runs out.
             Note: this will be removed soon I believe. */}
            <Route exact path="/answerRecorded" element={<PrivateComponent state = {true} element={<AnswerRecorded updateTitle={this.updateTitle} />}/>}/>


            {/* --- Login Pages --- */}

            {/* Login Main Page */}
            <Route exact path="/login" element={<PrivateComponent state = {false} element={<LoginDefault updateTitle={this.updateTitle} />}/>}/>

            {/* Login with Poll Buddy Account Page */}
            <Route exact path="/login/pollbuddy" element={<PrivateComponent state = {false} element={<LoginWithPollBuddy updateTitle={this.updateTitle} />}/>}/>

            {/* Login with School Account Page */}
            <Route exact path="/login/school" element={<PrivateComponent state = {false} element={<LoginWithSchool updateTitle={this.updateTitle} />}/>}/>

            {/* Login with School Account Step 2 Page */}
            <Route exact path="/login/school/step2" element={<PrivateComponent state = {false} element={<LoginWithSchoolStep2 updateTitle={this.updateTitle} />}/>}/>

            {/* Forgot Password Page */}
            <Route exact path="/login/forgot" element={<PrivateComponent state = {false} element={<ForgotPassword updateTitle={this.updateTitle} />}/>}/>

            {/* Reset Password Page */}
            <Route exact path="/login/reset" element={<PrivateComponent state = {false} element={<ResetPassword updateTitle={this.updateTitle} />}/>}/>


            {/* --- Registration Pages --- */}

            {/* Register Main Page */}
            <Route exact path="/register" element={<PrivateComponent state = {false} element={<RegisterDefault updateTitle={this.updateTitle} />}/>}/>

            {/* Register with Poll Buddy Account Page */}
            <Route exact path="/register/pollbuddy" element={<PrivateComponent state = {false} element={<RegisterWithPollBuddy updateTitle={this.updateTitle} />}/>}/>

            {/* Register with School Account Page */}
            <Route exact path="/register/school" element={<PrivateComponent state = {false} element={<RegisterWithSchool updateTitle={this.updateTitle} />}/>}/>

            {/* Register with School Account Step 2 Page */}
            <Route exact path="/register/school/step2" element={<PrivateComponent state = {false} element={<RegisterWithSchoolStep2 updateTitle={this.updateTitle} />}/>}/>


            {/* --- Account and User Settings Pages --- */}

            {/* Account Info Page */}
            <Route exact path="/account" element={<PrivateComponent state = {true} element={<AccountInfo updateTitle={this.updateTitle} />}/>}/>

            {/* --- Other Pages --- */}

            {/* Default Route/Error 404 Page */}
            <Route path="*" element={<Notfound updateTitle={this.updateTitle} />}/>
          </Routes>

          <Footer/>

        </MDBContainer>

      </BrowserRouter>

    );
  }
}
