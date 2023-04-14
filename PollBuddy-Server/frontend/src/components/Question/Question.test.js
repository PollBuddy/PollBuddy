import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Question from "./Question";

const DATA = {
  pollID: "TEST",
  questionNumber: 123,
  pollCloseTime: Date.now(),
  question: {
    currentAnswers: [ 0, 1 ],
    maxAllowedChoices: 2,
    id: 999,
    text: "What is up Gamers?!",
    answers: [
      { id: 0, text: "Ok." },
      { id: 1, text: "And?" },
      { id: 2, text: "GG!" },
    ]
  },
};

describe("The Question component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Question data={DATA}/></BrowserRouter>);
  });

  it("Shows correct text.", () => {
    render(<BrowserRouter><Question data={DATA}/></BrowserRouter>);

    // The title exists.
    expect(screen.getByText.bind(null, "Question 123: What is up Gamers?!")).not.toThrow();
    // The correct answers are shown.
    expect(screen.getByText.bind(null, "Ok.")).not.toThrow();
    expect(screen.getByText.bind(null, "And?")).not.toThrow();
    expect(screen.getByText.bind(null, "GG!")).not.toThrow();
  });

  it("Has correct indices for options.", () => {
    render(<BrowserRouter><Question data={DATA}/></BrowserRouter>);
    // eslint-disable-next-line jest/valid-expect
    expect(screen.get);
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText("A").classList.contains("question-btn-and-text"));
  });

  it("Has correct selections.", () => {
    const { baseElement } = render(<BrowserRouter><Question data={DATA}/></BrowserRouter>);

    /** @type {HTMLCollectionOf<HTMLElement>} */
    // eslint-disable-next-line testing-library/no-node-access
    const questions = baseElement.getElementsByClassName("question-btn-and-text");

    // Correct amount of options.
    expect(questions.length).toBe(3);

    // Indices match text.
    expect(questions[0].textContent).toBe("AOk.");
    expect(questions[1].textContent).toBe("BAnd?");
    expect(questions[2].textContent).toBe("CGG!");

    // Only A & B are selected.
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText("A").classList.contains("question-label-bubble-active"));
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText("B").classList.contains("question-label-bubble-active"));
    // eslint-disable-next-line jest/valid-expect
    expect(!screen.getByText("C").classList.contains("question-label-bubble-active"));
  });

  it("Changes selection on click.", async () => {
    let ANS = "", onQ = out => ANS = out.join();
    render(<BrowserRouter><Question data={DATA} updateQuestion={onQ}/></BrowserRouter>);

    // An option is removed if clicked.
    await userEvent.click(screen.getByText("Ok."));
    // eslint-disable-next-line jest/valid-expect
    expect(!screen.getByText("A").classList.contains("question-label-bubble-active"));
    expect(ANS).toBe("1");

    // An option is added if clicked.
    await userEvent.click(screen.getByText("Ok."));
    // eslint-disable-next-line jest/valid-expect
    expect(screen.getByText("A").classList.contains("question-label-bubble-active"));
    expect(ANS).toBe("1,0");

    // Max allowed choice prevents a third choice.
    await userEvent.click(screen.getByText("GG!"));
    // eslint-disable-next-line jest/valid-expect
    expect(!screen.getByText("C").classList.contains("question-label-bubble-active"));
    expect(ANS).toBe("0,2");
  });
});
