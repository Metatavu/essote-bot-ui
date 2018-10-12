import * as React from "react";

import 'semantic-ui-css/semantic.min.css';

import { Container } from "semantic-ui-react";
import essoteLogo from "../gfx/essote_logo.png";
import MenuContainer from "./MenuContainer";
import FooterContainer from "../containers/FooterContainer";

class BasicLayout extends React.Component {
  render() {
    return (
      <div>
        <MenuContainer siteLogo={essoteLogo} />
          <Container style={{ marginTop: "7em", paddingBottom: "7em" }}>
            {this.props.children}
          </Container>
        <FooterContainer />
      </div>
    );
  }
}

export default BasicLayout;