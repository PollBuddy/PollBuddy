import React, {Component} from 'react';
import { Link } from '@reach/router';

import './lessons.scss'
export default class lessons extends Component {
  render() {    
    return (
        <div className="page-lessons">
        Hello lessons 
        <br/>
        <Link to="/lesson/123">Lesson 123</Link>
      </div>
    )
  }
}