import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import GroupSettings from "./GroupSettings";

function updateTitle() {
  return false;
}

describe("The Group page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(
      <BrowserRouter>
        <GroupSettings
          updateTitle={updateTitle}
          state={{
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
            total_questions: 24,
            avg_correct: 20,
            member_correct: 22,
            groupData: null,
            doneLoading: true,
            id: null,
            error: null
            //need to put in groupID from backend
            //need to get other shit like pollIDs and their respective information...
          }}/>
      </BrowserRouter>
    );
  });
});