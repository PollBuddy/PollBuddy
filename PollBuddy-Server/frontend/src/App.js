import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  function toBlue() {
    document.body.style = 'background: blue;';
  }
  function toRed() {
    document.body.style = 'background: red;';
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Welcome to PollBuddy!!!!
        </h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        </header>

      <body>
      <p>
        hey yall.
      </p>

      <button onClick={toBlue}>
        Click me!
      </button>

      <button onClick={toRed}>
        No, click me!
      </button>

      </body>
    </div>
  );
}

export default App;
