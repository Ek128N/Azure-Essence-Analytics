import * as React from "react";
import {JSX, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import JsonInputTemplate from "../../modules/JsonInputTemplate";
import * as SDK from "azure-devops-extension-sdk";
import {createWorkItems} from "./WorkItemCreator";
import {IVssRestClientOptions} from "azure-devops-extension-api";

export interface ProjectData{
    projectId:string
    vssRestClientOptions:IVssRestClientOptions,
}


export default function render(projectData:ProjectData): JSX.Element {
    //PassDown ProjectID & Vss data

    const [jsonData, setJsonData] = useState<[JsonInputTemplate]>([new JsonInputTemplate()]);

    function ParseJson(): void {

        const jsonInputElement = document.getElementById("jsonInput") as HTMLInputElement;
        let file = jsonInputElement.files![0];


        if (file === undefined) {
            //File was not attached
            throw new Error("File is undefined");
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

        createWorkItems(jsonData,projectData);

    }
    function CheckState() {
        console.log(jsonData);
    }



    return (

        <div>
            <Button
                text="Check jsonData state"

                onClick={CheckState}
            />
            <p>JsonInput or something else</p>
            <input type="file" id="jsonInput" accept=".json"/>
            <Button
                text="SubmitJson"
                onClick={ParseJson}
            />
        </div>

    );
}


