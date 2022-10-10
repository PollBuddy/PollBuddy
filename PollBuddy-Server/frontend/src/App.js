import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { MDBContainer } from "mdbreact";

import Groups from "./pages/Groups/Groups";
import Homepage from "./pages/Homepage/Homepage";
import LoginWithPollBuddy from "./pages/LoginWithPollBuddy/LoginWithPollBuddy";
import GroupCreation from "./pages/GroupCreation/GroupCreation";
import GroupJoin from "./pages/GroupJoin/GroupJoin";
import GroupEdit from "./pages/GroupEdit/GroupEdit";
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
import { PrivateComponent, Header, Footer } from "./components";
// import Popup2 from "./components/Popup2/Popup2";
import "./styles/main.scss";

import { TitleProvider } from "./hooks";

function App() {
  const [ userInfo, ] = React.useState({ sessionIdentifier: "" });

  const updateTitle = React.useCallback(newTitle => {
    document.title = newTitle + " - Pollbuddy";
  }, [ ]);

  return (
    <BrowserRouter>
      <TitleProvider>
        <MDBContainer id="wrapper">
          {/* Popup2 test: Popup2 still needs a handleClose function that will activate onClick of the button, this handle func should probably be a prop passed from parent component*/}
          {/*<Popup2 dim={true} text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."/>*/}

          <Header userInfo={userInfo} />

          {/*
            Using React BrowserRouter now

            See https://codeburst.io/getting-started-with-react-router-5c978f70df91
            We will likely want to nest a lot of these later, this link has some details how
          */}

          <Routes>
            {/* --- Main Site Pages --- */}
            {/* Home Page */}
            <Route exact path="/" element={<Homepage />}/>
            {/* About Poll Buddy Page */}
            <Route exact path="/about" element={<About />}/>
            {/* Contact Us Page */}
            <Route exact path="/contact" element={<Contact />} />
            {/* Frequently Asked Questions (FAQ) Page */}
            <Route exact path="/faq" element={<FAQ />} />
            {/* Data Privacy Page */}
            <Route exact path="/privacy" element={<Privacy />} />
            {/* Quick Start Guide */}
            <Route exact path="/guide" element={<QuickStartGuide />}/>
            {/* Enter Poll Code Page */}
            <Route exact path="/code" element={<Code />} />
            
            {/* --- Group Pages --- */}
            {/* My Groups Page */}
            <Route exact path="/groups" element={<PrivateComponent state element={<Groups />}/>}/>
            {/* Group Creation Page */}
            <Route exact path="/groups/new" element={<PrivateComponent state element={<GroupCreation />}/>}/>
            {/* Group's Page */}
            <Route exact path="/groups/:groupID" element={<PrivateComponent state element={<Group />}/>}/>
            {/* Group Edit Page */}
            <Route exact path="/groups/:groupID/edit" element={<PrivateComponent state element={<GroupEdit />}/>} />
            {/* Group Join Page */}
            <Route exact path="/groups/join" element={<PrivateComponent state element={<GroupJoin />}/>}/>
            
            {/* --- Poll Pages --- */}
            {/* My Poll Histories Page */}
            {/* This route (and any others that route through /polls/that are not polls)
                need to be listed BEFORE the Poll ID Redirect to ensure they are not
                treated like a :pollID */}
            <Route exact path="/polls/history" element={<PrivateComponent state element={<PollHistory updateTitle={updateTitle} />}/>}/>
            {/* Poll Creation */}
            <Route exact path="/polls/new" element={<PollCreation updateTitle={updateTitle} />}/>
            {/* Poll ID Redirect */}
            {/* Redirects from poll ID page (404) to view page */}
            <Route exact path="/polls/:pollID" element={<PrivateComponent state element={<Navigate to={"view"} push={true}/>}/>}/>
            {/* Poll Viewer Page */}
            <Route exact path="/polls/:pollID/view" element={<PollViewer updateTitle={updateTitle} />}/>
            {/* Poll Editor Page */}
            <Route exact path="/polls/:pollID/edit" element={<PrivateComponent state element={<PollEditor updateTitle={updateTitle} />}/>}/>
            {/* Poll Manager Page */}
            <Route exact path="/polls/:pollID/manage" element={<PrivateComponent state element={<PollManager updateTitle={updateTitle} />}/>}/>
            {/* Poll Results Page */}
            {/*use the render function so that we can retrieve :groupID from inside the component*/}
            <Route exact path="/polls/:pollID/results" element={<PollResults updateTitle={updateTitle} />}/>
            {/* QuestionResults Ended Page */}
            {/* A page that shows when a question is closed by an instructor
                Note: this will be removed soon I believe. */}
            <Route exact path="/questionEnded" element={<PrivateComponent state element={<QuestionEnded updateTitle={updateTitle} />}/>}/>
            {/* Answer Recorded Page */}
            {/* A page that shows after you answered the question, or after time runs out.
              Note: this will be removed soon I believe. */}
            <Route exact path="/answerRecorded" element={<PrivateComponent state element={<AnswerRecorded updateTitle={updateTitle} />}/>}/>
            
            {/* --- Login Pages --- */}
            {/* Login Main Page */}
            <Route exact path="/login" element={<PrivateComponent element={<LoginDefault />}/>}/>
            {/* Login with Poll Buddy Account Page */}
            <Route exact path="/login/pollbuddy" element={<PrivateComponent element={<LoginWithPollBuddy />}/>}/>
            {/* Login with School Account Page */}
            <Route exact path="/login/school" element={<PrivateComponent element={<LoginWithSchool />}/>}/>
            {/* Login with School Account Step 2 Page */}
            <Route exact path="/login/school/step2" element={<PrivateComponent element={<LoginWithSchoolStep2 />}/>}/>
            {/* Forgot Password Page */}
            <Route exact path="/login/forgot" element={<PrivateComponent element={<ForgotPassword />}/>}/>
            {/* Reset Password Page */}
            <Route exact path="/login/reset" element={<PrivateComponent element={<ResetPassword />}/>}/>

            {/* --- Registration Pages --- */}
            {/* Register Main Page */}
            <Route exact path="/register" element={<PrivateComponent element={<RegisterDefault />}/>}/>
            {/* Register with Poll Buddy Account Page */}
            <Route exact path="/register/pollbuddy" element={<PrivateComponent element={<RegisterWithPollBuddy />}/>}/>
            {/* Register with School Account Page */}
            <Route exact path="/register/school" element={<PrivateComponent element={<RegisterWithSchool />}/>}/>
            {/* Register with School Account Step 2 Page */}
            <Route exact path="/register/school/step2" element={<PrivateComponent element={<RegisterWithSchoolStep2 />}/>}/>

            {/* --- Account and User Settings Pages --- */}
            {/* Account Info Page */}
            <Route exact path="/account" element={<PrivateComponent state element={<AccountInfo updateTitle={updateTitle} />}/>}/>

            {/* --- Other Pages --- */}
            {/* Default Route/Error 404 Page */}
            <Route path="*" element={<Notfound />}/>
          </Routes>

          <Footer/>

        </MDBContainer>
      </TitleProvider>
    </BrowserRouter>

  );
}

export default React.memo(App);