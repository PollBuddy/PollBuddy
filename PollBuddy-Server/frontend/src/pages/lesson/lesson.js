import React, {Component} from 'react';
import './lesson.scss'
export default class lesson extends Component {

  render() {    
    return (
      <div className="page-lesson">
        Hello lesson {this.props.lessonId}
      </div>
    )
  }
}