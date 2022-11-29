import React, {Component} from "react";
import { MDBContainer } from "mdbreact";
import autosize from "autosize";
import {withRouter} from "../../components/PropsWrapper/PropsWrapper";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import TextField from '@mui/material/TextField';
import { purple } from '@mui/material/colors';
import {createTheme, ThemeProvider} from "@mui/material";
import {Link} from "react-router-dom";

class PollPasswordInput extends Component{
    constructor(props) {
        super(props);

        this.state = {
            loadingPollData: false,
            pollID: "",
            pollTitle: ""
            pollPassword: "",
            inputPassword: "",
        }
    }

    componentDidMount() {
    }

    // getPollInformation
    // *from MongoDB*
    //
    // submitPassword
    // *from user*
    //
    // checkPassword
    //
    // displayWrong
    // *checkPassword -> false*
    //
    // routeToViewer
    // *checkPassword -> true*
    //
    // ?

    render(){
        const defaultMaterialTheme = createTheme({
            palette: {
                primary: purple,
                secondary: purple,
            },
        });
        const color = "#ffffff";
        if (this.state.loadingPollData) {
            return (
                <MDBContainer fluid className="page">
                    <LoadingWheel/>
                </MDBContainer>
            );
        } else {
            return (
                <MDBContainer fluid className="page">
                    <LoadingWheel/>
                </MDBContainer>
            );
        }
    }
}