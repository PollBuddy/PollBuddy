import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PollResults from "./PollResults";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ result: "success", data: { questions: [ ] } })
}));

describe("The PollResults page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><PollResults updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("Download full results CSV")));
  });
});