import React from "react";
import ReactDOM from "react-dom";
import GroupSettings from "./GroupSettings";
import {BrowserRouter} from "react-router-dom";

// Create basic render test
it("renders without crashing", () => {
  // Create div element
  const div = document.createElement("div");
  // Render about on the div
  ReactDOM.render(
    <BrowserRouter>
      <GroupSettings state={{
        isMember: false,
        class: "1200 - Data Structures",
        polls: [
          {pollId: 1, label: "Big O Notation"},
          {pollId: 2, label: "Basic C++ Syntax"},
          {pollId: 3, label: "Pointers"},
          {pollId: 4, label: "Vectors"},
          {pollId: 5, label: "Linked Lists"},
          {pollId: 6, label: "Sets"},
          {pollId: 7, label: "Maps"}
        ],
        totalQuestions: 24,
        avgCorrect: 20,
        memberCorrect: 22,
        groupData: null,
        doneLoading: true,
        id: null,
        error: null
        //need to put in groupID from backend
        //need to get other shit like pollIDs and their respective information...
      }}/>
    </BrowserRouter>, div);
  // Clean unmount
  ReactDOM.unmountComponentAtNode(div);
});
