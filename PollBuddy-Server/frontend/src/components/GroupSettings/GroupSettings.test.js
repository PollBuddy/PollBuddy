import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import GroupSettings from './GroupSettings';

const MEM_DATA = {
  isMember: true,
  isAdmin: false,
  id: "TEST",
}

const ADM_DATA = {
  isMember: false,
  isAdmin: true,
  id: "TEST",
}

describe("The GroupSettings component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><GroupSettings state={MEM_DATA}/></BrowserRouter>);
  });

  it("Leaving group works correctly when Member.", async () => {
    render(<BrowserRouter><GroupSettings state={MEM_DATA}/></BrowserRouter>);
    // Can see 'Member Settings'.
    expect(screen.findByText.bind(this, "Member Settings")).not.toThrow();
    
    // Leave work correctly.
    fetchMock.mockResponseOnce({ status: 200 });

    await act(async () => {
      await userEvent.click(screen.getByText("Leave Group"))
    });

    expect(window.location.pathname).toBe("/groups");
  });

  it("Creating poll works correctly when Admin.", async () => {
    render(<BrowserRouter><GroupSettings state={ADM_DATA}/></BrowserRouter>);
    
    await act(async () => {
      await userEvent.click(screen.getByText("Create New Poll"));
    });

    expect(window.location.pathname).toBe("/polls/new");
  });

  it("Editing poll works correctly when Admin.", async () => {
    render(<BrowserRouter><GroupSettings state={ADM_DATA}/></BrowserRouter>);
    
    await act(async () => {
      await userEvent.click(screen.getByText("Edit Group"));
    });

    expect(window.location.pathname).toBe("/groups/TEST/edit");
  });

  it("Deleting group works correctly when Admin.", async () => {
    render(<BrowserRouter><GroupSettings state={ADM_DATA}/></BrowserRouter>);
    fetchMock.mockResponseOnce({ status: 200 });

    await act(async () => {
      await userEvent.click(screen.getByText("Delete this Group"));
    });

    expect(window.location.pathname).toBe("/groups");
  });
});