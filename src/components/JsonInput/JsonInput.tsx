import * as React from "react";
import {JSX, useState} from "react";
import {Button} from "azure-devops-ui/Button";
import MethodDefinition from "../../modules/MethodDefinition";
import {
    readFileAsText,
    createMethodsFromDefinitions,
    getStoredData
} from "../../common/handlers/AzureStorageHandlers";
import {getDataServices} from "../../common/azure/DataService";
export default function RenderComponent(): JSX.Element {
    const methodStorageKey: string = "essence";
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    console.log("JsonInput");

    async function handleFileUpload(): Promise<void> {
        if (!selectedFile) {
            console.log("File is undefined");
            return;
        }

        try {
            const fileContent = await readFileAsText(selectedFile);
            const methodDefinitions = JSON.parse(fileContent) as MethodDefinition[];
            const methods = createMethodsFromDefinitions(methodDefinitions);

            const dataManager = await getDataServices();
            await dataManager.setValue(methodStorageKey, methods);

        } catch (error) {
            console.error("Error reading or processing file:", error);
        }
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
    }

    React.useEffect(() => {
        (async () => {
            try {
                const storedData = await getStoredData(methodStorageKey);
                console.log(storedData);
            } catch (error) {
                console.error("Error retrieving stored data:", error);
            }
        })();
    }, []);

    //TODO: add ui checkmark, that saving was successful
    return (
        <div>
            <input type="file" id="jsonInput" onChange={handleFileChange} accept=".json"/>
            <Button
                text="Save Methods"
                onClick={handleFileUpload}
            />
        </div>
    );
}
