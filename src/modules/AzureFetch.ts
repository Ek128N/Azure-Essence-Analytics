import { IVssRestClientOptions } from "azure-devops-extension-api/Common/Context"

interface IAzureFetchParams {
  path: string,
  vssRestClientOptions: IVssRestClientOptions,
  method?: string,
  body?: any,
  accept?: string,
  apiVersion?: string,
  contentType?: string,
  query?: string
}

export async function AzureFetch(params: IAzureFetchParams) {
    return fetch(`${params.vssRestClientOptions.rootPath}${params.path}?api-version=${params.apiVersion ?? "7.1-preview.2"}${params.query ? "&" + params.query : ""}`, {
        method: params.method ?? "GET",
        headers: {
            ...(params.body === undefined ? {} : { "Content-Type": params.contentType ?? "application/json" }),
            "Accept": params.accept ?? "application/json;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
            "Authorization": await params.vssRestClientOptions.authTokenProvider!.getAuthorizationHeader()
        },
        body: params.body
    })
}