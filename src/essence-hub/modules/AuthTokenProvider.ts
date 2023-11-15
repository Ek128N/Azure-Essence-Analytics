import { IAuthorizationTokenProvider } from "azure-devops-extension-api"
import { getAccessToken } from "azure-devops-extension-sdk";

export class RestTokenProvider implements IAuthorizationTokenProvider {
    getAuthorizationHeader(forceRefresh?: boolean | undefined): Promise<string> {
        return getAccessToken().then(val => val = `Bearer ${val}`);
    }
}