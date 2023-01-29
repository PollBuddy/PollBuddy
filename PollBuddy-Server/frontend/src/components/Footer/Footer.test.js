import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Footer from './Footer';

describe("The Footer component:", () => {
  it("Loads correctly.", () => {
    // Just make sure it can load.
    render(<BrowserRouter><Footer /></BrowserRouter>);
  });

  it("Shows trademark.", () => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
    // Checks if trademark exists.
    expect(screen.getByText.bind(this, /©.*?Poll Buddy/)).not.toThrow();
  });

  it("Has correct site-map links.", () => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
    // Checks if site-map links are correct.
    expect(screen.getByText("About")).toHaveAttribute("href", "/about");
    expect(screen.getByText("Contact")).toHaveAttribute("href", "/contact");
    expect(screen.getByText("FAQ")).toHaveAttribute("href", "/faq");
    expect(screen.getByText("Privacy")).toHaveAttribute("href", "/privacy");
  
  });

  it("Has correct secondary links.", async () => {
    render(<BrowserRouter><Footer /></BrowserRouter>);
    // Check if secondary links work too.
    const aRCOS = (await screen.findByAltText("RCOS")).parentElement;
    expect(aRCOS).toHaveAttribute("href", "https://rcos.io/");
    const aGITHUB = (await screen.findByAltText("Github")).parentElement;
    expect(aGITHUB).toHaveAttribute("href", "https://github.com/PollBuddy/PollBuddy");
  });
});