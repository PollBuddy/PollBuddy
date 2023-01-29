import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import RegisterWithSchool from "./RegisterWithSchool";

function updateTitle() {
  return false;
}

describe("The RegisterWithSchool page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load. 
    fetch.mockResponseOnce(JSON.stringify({ data: [ [ "rpi", "RPI" ] ] }));
    fetch.mockResponseOnce(JSON.stringify({ data: [ [ "rpi", "RPI" ] ] }));
    render(<BrowserRouter><RegisterWithSchool updateTitle={updateTitle}/></BrowserRouter>);
    // TODO: This is BAD practice, waiting for it to load.
    let done = false;
    setTimeout(() => done = true, 500);
    await waitFor(() => expect(done).toBe(true));
  });
});