import React, {Component} from 'react';
import './question.scss'
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import * as questionActions from "../../store/question/actions";
export default class question extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {};
    // }
    render() {
      return <div className="component-question">Hello! component question</div>;
    }
  }
// export default connect(
//     ({ question }) => ({ ...question }),
//     dispatch => bindActionCreators({ ...questionActions }, dispatch)
//   )( question );