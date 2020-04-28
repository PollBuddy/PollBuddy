import React, {Component} from 'react';
import "./privacy.scss"
import 'mdbreact/dist/css/mdb.css';
import {MDBRow, MDBCol, MDBContainer} from 'mdbreact';
import Header from "../../components/header/header.js"

export default class privacy extends Component {
   componentDidMount() {
      document.title = "Privacy - " + document.title;
   }

   render() {
      return (
         <MDBContainer>
            <Header title="privacy" btn="login"/>

            <br/>

            {/* We should look into incorporating a markdown/google doc onto this page rather than typing directly on the page.
               It's much easier to update and maintain. */}

            <p className="placeholder-text">
               From the contributors of Poll Buddy,<br/>

               Our promise is to keep your data safe, protected and far from anyone that could use it in a harmful way.
               The purpose of this app is and always will be for educational purposes <i>only</i>.
               <br/>
               etc. etc.
               <br/>
               (We will definitely need to rewrite the above text)
               <br/><br/>
               Here's some information about privacy policies. Pretty much, we need to talk about what info we will
               take,
               how we will use it, how we will store/protect it, cookies, etc. At one point in the near future, we
               should gather together and write a privacy policy.
               <br/><br/>
               https://www.privacypolicytemplate.net/
               <br/>
               https://www.opentracker.net/article/how-write-website-privacy-policy
               <br/><br/>
               After developing our privacy policy, it would be cool to write it all in a google doc/markdown/whatever
               file
               and then just display it on this page. I'm not sure how plausible that would be, but editing would be
               much easier.
               Regular text on this .js file is very difficult to update and maintain.
               <br/><br/>
            </p>

         </MDBContainer>
      )
   }
}