import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context"

interface IAzureFetchParams {
  path: string,
  vssRestClientOptions: IVssRestClientOptions,
  method?: string,
  body?: string,
  accept?: string,
  apiVersion?: string
}

export async function AzureFetch(params: IAzureFetchParams) {
    return fetch(`${params.vssRestClientOptions.rootPath}${params.path}?api-version=${params.apiVersion ?? "7.1-preview.2"}`, {
        method: params.method ?? "GET",
        headers: {
            ...(params.body === undefined ? {} : { "Content-Type": "application/json" }),
            "Accept": params.accept ?? "application/json;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
            "Authorization": await params.vssRestClientOptions.authTokenProvider!.getAuthorizationHeader()
        },
        body: params.body
    })
}