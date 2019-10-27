import React from 'react';
import logo from './logo.svg';
import './App.css';
import Question from "./pages/lesson/components/question";

function App() {

  function toBlue() {
    document.body.style = 'background: blue;';
  }
  function toRed() {
    document.body.style = 'background: red;';
  }

  return (
    <div className="App">
      <Question/>
    </div>
  );
}

export default App;
