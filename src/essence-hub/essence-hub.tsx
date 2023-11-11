import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";
import JsonInput from "./jsonInput/JsonInput" ;

class Hub extends React.Component {
  public componentDidMount() {
    SDK.init();
  }

  public render(): React.ReactElement|null {
    return (
      <Page className="flex-grow">
        <JsonInput/>
      </Page>
    );
  }
}

ReactDOM.render(<Hub />, document.getElementById("root"));

