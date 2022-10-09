import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useLocal } from "../../hooks";

// Private component is used to redirect users based on if the are logged in or not.
// Pass in state = {true} if the user needs to be logged in to access a route.
// Pass in state = {false} if the user needs to be logged out to access a route.
// If it doesn't matter whether the user is logged in or not, don't use PrivateComponent.
function PrivateComponent({ state, element }) {
  const location = useLocation();
  const [ loggedIn, ] = useLocal("loggedIn");
  const isLoggedIn = loggedIn === "true";

  if (isLoggedIn === state) {
    return element;
  } else if (state) {
    return <Navigate state={{ prevRoute: location.pathname }} to="/login"/>;
  } else {
    return <Navigate to="/"/>;
  }
}

export default React.memo(PrivateComponent);
