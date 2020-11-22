import React, { Component } from "react";

export default class Popup extends Component {
    render() {
        let popup = (
            <div>
                <button onClick={this.props.onClose}>X</button>
                <div>{this.props.children}</div>
            </div>
        );

        if (!this.props.isOpen) {
            popup = null;
        }

        return (
            <div>
                {popup}
            </div>
        );
    }
}