import React from "react";
import {Navigate} from "react-router-dom";
import { withRouter } from "../PropsWrapper/PropsWrapper";
import { useSearchParams } from 'react-router-dom';

function checkParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const it = searchParams.keys();
  let result = it.next();
  const obj = {};
  while (!result.done) {
    obj[result.value] = searchParams.get(result.value);
    result = it.next();
  }
  console.log(obj);
  localStorage.setItem("urlParams", JSON.stringify(obj));
}

// Private component is used to redirect users based on if the are logged in or not.
// Pass in state = {true} if the user needs to be logged in to access a route.
// Pass in state = {false} if the user needs to be logged out to access a route.
// If it doesn't matter whether the user is logged in or not, don't use PrivateComponent.
const privateComponent = (props) => {
    let isLoggedIn = localStorage.getItem("loggedIn") === "true";
    if (isLoggedIn === props.state) {
      return props.element;
    } else if(props.state){
      checkParams();
      return <Navigate state={{prevRoute: props.router.location.pathname}} to={"/login"}/>;
    } else {
      return <Navigate to={"/"}/>;
    }
};

export default withRouter(privateComponent);
