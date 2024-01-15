import * as React from "react";
import {JSX, useEffect, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import MethodDefinition from "../../modules/MethodDefinition";
import {createWorkItems} from "../WorkItemCreator/WorkItemCreator";
import {IVssRestClientOptions} from "azure-devops-extension-api";
import {Spinner, SpinnerSize} from "azure-devops-ui/Spinner";
import {Status, Statuses, StatusSize} from "azure-devops-ui/Status";
import {ObservableValue} from "azure-devops-ui/Core/Observable";
import {ImportStatus} from "../ProcessImport";
import {getDataServices} from "../common/DataService";

export interface IJsonInput {
    vssRestClientOptions: IVssRestClientOptions,
}



export default function render(params: IJsonInput): JSX.Element {

    console.log("JsonInput")
    let methodStorageKey:string="essence"

    const [jsonData, setJsonData] = useState<[MethodDefinition]>([new MethodDefinition()]);

    function GetJson(): void {

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
            SaveJsonData(readRes);
            //SaveDataToState
            //SaveDataToAzureDevOpsDataStorage
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

        async function SaveJsonData(json: string) {
            let obj = JSON.parse(json);
            const template: [MethodDefinition] = Object.assign([new MethodDefinition], obj) as [MethodDefinition];

            //Save data to React state
            setJsonData(template as [MethodDefinition]);


            //Save data to Organization storage
            let _dataManager = await getDataServices();

            await _dataManager.setValue(methodStorageKey, template);

        }


    }

    async function CheckStoredData() {
        console.log(jsonData);

        let _dataManager = await getDataServices();
        _dataManager.getValue<MethodDefinition>(methodStorageKey).then( function (data: MethodDefinition) {

            console.log(data)

        });
    }



    return (

        <div>
            <Button
                text="Check jsonData state"

                onClick={CheckStoredData}
            />
            <p>JsonInput</p>
            <input type="file" id="jsonInput" onChange={GetJson} accept=".json"/>
            <Button
                text="Save Methods"

                onClick={GetJson}
            />
        </div>

    );
}


