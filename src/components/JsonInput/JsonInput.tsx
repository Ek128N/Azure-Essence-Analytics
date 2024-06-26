import * as React from "react";
import { Button } from "azure-devops-ui/Button";

interface JsonInputProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFileUpload: () => Promise<void>;
    successMessage: string | null;
}

export default function JsonInput({ onFileChange, onFileUpload, successMessage }: JsonInputProps): React.ReactElement {
    return (
        <div>
            <input type="file" id="jsonInput" onChange={onFileChange} accept=".json" className={"margin-right-16"} />
            <Button text="Add Methods" onClick={onFileUpload} />
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
}
