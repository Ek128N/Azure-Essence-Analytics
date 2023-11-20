import * as React from "react";
import {JSX} from "react";
import {Button} from "azure-devops-ui/Button";
import JsonInputTemplate from "../../essence-hub/modules/JsonInputTemplate";
import * as SDK from "azure-devops-extension-sdk";


interface renderProps {
    setJsonData: (value: (((prevState: [JsonInputTemplate]) => [JsonInputTemplate]) | [JsonInputTemplate])) => void
}

export default function render({setJsonData}: renderProps): JSX.Element {


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
            SDK.register("EssenceData", template);

            //console.log(jsonData[0].alphas);
            //console.log(template);
        }


    }


    return (

        <div>
            <p>JsonInput or something else</p>
            <input type="file" id="jsonInput" accept=".json"/>
            <Button
                text="SubmitJson"
                onClick={ParseJson}
            />
        </div>

    );
}


