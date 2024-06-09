import "azure-devops-ui/Core/override.css";
import "./essence-admin-hub.scss";

import * as SDK from "azure-devops-extension-sdk";
import * as React from "react";
import { useEffect, useState } from "react";
import * as ReactDOM from "react-dom";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IVssRestClientOptions } from "azure-devops-extension-api";
import { RestTokenProvider } from "../common/azure/AuthTokenProvider";
import { ProcessImport } from "../components/ProcessImport";
import JsonInput from "../components/JsonInput/JsonInput";
import MethodList from "../components/MethodList/MethodList";


// Main component
function AdminHub() {
    const [vssRestClientOptions, setVssRestClientOptions] = useState<IVssRestClientOptions>({});


    useEffect(() => {
        SDK.init({ loaded: false })
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
    }, []);



    return (

            <div className="padding-horizontal-16 flex-grow">
                <div>
                    <Header
                        title="Essence Organization"
                        titleSize={TitleSize.Medium}
                        className="margin-bottom-16"
                    />
                    <ProcessImport vssRestClientOptions={vssRestClientOptions} />
                    <JsonInput/>
                </div>
                <MethodList />
            </div>

    );
}

ReactDOM.render(<AdminHub />, document.getElementById("root"));
