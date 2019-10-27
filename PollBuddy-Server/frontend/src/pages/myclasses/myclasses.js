import React, {Component} from 'react';
import { Link } from '@reach/router';

import './myclasses.scss'
export default class myclasses extends Component {
  render() {    
    return (
      <div className="page-my-classes">
        Hello myClasses 
        <br/>
        <Link to="/lessons">Lessons</Link>
      </div>
    )
  }
}