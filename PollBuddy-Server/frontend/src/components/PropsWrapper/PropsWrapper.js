import React from "react";
import {useParams, useLocation, useNavigate, useSearchParams} from "react-router-dom";

// Apparently this is necessary in React-Router V6 to get access to the URL parameters with a class-based component...
export function withRouter(C) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    const [searchParams, /*setSearchParams*/] = useSearchParams();
    return (<C {...props} router={{ location, navigate, params, searchParams }} />);
  }

  return ComponentWithRouterProp;
}
