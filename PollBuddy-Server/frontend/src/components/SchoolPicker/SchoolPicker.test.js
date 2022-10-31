import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import SchoolPicker from "./SchoolPicker";

// TODO: The warnings for this test need to be fixed with react-autocomplete,
// but the module is no longer maintained. Create a fork of it and change:
// (Line 55) componentWillMount --> UNSAFE_componentWillMount
// (Line 55) componentWillReceiveProps --> UNSAFE_componentWillReceiveProps

describe("The SchoolPicker component:", () => {
  it("Loads correctly.", async () => {
    let loaded = false;
    // Just make sure it can load.
    fetch.mockResponseOnce(JSON.stringify({ data: { schools: [ ], schoolLinkDict: { } } }));
    render(<BrowserRouter><SchoolPicker onDoneLoading={() => loaded = true}/></BrowserRouter>);
    await waitFor(() => expect(loaded).toBe(true));
  });
});