import React from 'react';

import './Popup2.scss'

export default class Popup2 extends React.Component {
    constructor(props) {
        super(props);
    }
   
    render() {
        return (
            <div class="shell">
                <div class="modal-overlay"/>
                <div class="modal">
                    <div class="modal-topbar">
                    </div>
                    <div class="modal-container">
                        <div class="modal-guts">
                            <label for="text" class="text-label">{this.props.text}</label>
                            <div class="button-container">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}