import React, {Component} from 'react';
import {Link} from "react-router-dom";

import './lessons.scss'
export default class lessons extends Component {
constructor(props){//shouldn't this be dependent on the class???? thats why i included a constructor.
    super(props);
    //need to connect to backend probably here and then store data until it can be stored in state.
    //problem is there is no find in backend rn... frontend could do find but probably more resource intensive?
    this.state = {
      //need to put in groupID from backend
      //need to get other shit like pollIDs and their respective information...
    }
  }
  componentDidMount(){
     this.props.updateTitle("Lessons");
  }
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