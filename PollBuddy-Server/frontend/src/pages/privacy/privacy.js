import React, {Component} from "react";
import "mdbreact/dist/css/mdb.css";
import {MDBContainer} from "mdbreact";

export default class privacy extends Component {
  componentDidMount() {
    this.props.updateTitle("Privacy");
  }

  render() {
    return (
      <MDBContainer className="page">
        {/* We should look into incorporating a markdown/google doc onto this page rather than typing directly on the page.
               It's much easier to update and maintain. */}

        <p className="fontSizeSmall width-90">
                  From the contributors of Poll Buddy,
        </p>
        <p className="fontSizeSmall width-90">
                  Our promise is to keep your data safe, protected and far from anyone that could use it in a harmful way.
                  The purpose of this app is and always will be for educational purposes <i>only</i>.
          <br/>
                  etc. etc.
          <br/>
                  (We will definitely need to rewrite the above text)
        </p>
        <p className="fontSizeSmall width-90">
                  Here's some information about privacy policies. Pretty much, we need to talk about what info we will
                  take,
                  how we will use it, how we will store/protect it, cookies, etc. At one point in the near future, we
                  should gather together and write a privacy policy.
        </p>
        <p className="fontSizeSmall width-90">
                  https://www.privacypolicytemplate.net/
          <br/>
                  https://www.opentracker.net/article/how-write-website-privacy-policy
        </p>
        <p className="fontSizeSmall width-90">
                  After developing our privacy policy, it would be cool to write it all in a google doc/markdown/whatever
                  file
                  and then just display it on this page. I'm not sure how plausible that would be, but editing would be
                  much easier.
                  Regular text on this .js file is very difficult to update and maintain.
        </p>

      </MDBContainer>
    )
  }
}