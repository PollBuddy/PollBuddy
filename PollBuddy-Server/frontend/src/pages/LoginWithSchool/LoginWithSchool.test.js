import React from "react";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import LoginWithSchool from "./LoginWithSchool";

function updateTitle() {
  return false;
}

describe("The LoginWithSchool page:", () => {
  it("Loads correctly.", async () => {
    // Just make sure it can load.
    fetch.mockResponseOnce(JSON.stringify({ data: [ [ "rpi", "RPI" ] ] }));
    fetch.mockResponseOnce(JSON.stringify({ data: [ [ "rpi", "RPI" ] ] }));
    render(<BrowserRouter><LoginWithSchool updateTitle={updateTitle}/></BrowserRouter>);
    // TODO: This is BAD practice, waiting for it to load.
    let done = false;
    setTimeout(() => done = true, 500);
    await waitFor(() => expect(done).toBe(true));
  });
});
