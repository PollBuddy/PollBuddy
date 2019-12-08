import React, {Component} from 'react';
import { MDBBtn, MDBIcon, MDBContainer,MDBSwitch } from "mdbreact";
import 'mdbreact/dist/css/mdb.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import new_logo from '../../Poll_Buddy_Logo_v4.png';
import './settings_page.scss'

export default class settings_page extends Component {
    state = {
        dark_mode_switch: true,
    }
    handleSwitchChange = nr => () => {
        let switchNumber = `switch${nr}`;
        this.setState({
            [switchNumber]: !this.state[switchNumber]
        });
    }
    render() {

        return (
            <MDBContainer className="page-settings-page">
                <img src={new_logo} className="top_left_logo" alt="logo"/>

                <MDBBtn
                    size="lg"
                    className="home_button"
                    href="/"
                    color="secondary"
                >
                    <MDBIcon icon="home" />
                </MDBBtn>

                <MDBBtn
                    size="lg"
                    className="about_button"
                    href="/about"
                    color="secondary"
                >
                    <MDBIcon icon="question" />
                </MDBBtn>

                <MDBBtn
                    size="lg"
                    className="settings_button"
                    href="/settings_page"
                    color="secondary"
                >
                    <MDBIcon icon="tools" />
                </MDBBtn>

                <hr class="line_style"></hr>
                <header className="header">
                    <br></br> SETTINGS
                </header>

                <MDBContainer className='custom-control custom-switch'>
                    <input
                        type='checkbox'
                        className='custom-control-input'
                        id='customSwitches'
                        checked={this.state.switch1}
                        onChange={this.handleSwitchChange(1)}
                        readOnly
                    />
                    <label className='custom-control-label' htmlFor='customSwitches'>
                        Dark Mode
                    </label>
                </MDBContainer>
                <MDBBtn
                    size="lg"
                    className="change_password"
                    href="/"
                    color="secondary"
                >
                    Change your password
                </MDBBtn>
                <MDBBtn
                    size="lg"
                    className="change_username"
                    href="/"
                    color="secondary"
                >
                    Change your username
                </MDBBtn>

                <MDBBtn
                    href="https://rcos.io/"
                    className="rcos_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    An RCOS Project
                </MDBBtn>

                <MDBBtn
                    href="https://info.rpi.edu/statement-of-accessibility"
                    className="accessibility_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    Statement of Accessibility
                </MDBBtn>

                <MDBBtn
                    href="https://github.com/neha-deshpande001/PollBuddy"
                    className="github_button"
                    target="_blank"
                    size="m"
                    color="secondary"
                >
                    Github
                </MDBBtn>

            </MDBContainer>
        )
    }
}