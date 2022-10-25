import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import PrivateComponent from './PrivateComponent';

describe("The PrivateComponent component:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(
      <BrowserRouter>
        <Link to="/TEST">GO TO</Link>
        <Routes>
          <Route exact path="/TEST" element={<PrivateComponent state element="TEST"/>}/>
        </Routes>
      </BrowserRouter>
    );
      
    // Doesn't kill itself when you go to it.
    await userEvent.click(screen.getByText("GO TO"));
  });

  it("Shows private item if logged in.", async () => {
    localStorage.setItem("loggedIn", "true");

    render(
      <BrowserRouter>
        <Link to="/TEST">GO TO</Link>
        <Routes>
          <Route exact path="/TEST" element={<PrivateComponent state element="TEST"/>}/>
        </Routes>
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText("GO TO"));

    expect(screen.getByText.bind(null, "TEST")).not.toThrow();
  });

  it("Hides private item if not logged in.", async () => {
    localStorage.setItem("loggedIn", "false");

    render(
      <BrowserRouter>
        <Link to="/TEST">GO TO</Link>
        <Routes>
          <Route exact path="/TEST" element={<PrivateComponent state element="TEST"/>}/>
        </Routes>
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText("GO TO"));

    expect(screen.getByText.bind(null, "TEST")).toThrow();
    expect(window.location.pathname).toBe("/login");
  });

  it("Shows public item if not logged in.", async () => {
    localStorage.setItem("loggedIn", "false");

    render(
      <BrowserRouter>
        <Link to="/TEST">GO TO</Link>
        <Routes>
          <Route exact path="/TEST" element={<PrivateComponent state={false} element="TEST"/>}/>
        </Routes>
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText("GO TO"));

    expect(screen.getByText.bind(null, "TEST")).not.toThrow();
  });

  it("Hides public item if logged in.", async () => {
    localStorage.setItem("loggedIn", "true");

    render(
      <BrowserRouter>
        <Link to="/TEST">GO TO</Link>
        <Routes>
          <Route exact path="/TEST" element={<PrivateComponent state={false} element="TEST"/>}/>
        </Routes>
      </BrowserRouter>
    );

    await userEvent.click(screen.getByText("GO TO"));

    expect(screen.getByText.bind(null, "TEST")).toThrow();
    expect(window.location.pathname).toBe("/");
  });
});