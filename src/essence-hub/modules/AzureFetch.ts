import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context"

export async function AzureFetch(path: string, method: string, vssRestClientOptions: IVssRestClientOptions, body?: string) {
    return fetch(`${vssRestClientOptions.rootPath}_apis/${path}`, {
        method: method,
        headers: {
            ...(body === undefined ? {} : { "Content-Type": "application/json" }),
            "Accept": "application/json;api-version=7.2-preview.2;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
            "Authorization": await vssRestClientOptions.authTokenProvider!.getAuthorizationHeader()
        },
        body: body
    })
}