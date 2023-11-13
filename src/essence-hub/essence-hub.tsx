import "azure-devops-ui/Core/override.css";
import "./essence-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import { WorkItemTrackingProcessRestClient } from "azure-devops-extension-api/WorkItemTrackingProcess";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { Page } from "azure-devops-ui/Page";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { CommonServiceIds, IProjectPageService, IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "./modules/AuthTokenProvider";
import { AzureFetch } from "./modules/AzureFetch";

async function MigrateToEssenceProcessTemplate(templateId: string, projectId: string, vssRestClientOptions: IVssRestClientOptions) {
  AzureFetch(projectId + "/_apis/wit/projectprocessmigration", "POST", vssRestClientOptions, JSON.stringify( { typeId: templateId} ))
    .then(() => console.log("Migrated to Essence project template"));
}

async function CheckProjectProcess(projectId: string, client: CoreRestClient) {
  const processId: string = await client
    .getProjectProperties(projectId, ["System.ProcessTemplateType"])
    .then(props => props[0].value);

  const process = await client.getProcessById(processId);
  console.log("Current process:", process);
  
  if (process.name == "Essence") {
    return true;
  }
  return false;
}

async function CreateEssenceProcess(agileId: string, options: IVssRestClientOptions) {
  var createdTemplate = await AzureFetch("_apis/work/processes", "POST", options, JSON.stringify({
    name: "Essence",
    description: "Template for projects using methods and practices defined in Essence language",
    parentProcessTypeId: agileId,
  })).then(response => response.json());
  console.log("Created Essence process template", createdTemplate);
  return createdTemplate;
}

function Hub() {
  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
  const [coreRestClient, setCoreRestClient] = useState<CoreRestClient>();
  const [processRestClient, setProcessRestClient] = useState<WorkItemTrackingProcessRestClient>();

  useEffect(() => {
    SDK.init().then(() => {
      let host = SDK.getHost();
      console.log("Current host:", host);
      console.log("Root path:", window.location.ancestorOrigins[0]);
      setVssRestClientOptions({
        rootPath: `${window.location.ancestorOrigins[0]}/${host.name}/`,
        authTokenProvider: new RestTokenProvider()
      });
      setCoreRestClient(new CoreRestClient(vssRestClientOptions));
      setProcessRestClient(new WorkItemTrackingProcessRestClient(vssRestClientOptions));
    });
  }, []);

  async function HandleClick() {
    const project = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
      .then(service => service.getProject());
    if (project === undefined) {
      console.log("Could not get project info");
      return;
    }

    if (coreRestClient === undefined) {
      console.log("CoreRestClient is not defined");
      return;
    }
    if (processRestClient === undefined) {
      console.log("ProcessRestClient is not defined");
      return;
    }

    if (await CheckProjectProcess(project.id, coreRestClient)) {
      return;
    }

    const processes = await coreRestClient.getProcesses();
    console.log("Available processes list:", processes);
    const essenceTemplate = processes.find(item => item.name == "Essence");
    if (essenceTemplate !== undefined) {
      await MigrateToEssenceProcessTemplate(essenceTemplate.id, project.id, vssRestClientOptions);
      return;
    }

    const agileId = processes.find(item => item.name == "Agile")!.id;
    const createdTemplate = await CreateEssenceProcess(agileId, vssRestClientOptions);
    await MigrateToEssenceProcessTemplate(createdTemplate.typeId, project.id, vssRestClientOptions);
  }

  return (
    <Page>
      <Button
        text="Press me"
        primary={true}
        onClick={HandleClick}
      />
    </Page>
  );
}

ReactDOM.render(<Hub />, document.getElementById("root"));
