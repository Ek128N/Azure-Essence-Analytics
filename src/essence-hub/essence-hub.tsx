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

async function MigrateToEssenceProcessTemplate(templateId: string, projectId: string, vssRestClientOptions: IVssRestClientOptions) {
  fetch(`${vssRestClientOptions.rootPath}${projectId}/_apis/wit/projectprocessmigration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json;api-version=7.2-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
      "Authorization": await vssRestClientOptions.authTokenProvider!.getAuthorizationHeader()
    },
    body: JSON.stringify({ typeId: templateId })
  }).then(() => console.log("Migrated to Essence project template"));
}

function Hub() {
  const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
  const [restTokenProviderInstance, setRestTokenProviderInstance] = useState(new RestTokenProvider());

  useEffect(() => {
    SDK.init().then(() => {
      let host = SDK.getHost();
      console.log("Current host:", host);
      console.log("Root path:", window.location.ancestorOrigins[0]);
      setVssRestClientOptions({
        rootPath: `${window.location.ancestorOrigins[0]}/${host.name}/`,
        authTokenProvider: restTokenProviderInstance
      });
    });
  }, []);

  async function HandleClick() {
    const project = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService)
      .then(service => service.getProject());
    if (project === undefined) {
      console.log("Could not get project info");
      return;
    }
    

    const processRestClient = new WorkItemTrackingProcessRestClient(vssRestClientOptions);
    const coreRestClient = new CoreRestClient(vssRestClientOptions);

    const processId: string = await coreRestClient
      .getProjectProperties(project.id, ["System.CurrentProcessTemplateId"])
      .then(props => props[0].value);
    const process = await coreRestClient.getProcessById(processId);
    console.log("Current process:", process);
    if (process.name == "Essence") {
      return;
    }

    const processes = await coreRestClient.getProcesses();
    console.log("Available processes list:", processes);
    const essenceTemplate = processes.find(item => item.name == "Essence");
    if (essenceTemplate !== undefined) {
      await MigrateToEssenceProcessTemplate(essenceTemplate.id, project.id, vssRestClientOptions);
      return;
    }

    const basicTemplateId = processes.find(item => item.name == "Basic")!.id;
    const createdTemplate = await processRestClient.createNewProcess({
      name: "Essence",
      description: "Template for projects using methods and practices defined in Essence language",
      parentProcessTypeId: basicTemplateId,
      referenceName: "HITS.Essence"
    });
    console.log("Created Essence process template", createdTemplate);
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
