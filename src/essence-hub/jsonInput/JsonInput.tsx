import * as React from "react";
import{JSX}from"react";
import{Button}from"azure-devops-ui/Button";


export default class JsonInput extends React.Component{
    public render():JSX.Element{
        return(

            <div>
                <p>JsonInput or something else</p>
                <input type="file" id="jsonInput" accept=".json"/>
                <Button
                    text="SubmitJson"
                    onClick={this.onSubmitJson}
                />
            </div>

        );
    }

    private onSubmitJson=async():Promise<void>=>{

        const jsonInputElement=document.getElementById("jsonInput") as HTMLInputElement;
        let file = jsonInputElement.files![0];


        if (file===undefined){
            //File was not attached
            throw new Error("File is undefined");
        }

        let reader = new FileReader();

        reader.readAsText(file);

        reader.onload = function() {
            console.log(reader.result);
        };

        reader.onerror = function() {
            console.log(reader.error);
        };

        let json= reader.result as string;
        let obj = JSON.parse(json);
        console.log(obj);


    }


}