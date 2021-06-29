# [PollBuddy](https://github.com/PollBuddy) - Frontend

A brief description of the layout/technologies used in our frontend as well as how to get started in contributing

## Layout

PollBuddy's frontend is built with [React](https://reactjs.org/), utilizing various custom components/third-party component libraries and features such as:
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [React MDB (Material Design with Bootstrap)](https://mdbootstrap.com/docs/react/)
- [React Router](https://reactrouter.com/)

Webpages in our app are organized as React class components that can be found individually in the **pages** folder. The webpages themselves are made up of JSX code that consists
of custom components that can be located in the **components** folder as well as third-party components from the libraries specified above.

Styling in our frontend is done with SCSS that provides greater code efficiency and flexibility in our codebase. 
- More can be read about SCSS => [here](https://sass-lang.com/documentation)

Additionally, routing is handled by [React Router](https://reactrouter.com/) components such as **BrowserRouter, Switch, and Route** which enables clear and concise URLs for every
webpage

## Getting Started
Clone the PollBuddy repository:
```
git clone https://github.com/PollBuddy/PollBuddy.git
```
More can be read about contributing here:
- [PollBuddy Contribution Guide](https://github.com/PollBuddy/PollBuddy/wiki/Contribution-(Development)-Guide)