import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PollViewer from "./PollViewer";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ result: "success", data: { questions: [ ] } })
}));

describe("The PollViewer page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><PollViewer updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("This poll has no questions for you to answer at this time.")))
  });
});