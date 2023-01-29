import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import GroupEdit from "./GroupEdit";
import { act } from 'react-dom/test-utils';

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({text: ""})
}));

function updateTitle() {
  return false;
}

describe("The GroupEdit page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    await act(async () => {
      render(<BrowserRouter><GroupEdit updateTitle={updateTitle}/></BrowserRouter>);
    });
  });
});