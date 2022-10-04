import React from "react";
import { Link } from "react-router-dom";
import { MDBContainer } from "mdbreact";
import GroupSettings from "../../components/GroupSettings/GroupSettings";
import LoadingWheel from "../../components/LoadingWheel/LoadingWheel";
import { withRouter } from "../../components/PropsWrapper/PropsWrapper";

/*----------------------------------------------------------------------------*/


function Group({ updateTitle, router }) {
  const { params: { groupID } } = router;

  const [ doneLoading, setDoneLoading ] = React.useState(false);
  const [ polls, setPolls ] = React.useState([ ]);
  const [ showError, setShowError ] = React.useState(null);

  const [ data, setData ] = React.useState({
    name: "",
    description: "",
    isMember: false,
    isAdmin: false,
  });

  // Get poll metadata.
  React.useEffect(async () => {
    updateTitle?.(data.name);

    const URL = process.env.REACT_APP_BACKEND_URL + "/groups/" + groupID;
    const out = await fetch(URL, { method: "GET" });
    const response = await out.json();

    if (response.result !== "success") {
      return setShowError(true);
    }

    updateTitle?.(response.data.name);
    
    if (!response.data.isMember && !response.data.isAdmin) {
      return setShowError(true);
    }

    const { name, description, isMember, isAdmin } = response.data;
    setData({ name, description, isMember, isAdmin });
    setDoneLoading(true);
  }, [ updateTitle, setShowError, groupID, data, setData, setDoneLoading ]);

  // Get poll data.
  React.useEffect(async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/groups/${groupID}/polls`;
    const out = await fetch(URL, { method: "GET" });
    const response = await out.json();

    console.log(response);
    if (response.result !== "success") return;
    setPolls(response.data);
  }, [ groupID, setPolls ]);

  // const pollButtonClick = React.useCallback(pollID => {
  //   if (data.isAdmin) {
  //     router.navigate(`/polls/${pollID}/edit`);
  //   } else if(data.isMember) {
  //     router.navigate(`/polls/${pollID}/view`);
  //   }
  // }, [ router, data ]);

  if (showError) {
    return (
      <MDBContainer fluid className="page">
        <MDBContainer fluid className="box">
          <p className="fontSizeLarge">Error loading data! Please try again.</p>
        </MDBContainer>
      </MDBContainer>
    );
  } else if (!doneLoading) {
    return (
      <MDBContainer className="page">
        <LoadingWheel/>
      </MDBContainer>
    );
  } else if (!data.isMember && !data.isAdmin) {
    // TODO: Display join button to the user if they are not in group.
    return (
      <MDBContainer className="page">
        <p className="fontSizeLarge">{data.name}</p>
        <button className="button">Join</button>
      </MDBContainer>
    );
  }

  const poll_view = polls.map((poll, index) => (
    <Link to={`/polls/${poll.id}/${data.isAdmin ? "edit" : "view"}`}
      style={{ width: "17em" }}>
      <button style={{ width: "20em" }}
        className="button">
        {`Poll ${index + 1}: ${poll.title}`}
      </button>
    </Link>
  ));

  return (
    <MDBContainer className="page">
      <MDBContainer className="two-box">
        <GroupSettings state={{ ...data, id: groupID }}/>
        <MDBContainer className="box">
          <p className="fontSizeLarge">My Polls</p>
          { polls.length === 0 ? (
            <p>You don't have any polls available at this time.<br/><br/></p>
          ) : poll_view }
        </MDBContainer>
      </MDBContainer>
    </MDBContainer>
  );
}

/*----------------------------------------------------------------------------*/

export default withRouter(Group);
