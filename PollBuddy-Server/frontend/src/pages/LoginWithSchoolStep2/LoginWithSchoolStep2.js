import React from "react";
import "mdbreact/dist/css/mdb.css";
import { ErrorText } from "../../components";
import { Navigate, useParams } from "react-router-dom";
import { useTitle } from "../../hooks";

const REGISTER_ERROR = "Error: You are not registered! Redirecting to " +
                       "registration page...";
const SCHOOL_ERROR = "Error: Something went wrong with the school login " +
                     "process. Please try again, redirecting to login page...";
const OTHER_ERROR = "Error: Something went wrong. Details: ";

function LoginWithSchoolStep2() {
  useTitle("Login With School Step 2");

  console.log("Getting things");
  let { result, data, error } = useParams();
  let first, last, user;

  if (result == null) {
    // There are no search params.
    console.log("Failed to locate search parameters");
    result = "failure";
    error = "Failed to load data from the URL.";
  } else if (error == null) {
    // Nothing is wrong.
    first = data.firstName;
    last = data.lastName;
    user = data.userName;
  }

  // Save data about the user.
  if (result !== "failure") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("firstName", first);
    localStorage.setItem("lastName", last);
    localStorage.setItem("userName", user);

    console.log("everything worked; redirecting to /groups");
    return <Navigate push to="/groups"/>;
  }

  // Otherwise, there is an error.
  console.log("Error: " + error);

  switch (error) {
  // Redirect to register page.
  case "User is not registered.":
    alert(REGISTER_ERROR);
    return <Navigate push to="/register/school"/>;
  
  // Redirect to login page.
  case "User has not logged in with RPI.":
    alert(SCHOOL_ERROR);
    return <Navigate push to="/login/school"/>;
  
  // Database error - show the ErrorText component.
  default:
    // For some reason, this only shows up after clicking submit twice.
    alert(OTHER_ERROR + error);
    return <ErrorText text={error}/>;
  }
}

export default React.memo(LoginWithSchoolStep2);
