import "azure-devops-ui/Core/override.css";
import * as SDK from "azure-devops-extension-sdk";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Header, TitleSize} from "azure-devops-ui/Header";
import {IVssRestClientOptions} from "azure-devops-extension-api";
import {RestTokenProvider} from "../common/azure/AuthTokenProvider";
import {
    getStoredData,
    addMethods,
    deleteMethod,
    createMethodsFromDefinitions,
    readFileAsText
} from "../common/handlers/StorageHandlers";
import {ProcessImport} from "../components/ProcessImport";
import JsonInput from "../components/JsonInput/JsonInput";
import MethodList from "../components/MethodList/MethodList";
import MethodDefinition, {Method} from "../modules/MethodDefinition";
import "./essence-admin-hub.scss";
import {useEffect, useState} from "react";

function AdminHub() {
    const methodStorageKey: string = "essence";
    const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});
    const [methods, setMethods] = useState<Method[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        SDK.init({loaded: false})
            .then(() => {
                const host = SDK.getHost();
                console.log("Current host:", host);
                console.log("Root path:", window.location.ancestorOrigins[0]);
                const clientOptions: IVssRestClientOptions = {
                    rootPath: `${window.location.ancestorOrigins[0]}/${host.name}/`,
                    authTokenProvider: new RestTokenProvider()
                };
                setVssRestClientOptions(clientOptions);
                SDK.notifyLoadSucceeded();
            })
            .catch(err => {
                SDK.notifyLoadFailed(err);
            });

        // Load existing methods on mount
        (async () => {
            try {
                const storedData = await getStoredData(methodStorageKey);
                setMethods(storedData);
            } catch (error) {
                console.error("Error retrieving stored data:", error);
            }
        })();
    }, []);

    async function handleFileUpload(): Promise<void> {
        if (!selectedFile) {
            console.log("File is undefined");
            return;
        }

        try {
            const fileContent = await readFileAsText(selectedFile);
            const methodDefinitions = JSON.parse(fileContent) as MethodDefinition[];
            const newMethods = createMethodsFromDefinitions(methodDefinitions);

            const updatedMethods = await addMethods(methodStorageKey, newMethods);
            setMethods(updatedMethods);
            setSuccessMessage("Methods added successfully!");

            setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error("Error reading or processing file:", error);
        }
    }

    async function handleDeleteMethod(index: number): Promise<void> {
        try {
            const updatedMethods = await deleteMethod(methodStorageKey, index, methods);
            setMethods(updatedMethods);
        } catch (error) {
            console.error("Error deleting method:", error);
        }
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    }

    return (
        <div className="padding-horizontal-16 flex-grow">
            <Header
                title="Essence Organization"
                titleSize={TitleSize.Medium}
                className="margin-bottom-16"
            />
            <div className="margin-left-16">
                <div className="section-margin">
                    <ProcessImport vssRestClientOptions={vssRestClientOptions}/>
                </div>
                <div className="section-margin">
                    <JsonInput onFileChange={handleFileChange} onFileUpload={handleFileUpload}
                               successMessage={successMessage}/>
                </div>
            </div>
            <div className="section-margin">
                <MethodList methods={methods} onDeleteMethod={handleDeleteMethod}/>
            </div>
        </div>
    );
}

ReactDOM.render(<AdminHub/>, document.getElementById("root"));
