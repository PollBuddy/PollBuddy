import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PollEditor from "./PollEditor";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ data: {
    questions: []
  } })
}));

describe("The PollEditor page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><PollEditor updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("Poll Details")));
  });
});