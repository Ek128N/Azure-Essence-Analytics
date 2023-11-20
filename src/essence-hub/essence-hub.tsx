import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { CommonServiceIds, IProjectPageService, IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "../modules/AuthTokenProvider";
import { AzureFetch } from "../modules/AzureFetch";
import { ProcessDownload } from "../components/ProcessDownload";
import { ProcessImport } from "../components/ProcessImport";


function Hub() {
  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
  const [coreRestClient, setCoreRestClient] = useState<CoreRestClient>(new CoreRestClient(vssRestClientOptions));
  const [projectId, setProjectId] = useState<string>("");
  const [isValidProcess, setIsValidProcess] = useState<boolean>();

  useEffect(() => {
    let clientOptions: IVssRestClientOptions;
    let projId: string;
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
        setCoreRestClient(new CoreRestClient(clientOptions));
      })
      .then(() => SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService))
      .then(service => service.getProject())
      .then(project => {
        if (project === undefined) {
          throw new Error("Could not get current project info");
        }
        setProjectId(project.id);
        projId = project.id;
        SDK.notifyLoadSucceeded();
      })
      .then(() => CheckProjectProcess(projId, clientOptions))
      .catch(err => {
        SDK.notifyLoadFailed(err);
      });
  }, []);

  async function CheckProjectProcess(projectId: string, vssRestClientOptions: IVssRestClientOptions) {
    const props = await AzureFetch({
      path: `_apis/projects/${projectId}/properties`,
      vssRestClientOptions: vssRestClientOptions,
      query: "keys=System.ProcessTemplateType"
    }).then(res => res.json());
    setIsValidProcess(props[0].value == "cd776007-f12e-4188-891e-f210b6a39c12");
  }

  return (
    <Page>
      <ProcessDownload
        vssRestClientOptions={vssRestClientOptions}
      />
      <ProcessImport
        vssRestClientOptions={vssRestClientOptions}
      />
      {isValidProcess !== undefined && <p>Process template is {isValidProcess == false && "not"} valid</p>}
    </Page>
  );
}

ReactDOM.render(<Hub />, document.getElementById("root"));
