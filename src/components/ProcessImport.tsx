import {Button, IButtonProps} from "azure-devops-ui/Button";
import {Card} from "azure-devops-ui/Card";
import {Header, TitleSize} from "azure-devops-ui/Header";
import {Spinner, SpinnerSize} from "azure-devops-ui/Spinner";
import {Status, StatusSize, Statuses} from "azure-devops-ui/Status";
import {MessageCard, MessageCardSeverity} from "azure-devops-ui/MessageCard";
import * as React from "react"
import {AzureFetch} from "../common/azure/AzureFetch";
import {IVssRestClientOptions} from "azure-devops-extension-api/Common/Context";
import {useState} from "react";

interface IProps {
    vssRestClientOptions: IVssRestClientOptions
}

export enum ImportStatus {
    NotStarted,
    Pending,
    Fail,
    Success
}

export function ProcessImport({vssRestClientOptions}: IProps) {
    const [importStatus, setImportStatus] = useState(ImportStatus.NotStarted);
    const [validationResults, setValidationResults] = useState<any[]>([]);

    async function HandleClick() {
        const location = window.location.href.split("/");
        const url = location.slice(0, location.indexOf("dist") + 1).join("/") + "/Essence.zip";
        const file = await fetch(url).then(res => res.blob());
        setImportStatus(ImportStatus.Pending);
        AzureFetch({
            path: "_apis/work/processadmin/processes/import",
            method: "POST",
            vssRestClientOptions: vssRestClientOptions,
            contentType: "application/octet-stream",
            body: file,
            query: "replaceExistingTemplate=true"
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                setImportStatus(json.validationResults.length == 0 ? ImportStatus.Success : ImportStatus.Fail);
                setValidationResults(json.validationResults);
            })
            .catch(err => {
                console.log(err);
                setImportStatus(ImportStatus.Fail);
            })
    }

    function ValidationResultsMap() {
        return validationResults.map((res, index) => {
            const helpButtonProps: IButtonProps = {
                text: "Help",
                href: res.helpLink,
                target: "_blank"
            }
            return (
                <MessageCard
                    key={index}
                    severity={res.issueType == 1 ? MessageCardSeverity.Error : MessageCardSeverity.Warning}
                    className={"flex-self-stretch margin-bottom-8" + (index == 0 && " margin-top-16")}
                    buttonProps={[helpButtonProps]}
                >
                    <div>
                        <div>{res.description}</div>
                        <div>{res.file && `file: ${res.file} | line: ${res.line}`}</div>
                    </div>
                </MessageCard>
            )
        })
    }

    return (
        <div>

            <div className="flex-column flex-grow">
                <div className="flex-row">
                    <Button
                        text="Create Essence process template"
                        primary={true}
                        onClick={HandleClick}
                    />
                    {importStatus == ImportStatus.Pending &&
                        <Spinner
                            size={SpinnerSize.medium}
                            className="margin-left-8"
                        />
                    }
                    {importStatus == ImportStatus.Fail &&
                        <Status
                            {...Statuses.Failed}
                            key="failed"
                            size={StatusSize.l}
                            className="flex-self-center margin-left-8"
                        />
                    }
                    {importStatus == ImportStatus.Success &&
                        <Status
                            {...Statuses.Success}
                            key="success"
                            size={StatusSize.l}
                            className="flex-self-center margin-left-8"
                        />
                    }
                </div>
                {ValidationResultsMap()}
            </div>

        </div>
    )
}