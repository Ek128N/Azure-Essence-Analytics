import { Button } from "azure-devops-ui/Button";
import * as React from "react"
import { AzureFetch } from "../modules/AzureFetch";
import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context";
import * as SDK from "azure-devops-extension-sdk"

interface IProps {
  vssRestClientOptions: IVssRestClientOptions
}

export function ProcessImport( { vssRestClientOptions }: IProps) {
  async function HandleClick() {
    const location = window.location.href.split("/");
    const url = location.slice(0, location.indexOf("dist") + 1).join("/") + "/Essence.zip";
    const file = await fetch(url).then(res => res.body);
    AzureFetch({
      path: "_apis/work/processadmin/processes/import",
      method: "POST",
      vssRestClientOptions: vssRestClientOptions,
      contentType: "application/octet-stream",
      apiVersion: "7.2-preview.1",
      body: file,
      query: "replaceExistingTemplate=true"
    })
  }
  
  return (
    <Button
      text="Create Essence process template"
      primary={true}
      onClick={HandleClick}
    />
  )
}