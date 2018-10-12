import * as React from "react";
import {
  Container,
  Segment,
  Transition
} from "semantic-ui-react";

import "../styles/footer.css";

export interface Props {
  conversationStarted: boolean
}

class FooterContainer extends React.Component<Props, object> {

  render() {
    return (
      <Transition animation="slide up" visible={!this.props.conversationStarted} duration={500}>
        <Segment className="footer" vertical style={{width: "100%", position: "fixed", bottom: "0", paddingBottom: "0"}}>
          <Container textAlign="center">
          </Container>
        </Segment>
      </Transition>
    );
  }
}

export default FooterContainer;