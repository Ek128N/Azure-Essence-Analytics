import * as React from "react";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { PropsWithChildren } from "react";

interface IProps {
  isValidProcess: boolean | undefined
}

export function ProcessCheck({children, isValidProcess}: PropsWithChildren<IProps>) {
  return (
    <>
      {isValidProcess === undefined &&
      <MessageCard severity={MessageCardSeverity.Info}>
        Checking for project process template...
        <Spinner
          size={SpinnerSize.medium}
          className="margin-left-8"
        />
      </MessageCard>}
      {isValidProcess === true && children}
      {isValidProcess === false &&
      <MessageCard severity={MessageCardSeverity.Error}>
        To import Essence methods and practices the project process template must be set to Essence.
        Please create a new project with Essence process template.
      </MessageCard>}
    </>
  )
}