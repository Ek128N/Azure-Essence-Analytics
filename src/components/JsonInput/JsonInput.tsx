import * as React from "react";
import {JSX, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import MethodDefinition, {Method} from "../../modules/MethodDefinition";
import {IVssRestClientOptions} from "azure-devops-extension-api";
import {getDataServices} from "../common/DataService";

export interface IJsonInput {
    vssRestClientOptions: IVssRestClientOptions,
}



export default function render(params: IJsonInput): JSX.Element {

    console.log("JsonInput")
    let methodStorageKey:string="essence"

    const [jsonData, setJsonData] = useState<Method[]>([]);

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
            const methodDefinitions = obj as MethodDefinition[];
            console.log(methodDefinitions)
            function createNamesForMethodDefinitions(methodDefinitions: MethodDefinition[]):Method[] {
                let methods:Method[] = [] ;

                function GenerateMethodName(number:number):string {
                    // Current Date + Number inOrder
                    let dateTime = new Date()
                    return "Method "+number+": "+ dateTime.toString().slice(4,-12)   ;
                }
                let c=1;
                for ( let methodDefinition of methodDefinitions ){
                    methods.push(new Method(GenerateMethodName(c),methodDefinition))
                    c++;
                }
                return methods;
            }

            let methods= createNamesForMethodDefinitions(methodDefinitions);

            //Save data to React state
            setJsonData(methods);

            //Save data to Organization storage
            let _dataManager = await getDataServices();

            await _dataManager.setValue(methodStorageKey, methods);

        }


    }

    async function CheckStoredData() {
        console.log(jsonData);

        let _dataManager = await getDataServices();
        _dataManager.getValue<Method>(methodStorageKey).then( function (data: Method) {

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


