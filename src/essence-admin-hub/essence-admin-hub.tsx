import "azure-devops-ui/Core/override.css";
import "./essence-admin-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "../modules/AuthTokenProvider";
import { ProcessImport } from "../components/ProcessImport";

function AdminHub() {
  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});

  useEffect(() => {
    let clientOptions: IVssRestClientOptions;
    SDK.init({ loaded: false })
      .then(() => {
        const host = SDK.getHost();
        console.log("Current host:", host);
        console.log("Root path:", window.location.ancestorOrigins[0]);
        clientOptions = {
          rootPath: `${window.location.ancestorOrigins[0]}/${host.name}/`,
          authTokenProvider: new RestTokenProvider()
        }
        setVssRestClientOptions(clientOptions);
        SDK.notifyLoadSucceeded();
      })
      .catch(err => {
        SDK.notifyLoadFailed(err);
      });
  }, []);

  return (
    <Page className="padding-horizontal-16 flex-grow">
      <Header
        title="Essence Admin Panel"
        titleSize={TitleSize.Large}
        className="margin-bottom-16"
      />
      <ProcessImport
        vssRestClientOptions={vssRestClientOptions}
      />
    </Page>
  );
}

ReactDOM.render(<AdminHub />, document.getElementById("root"));
