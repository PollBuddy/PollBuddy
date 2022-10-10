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

  if (isLoggedIn === (state ?? false)) {
    return element;
  } else if (state) {
    return <Navigate state={{ prevRoute: location.pathname }} to="/login"/>;
  } else {
    return <Navigate to="/"/>;
  }
}

// These are some alternative, more concise versions of PrivateComponent.

// This one makes the page accessable only if you are not logged in.
function _PublicPage({ page: Page }) {
  const [ loggedIn, ] = useLocal("loggedIn");

  if (loggedIn === "true") {
    return <Page/>;
  } else if (state) {
    return <Navigate to="/"/>;
  }
}

export const PublicPage = React.memo(_PublicPage);

// This one make the page accessable only if you are logged in.
function _PrivatePage({ page: Page }) {
  const { pathname } = useLocation();
  const [ loggedIn, ] = useLocal("loggedIn");

  if (loggedIn) {
    return <Page/>;
  } else {
    return <Navigate state={{ prevRoute: pathname }} to="/login"/>;
  }
}

export const PrivatePage = React.memo(_PrivatePage);

export default React.memo(PrivateComponent);
