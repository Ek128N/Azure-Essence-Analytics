import {JSX} from "react";
import {Button} from "azure-devops-ui/Button";
import {ObservableValue} from "azure-devops-ui/Core/Observable";
import {FormItem} from "azure-devops-ui/FormItem";
import {TextField, TextFieldWidth} from "azure-devops-ui/TextField";
import {Card} from "azure-devops-ui/Card";
import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";






export default function render(): JSX.Element {

    //TODO: get value from storage before loading
    const thresholdObservable = new ObservableValue<string>("0.5");
    const weakInfluenceDegreeObservable = new ObservableValue<string>("1");
    const mediumInfluenceDegreeObservable = new ObservableValue<string>("2");
    const strongInfluenceDegreeObservable = new ObservableValue<string>("5");
    const apiKeyObservable = new ObservableValue<string>("12351235135");


    //TODO: OnLoad  -доставать элементы из хранилища и применять как текст соответствующего поля.
    const SaveThresholdChanges = async () => {

        console.log(thresholdObservable.value)
        console.log(weakInfluenceDegreeObservable.value)
        console.log(mediumInfluenceDegreeObservable.value)
        console.log(strongInfluenceDegreeObservable.value)

        //SDK.register(SDK.getContributionId(),thresholdObservable.value);
        let contrId="HITS.azure-essence-analytics.essence-hub";
        let service = SDK.getService(contrId);
        console.log(service);
        console.log(SDK.getContributionId());
        //     .then(function (dataService:any) {
        //
        //     var EssenceConfigs={
        //         threshold:thresholdObservable.value,
        //         weakInfluence:weakInfluenceDegreeObservable.value,
        //         mediumInfluence:mediumInfluenceDegreeObservable.value,
        //         strongInfluence:strongInfluenceDegreeObservable.value,
        //         apiKey:apiKeyObservable.value
        //     };
        //     const collection="EssenceCollection";
        //     dataService.setDocument(collection,EssenceConfigs).then(function (doc:any){
        //         console.log("Doc id: " + doc.id);
        //     });
        // })


    };
    return (

        <div>
            <Card>
                <div className="flex-column">
                    <h2> Configuration</h2>
                    <div className=" flex-row">
                        <FormItem
                            label="Threshold"
                            message="The threshold value must be between 0 and 1"
                        >
                            <TextField
                                value={thresholdObservable as unknown as string}
                                onChange={(e, newValue) => (thresholdObservable.value = newValue)}/>
                        </FormItem>
                    </div>
                    <div>
                        <h4>Degree of influence</h4>
                        <FormItem
                            label="Weak"
                        >
                            <TextField
                                value={weakInfluenceDegreeObservable as unknown as string}
                                onChange={(e, newValue) => (weakInfluenceDegreeObservable.value = newValue)}/>
                        </FormItem>
                        <FormItem
                            label="Medium"
                        >
                            <TextField
                                value={mediumInfluenceDegreeObservable as unknown as string}
                                onChange={(e, newValue) => (mediumInfluenceDegreeObservable.value = newValue)}/>
                        </FormItem>
                        <FormItem
                            label="Strong"
                        >
                            <TextField
                                value={strongInfluenceDegreeObservable as unknown as string}
                                onChange={(e, newValue) => (strongInfluenceDegreeObservable.value = newValue)}/>
                        </FormItem>
                    </div>
                    <div>
                        <h4>API settings</h4>
                        <FormItem
                            label="KEY"
                        >
                            <TextField
                                value={apiKeyObservable as unknown as string}
                                onChange={(e, newValue) => (apiKeyObservable.value = newValue)}/>
                        </FormItem>
                    </div>


                    <Button
                        text={"Save"}
                        onClick={SaveThresholdChanges}/>
                </div>

            </Card>
        </div>

    );

}
