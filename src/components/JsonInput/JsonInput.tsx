import * as React from "react";
import {JSX, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import JsonInputTemplate from "../../modules/JsonInputTemplate";
import {createWorkItems} from "./WorkItemCreator";
import {IVssRestClientOptions} from "azure-devops-extension-api";
import {Spinner, SpinnerSize} from "azure-devops-ui/Spinner";
import {Status, Statuses, StatusSize} from "azure-devops-ui/Status";
import {ObservableValue} from "azure-devops-ui/Core/Observable";
import {ImportStatus} from "../ProcessImport";

export interface ProjectData {
    projectId: string
    vssRestClientOptions: IVssRestClientOptions,
}



export default function render(projectData: ProjectData): JSX.Element {
    //PassDown ProjectID & Vss data

    const [WICreationStatus, setWICreationStatus] = useState(Statuses.Waiting);

    const [jsonData, setJsonData] = useState<[JsonInputTemplate]>([new JsonInputTemplate()]);

    function ParseJson(): void {

        const jsonInputElement = document.getElementById("jsonInput") as HTMLInputElement;
        let file = jsonInputElement.files![0];


        if (file === undefined) {
            //File was not attached
            console.log("File is undefined");
            return;
        }

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function () {
            let readRes = reader.result as string;
            Parse(readRes);
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

        function Parse(json: string) {
            let obj = JSON.parse(json);
            const template: [JsonInputTemplate] = Object.assign([new JsonInputTemplate], obj) as [JsonInputTemplate];

            setJsonData(template as [JsonInputTemplate]);

        }


    }

    function CheckState() {
        console.log(jsonData);
    }

    async function CreateWI() {
        //start
        setWICreationStatus(Statuses.Running);
        await createWorkItems(jsonData, projectData);
        //finish
        setWICreationStatus(Statuses.Success);
    }


    return (

        <div>
            <Button
                text="Check jsonData state"

                onClick={CheckState}
            />
            <p>JsonInput</p>
            <input type="file" id="jsonInput" onChange={ParseJson} accept=".json"/>
           <div className="margin-top-16 flex-row">
            <Button
                text="Create WorkItems"
                onClick={CreateWI}
            />{WICreationStatus==Statuses.Running &&
            <Spinner
                size={SpinnerSize.medium}
                className="margin-left-8"
            />
           }
               {WICreationStatus==Statuses.Success &&
                   <Status
                       {...Statuses.Success}
                       key="success"
                       size={StatusSize.l}
                       className="flex-self-center margin-left-8"
                   />
               }
           </div>
        </div>

    );
}


