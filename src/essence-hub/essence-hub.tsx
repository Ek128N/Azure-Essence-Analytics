import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { CommonServiceIds, IProjectPageService, IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "../modules/AuthTokenProvider";
import { AzureFetch } from "../modules/AzureFetch";

function Hub() {
  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
  const [coreRestClient, setCoreRestClient] = useState<CoreRestClient>(new CoreRestClient(vssRestClientOptions));
  const [projectId, setProjectId] = useState<string>("");

  useEffect(() => {
    SDK.init({ loaded: false })
      .then(() => {
        const host = SDK.getHost();
        console.log("Current host:", host);
        console.log("Root path:", window.location.ancestorOrigins[0]);
        const clientOptions = {
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
        SDK.notifyLoadSucceeded();
      })
      .catch(err => {
        SDK.notifyLoadFailed(err);
      });
  }, []);

  async function HandleProcessExport() {
    if (coreRestClient === undefined) {
      console.log("CoreRestClient is not defined");
      return;
    }

    const processes = await coreRestClient.getProcesses();
    console.log("Available processes list:", processes);
    const template = processes.find(item => item.name == "Agile");
    if (template === undefined) {
      console.log("Could not find Agile process template")
      return;
    }

    AzureFetch({
      path: "work/processadmin/processes/export/" + template.id,
      vssRestClientOptions: vssRestClientOptions,
      accept: "application/zip",
      apiVersion: "7.1-preview.1"
    })
      .then(res => res.blob())
      .then(blob => {
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
      });
  }

  return (
    <Page>
      <Button
        text="Download Agile process template"
        onClick={HandleProcessExport}
      />
    </Page>
  );
}

ReactDOM.render(<Hub />, document.getElementById("root"));
