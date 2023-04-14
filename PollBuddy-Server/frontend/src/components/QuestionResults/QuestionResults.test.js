import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

import QuestionResults from "./QuestionResults";

const DATA = {
  questionNumber: 123,
  question: {
    responses: 10000,
    answers: [{ text: "ASDFG", count: 1 }],
    text: "QUESTION 1",
  },
};

jest.mock("react-chartjs-2", () => ({
  Bar: () => <canvas/>,
}));

describe("The QuestionResults component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><QuestionResults data={DATA}/></BrowserRouter>);
  });

  it("Shows question.", () => {
    render(<BrowserRouter><QuestionResults data={DATA}/></BrowserRouter>);
    expect(screen.getByText.bind(null, "Question 123: QUESTION 1")).not.toThrow();
  });

  it("Shows total responses.", () => {
    render(<BrowserRouter><QuestionResults data={DATA}/></BrowserRouter>);
    expect(screen.getByText.bind(null, "10000 Total Responses")).not.toThrow();
  });

  it("Shows bar canvas.", () => {
    const { baseElement } = render(<BrowserRouter><QuestionResults data={DATA}/></BrowserRouter>);
    // TODO: Fix this code so it no longer throws a linting error.
    // eslint-disable-next-line testing-library/no-node-access
    expect(baseElement.getElementsByTagName("canvas")).toHaveLength(1);
  });
});
