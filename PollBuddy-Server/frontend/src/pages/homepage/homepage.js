import React, {Component} from 'react';
import { Link } from '@reach/router';

import logo from '../../logo.svg';

import './homepage.scss'
export default class homepage extends Component {

  
  render() { 
    
    function toBlue() {
      document.body.style = 'background: blue;';
    }
    function toRed() {
      document.body.style = 'background: red;';
    }   
    return (
        <div className="page-homepage">
          <div className="App">
            <header className="App-header">
              <h1>
                Welcome to PollBuddy!!!!
              </h1>
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <Link to="myclasses">Go to my MyClasses</Link>
              <Link to="/">Go to my home</Link>

            </header>

        
          <body>
          </body>
      </div>
      </div>
    )
  }
}