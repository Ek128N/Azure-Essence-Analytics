import { Button } from "azure-devops-ui/Button";
import * as React from "react"
import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context";

interface IProps {
  vssRestClientOptions: IVssRestClientOptions
}

export function ProcessDownload( { vssRestClientOptions }: IProps) {
  async function HandleClick() {
    const location = window.location.href.split("/");
    const url = location.slice(0, location.indexOf("dist") + 1).join("/") + "/Essence.zip";
    window.location.href = url;
  }
  
  return (
    <Button
      text="Download Essence process template"
      primary={true}
      onClick={HandleClick}
    />
  )
}