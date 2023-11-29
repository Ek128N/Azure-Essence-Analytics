import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";

import JsonInput from "./components/JsonInput" ;

import { useEffect, useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { CommonServiceIds, IProjectPageService, IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "../modules/AuthTokenProvider";
import { AzureFetch } from "../modules/AzureFetch";
import JsonInputTemplate from "../modules/JsonInputTemplate";

import { ProcessCheck } from "../components/ProcessCheck";


function Hub() {

  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
  const [projectId, setProjectId] = useState<string>("");
  const [isValidProcess, setIsValidProcess] = useState<boolean>();
  const [jsonData, setJsonData] = useState<[JsonInputTemplate]>([new JsonInputTemplate()]);

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

  function CheckState() {
    console.log(jsonData);
  }

  return (
    <Page className="padding-horizontal-16 flex-grow">
      <Header
        title="Essence"
        titleSize={TitleSize.Large}
        className="margin-bottom-16"
      />
      <ProcessCheck isValidProcess={isValidProcess}>
        <Button
            text="Check jsonData state"

            onClick={CheckState}
        />
        <JsonInput setJsonData={setJsonData}/>
      </ProcessCheck>
    </Page>
  );
}

ReactDOM.render(<Hub />, document.getElementById("root"));
