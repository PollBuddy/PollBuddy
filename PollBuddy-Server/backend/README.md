## Overview

The backend serves API requests that are made by the frontend. All responses use JSON to return data. The backend relies
on MongoDB, and as such, testing out the back end requires running the project locally through the provided Docker
Compose configuration. Please refer to
the [Wiki](https://github.com/PollBuddy/PollBuddy/wiki/Installation-(For-Production)-Instructions) for guidelines.

## Scripts

The backend of this project is composed of JavaScript files that run in [NodeJS](https://nodejs.org/en/), along with
other files involved with the functionality of running the project
in [Docker](https://www.docker.com/products/docker-desktop). The most frequently modified JavaScript files can be found
in the `routes` folder, with occasional uses of the `modules` folder and `app.js` file.

## Documentation

All methods require [JSDoc](https://devhints.io/jsdoc) comments in order to fully describe what they do. Refer to
the [wiki](https://github.com/PollBuddy/PollBuddy/wiki/Style-Guide#code-and-wiki-documentation) for details on how to
write good documentation.

## Getting Started

You'll want to be familiar with JavaScript and MongoDB. You can find tutorials below. Then, you can pick an issue from
the [issue tracker](https://github.com/PollBuddy/PollBuddy/issues) to work on.

JavaScript Tutorial: <https://www.w3schools.com/js/>

MongoDB Tutorial: <https://www.guru99.com/node-js-mongodb.html>
