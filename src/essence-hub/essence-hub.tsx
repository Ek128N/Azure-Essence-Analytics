import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";

class Hub extends React.Component {
  public componentDidMount() {
    SDK.init();
  }

  public render(): JSX.Element {
    return (
      <Page className="flex-grow">
        <h1>Goodbye World</h1>
      </Page>
    );
  }
}

ReactDOM.render(<Hub />, document.getElementById("root"));