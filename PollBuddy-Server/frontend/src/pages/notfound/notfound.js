import React, { Component } from "react";
import "mdbreact/dist/css/mdb.css";

export default class notfound extends Component {

  componentDidMount(){
    this.props.updateTitle("Page Not Found");
  }
  render() {    
    return (
      <p className="bold fontSizeLarge">
          Error: page not found.
      </p>
    )
  }
}
