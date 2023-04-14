import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter, Link, Route, Routes, Outlet } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import RegisterWithSchoolStep2 from "./RegisterWithSchoolStep2";

function updateTitle() {
  return false;
}

let assignMock = jest.fn();

delete window.location;
window.location = { assign: assignMock };

describe("The RegisterWithSchoolStep2 page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    render(<BrowserRouter>
      <Link to="/TEST">GOTO TEST</Link>
      <Routes>
        <Route exact path="/" element={<Outlet />}/>
        <Route exact path="/TEST" element={<RegisterWithSchoolStep2 updateTitle={updateTitle}/>}/>
      </Routes>
    </BrowserRouter>);
    
    await userEvent.click(screen.getByText("GOTO TEST"));
  });
});