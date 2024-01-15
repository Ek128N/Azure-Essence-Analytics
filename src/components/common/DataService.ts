import * as SDK from "azure-devops-extension-sdk";
import {CommonServiceIds, IExtensionDataManager, IExtensionDataService} from "azure-devops-extension-api";

export async function getDataServices(): Promise<IExtensionDataManager> {
    let accessToken = await SDK.getAccessToken();
    let extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
    return await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken)
}