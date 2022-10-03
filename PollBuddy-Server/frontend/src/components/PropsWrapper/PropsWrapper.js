import React from "react";
import {
  useParams, useLocation, useNavigate, useSearchParams
} from "react-router-dom";

/*----------------------------------------------------------------------------*/

// Apparently this is necessary in React-Router V6 to get access to the URL
// parameters with a class-based component...
function withRouter(C) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [ searchParams, ] = useSearchParams();
    
    return (
      <C {...props} router={{ location, navigate, params, searchParams }} />
    );
  }

  return ComponentWithRouterProp;
}

/*----------------------------------------------------------------------------*/

export { withRouter };