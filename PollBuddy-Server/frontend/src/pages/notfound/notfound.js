import React, {Component} from 'react';
import './notfound.scss'
export default class notfound extends Component {
  componentDidMount(){
    document.title = "Page Not Found - " + document.title;
  }
  render() {    
    return (
      <div className="page-notfound">
        Route not found
      </div>
    )
  }
}