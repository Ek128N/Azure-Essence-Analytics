import {IAuthorizationTokenProvider} from "azure-devops-extension-api"
import {getAccessToken} from "azure-devops-extension-sdk";

export class RestTokenProvider implements IAuthorizationTokenProvider {
    async getAuthorizationHeader(forceRefresh?: boolean | undefined): Promise<string> {
        let val = await getAccessToken();
        return `Bearer ${val}`;
    }
}