import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context";
import { CoreRestClient } from "azure-devops-extension-api/Core/CoreClient";
import { Button } from "azure-devops-ui/Button";
import * as React from "react"
import { AzureFetch } from "../common/azure/AzureFetch";
import { ProcessType } from "azure-devops-extension-api/Core";

interface IProps {
  projectId: string,
  coreRestClient: CoreRestClient,
  vssRestClientOptions: IVssRestClientOptions
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

async function MigrateToEssenceProcessTemplate(templateId: string, projectId: string, vssRestClientOptions: IVssRestClientOptions) {
  AzureFetch({
    path: projectId + "/_apis/wit/projectprocessmigration",
    method: "POST",
    vssRestClientOptions: vssRestClientOptions,
    body: JSON.stringify({ typeId: templateId }),
    apiVersion: "7.1-preview.1"
  })
    .then(() => console.log("Migrated to Essence project template"));
}

export function ProcessMigration({ projectId, coreRestClient, vssRestClientOptions }: IProps) {
  async function HandleClick() {
    if (await CheckProjectProcess(projectId, coreRestClient)) {
      return;
    }

    const processes = await coreRestClient.getProcesses();
    console.log("Available processes list:", processes);
    const essenceTemplate = processes.find(item => item.name == "Essence");
    if (essenceTemplate === undefined) {
      console.log("Could not find Essence process template")
      return;
    }
    coreRestClient.getProcessById(essenceTemplate.id).then(process => console.log(process.type == ProcessType.Custom));
    await MigrateToEssenceProcessTemplate(essenceTemplate.id, projectId, vssRestClientOptions);
  }

  return (
    <Button
      text="Migrate to Essence process template"
      primary={true}
      onClick={HandleClick}
    />
  )
}