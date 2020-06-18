import React, {Component} from "react";
import "./notfound.scss"
export default class notfound extends Component {
  componentDidMount(){
    this.props.updateTitle("Page Not Found");
  }
  render() {    
    return (
      <div className="page-notfound">
        404! Your page is not found! D:
      </div>
    )
  }
}