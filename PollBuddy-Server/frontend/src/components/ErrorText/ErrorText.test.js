import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import ErrorText from './ErrorText';

describe("The ErrorText component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><ErrorText show/></BrowserRouter>);
  });

  it("Doesn't load if not show=false.", () => {
    render(<BrowserRouter><ErrorText /></BrowserRouter>);
    expect(screen.getByText.bind(this, /An error has occurred./)).toThrow();
  });

  it("Shows ambiguous text when not given specific error.", () => {
    // Give no error and see it show ambiguous warning.
    render(<BrowserRouter><ErrorText show/></BrowserRouter>);
    expect(screen.getByText.bind(this, /An error has occurred./)).not.toThrow();
  });

  it("Shows error when given it.", () => {
    // Give error and see if it displays it.
    render(<BrowserRouter><ErrorText show text="YOUR MOM."/></BrowserRouter>);
    expect(screen.getByText.bind(this, /ERROR: YOUR MOM./)).not.toThrow();
  });
});