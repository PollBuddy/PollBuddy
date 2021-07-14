## Overview
Below is a brief description of the layout/technologies used in our frontend as well as how to get started in contributing.

## Layout
Poll Buddy's frontend is built with [React](https://reactjs.org/), utilizing various custom components and third-party component libraries and features such as:
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [React MDB (Material Design with Bootstrap)](https://mdbootstrap.com/docs/react/)
- [React Router](https://reactrouter.com/)

Webpages in our app are organized as React class components that can be found individually in the `pages` folder. The webpages themselves are made up of JSX code that consist of custom components that can be located in the `components` folder as well as third-party components from the libraries specified above.

Styling in our frontend is done with SCSS that provides greater code efficiency and flexibility in our codebase. More about SCSS can be found [here](https://sass-lang.com/documentation).

Additionally, routing is handled by [React Router](https://reactrouter.com/) components such as **BrowserRouter, Switch, and Route** which enables clear and concise URLs for every webpage.

## Getting Started
You can learn how to contribute by reading our contribution guide [here](https://github.com/PollBuddy/PollBuddy/wiki/Contribution-(Development)-Guide), or learn how to run the app [here](https://github.com/PollBuddy/PollBuddy/wiki/Installation-(For-Production)-Instructions).