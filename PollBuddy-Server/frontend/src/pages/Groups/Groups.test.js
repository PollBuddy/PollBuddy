import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Groups from "./Groups";

function updateTitle() {
  return false;
}

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    ok: true,
    result: "success",
    data: {
      admin: [],
      member: [],
    },
  }),
}));

describe("The Groups page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><Groups updateTitle={updateTitle}/></BrowserRouter>);
    await waitFor(() => expect(screen.getByText("Groups")));
  });
});