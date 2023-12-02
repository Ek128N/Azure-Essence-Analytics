import {JSX, useEffect} from "react";
import {Button} from "azure-devops-ui/Button";
import {ObservableValue} from "azure-devops-ui/Core/Observable";
import {FormItem} from "azure-devops-ui/FormItem";
import {TextField} from "azure-devops-ui/TextField";
import {Card} from "azure-devops-ui/Card";
import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import {CommonServiceIds, IExtensionDataService} from "azure-devops-extension-api";


export default function render(): JSX.Element {


    const thresholdObservable: ObservableValue<string> = new ObservableValue<string>(" ");
    const weakInfluenceDegreeObservable: ObservableValue<string> = new ObservableValue<string>(" ");
    const mediumInfluenceDegreeObservable: ObservableValue<string> = new ObservableValue<string>(" ");
    const strongInfluenceDegreeObservable: ObservableValue<string> = new ObservableValue<string>(" ")
    const apiKeyObservable: ObservableValue<string> = new ObservableValue<string>(" ");

    const configKey: string = "essence-config";


    let accessToken;
    let extDataService;
    let _dataManager;

    useEffect(() => {
        const fetchDataService = async () => {

            await getDataServices();


            _dataManager.getValue(configKey).then(function (data: ConfigData) {

                if (data === undefined) {
                    //setValue with default configData.
                    const defaultData = new ConfigData();

                    //assign data
                    setObservableData(defaultData);

                    SaveThresholdChanges();
                } else {
                    setObservableData(data);
                }

            })


        }

        fetchDataService();

    }, []);

    function setObservableData(data: ConfigData) {
        thresholdObservable.value = data.threshold;
        weakInfluenceDegreeObservable.value = data.weakInfluenceDegree;
        mediumInfluenceDegreeObservable.value = data.mediumInfluenceDegree;
        strongInfluenceDegreeObservable.value = data.strongInfluenceDegree;
        apiKeyObservable.value = data.apiKey;
    }

    async function getDataServices(): Promise<void> {
        accessToken = await SDK.getAccessToken();
        extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        _dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);
    }


    //TODO: create class for Observables;

    const SaveThresholdChanges = async () => {
        var data: ConfigData = new ConfigData(
            thresholdObservable.value,
            weakInfluenceDegreeObservable.value,
            mediumInfluenceDegreeObservable.value,
            strongInfluenceDegreeObservable.value,
            apiKeyObservable.value);


        if (!isInputValid(data)) {
            console.log("invalid input")
            return;
        }


        await getDataServices();

        _dataManager.setValue(configKey, data);

    };

    function isInputValid(data: ConfigData) {
        //0< threshold <1 ,
        //weak integer >0
        //Medium integer >0
        //Strong integer >0

        let threshold = Number(data.threshold);
        let weakInfluenceDegree = Number(data.weakInfluenceDegree);
        let mediumInfluenceDegree = Number(data.mediumInfluenceDegree);
        let strongInfluenceDegree = Number(data.strongInfluenceDegree);

        function validateDegree(degree: number): boolean {
            let valRes: boolean = (!Number.isInteger(degree) || isNaN(degree) || degree < 0)
            if (valRes) {
                console.log("invalid degree: " + degree)
            }
            return valRes;
        }

        function validateThreshold(thresholdValue: any): boolean {
            let valRes = isNaN(thresholdValue) || thresholdValue <= 0 || thresholdValue >= 1;
            if (valRes) {
                console.log("invalid threshold: " + thresholdValue)
            }
            return valRes;
        }


        //TODO:ApiKey - tryConnection

        return !(validateThreshold(threshold) ||
            validateDegree(weakInfluenceDegree) ||
            validateDegree(mediumInfluenceDegree) ||
            validateDegree(strongInfluenceDegree));

    }


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

class ConfigData {

    constructor(threshold: string = "0.5", weakInfluenceDegree: string = "1", mediumInfluenceDegree: string = "2", strongInfluenceDegree: string = "5", apiKey: string = "") {
        this.threshold = threshold;
        this.weakInfluenceDegree = weakInfluenceDegree;
        this.mediumInfluenceDegree = mediumInfluenceDegree;
        this.strongInfluenceDegree = strongInfluenceDegree;
        this.apiKey = apiKey;
    }


    public threshold!: string;
    public weakInfluenceDegree!: string;
    public mediumInfluenceDegree!: string;
    public strongInfluenceDegree!: string;
    public apiKey!: string;
}