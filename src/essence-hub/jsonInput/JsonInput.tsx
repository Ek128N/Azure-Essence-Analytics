import * as React from "react";
import {JSX, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import JsonInputTemplate from "../modules/JsonInputTemplate";


export default function render(): JSX.Element {
    const [jsonData, setJsonData] = useState<JsonInputTemplate>(new JsonInputTemplate());

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
            console.log(reader.result);
        };

        reader.onerror = function () {
            console.log(reader.error);
        };

        let json = reader.result as string;
        let obj = JSON.parse(json);


        const template: JsonInputTemplate = Object.assign(new JsonInputTemplate, obj) as JsonInputTemplate;

        setJsonData(template as JsonInputTemplate);
        console.log(jsonData);
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


