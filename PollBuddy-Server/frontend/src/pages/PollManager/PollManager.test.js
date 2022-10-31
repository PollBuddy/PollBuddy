import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PollManager from "./PollManager";

function updateTitle() {
  return false;
}

// Because the Bar from ChartJS causes errors.
jest.mock("react-chartjs-2", () => ({
  Bar: () => <canvas/>,
}));

describe("The PollManager page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter><PollManager updateTitle={updateTitle}/></BrowserRouter>);
  });
});