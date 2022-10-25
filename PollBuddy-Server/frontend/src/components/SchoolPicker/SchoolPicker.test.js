import React from 'react';
import { render, /*screen, act*/ } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SchoolPicker from './SchoolPicker';

describe("The SchoolPicker component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><SchoolPicker/></BrowserRouter>);
  });
});