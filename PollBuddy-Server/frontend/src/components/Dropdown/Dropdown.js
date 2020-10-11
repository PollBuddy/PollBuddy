import React, { Component, useState } from "react";
import "mdbreact/dist/css/mdb.css";
import "./Dropdown.scss";

export default class Dropdown extends Component {
    render() {
        return (
            <DropdownButton>
                <DropdownMenu></DropdownMenu>
            </DropdownButton>
        );
    }
}

function DropdownButton(props) {
    const [open, setOpen] = useState(false);
    return (
        <span onClick={() => setOpen(!open)}>
            <span className="header_bar_btn">Menu</span>

            {open && props.children}
        </span>
    );
}

function DropdownMenu() {

    function DropdownItem(props) {
        return (
            <a href="#" className="menu-item">
                {props.children}
            </a>
        );
    }

    return (
        <div className="dropdown">
            <DropdownItem>Login</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
            <DropdownItem>Register</DropdownItem>
            <DropdownItem>Account</DropdownItem>
            <DropdownItem>Enter Poll Code</DropdownItem>
            <DropdownItem>Groups</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
        </div>
    );
}