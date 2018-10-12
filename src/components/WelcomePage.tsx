import * as React from "react";

import Bot from "../containers/Bot";

import BasicLayout from "./BasicLayout";

class WelcomePage extends React.Component<any, any> {

  render() {
    return (
      <BasicLayout>
        <Bot />
      </BasicLayout>
    );
  }
}

export default WelcomePage;