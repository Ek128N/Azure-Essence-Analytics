// state и Alpha - отдельные WI, отображающиеся на борде
//Alpha- родитель для определённых state
//у state может быть только 1 родитель
//SubAlpha -alpha,родитель которой другая alpha
//У state  есть чекпоинты, каждый чекпоинт принадлежит лишь одному state


// Учитывать блокировку и иерархию.


import JsonInputTemplate, {Alpha} from "../../modules/JsonInputTemplate";
import {AzureFetch} from "../../modules/AzureFetch";
import {ProjectData} from "./JsonInput";
import {WorkItemRelation} from "azure-devops-extension-api/WorkItemTracking";

interface WIRequestBodyData {
    op?: string | null,
    path: string,
    from?: string | null,
    value: any
}

function clearWorkItems() {
    //clean alphas
}


export async function createWorkItems(dataCollection: [JsonInputTemplate], projectData: ProjectData) {

    const alphaName: string = "Essence Alpha";//Essence Alpha
    // get projId and vss

    //get info about organization and project to pass in request
    //get vssRestClientOptions


    //CreateAlphas
    async function createAlphas(alphas?: [Alpha]):Promise<[Alpha]|undefined> {

        if (alphas === undefined) return ;
        //Creating alphas:
        //in cycle:while number of created alphas increasing per cycling through all list of alphas
        //if WIid!=null->skip
        //If parentId!=null and alpha.WIid===null/undefined of alpha, where (alpha.id==parentId)-> skip
        //Create WI
        //If alpha.WIid!=null ->(alpha.id=parentId)->createWI with reference
        //If parentId==null -> create WI


        let alphasLeft = alphas.length;
        let prevAlpha = -1;
        console.log(alphasLeft)
        while (alphasLeft > 0 && prevAlpha !== alphasLeft) {// do while
            prevAlpha = alphasLeft

            for (let alpha of alphas) {
                console.log(alpha)

                if (alpha.WIId != null) {
                    continue;
                }
                if (alpha.parentAlphaId != null && alphas.find(a => a.id === alpha.parentAlphaId)?.WIId == null)// && alpha's WIId ==null -> skip
                {
                    continue;
                }


                let title = CreateRequestBodyWIObject({path: "/fields/System.Title", value: `${alpha.name}`})
                let description = CreateRequestBodyWIObject({
                    path: "/fields/System.Description",
                    value: `${alpha.description}`
                })
                let bodyRequest: WIRequestBodyData[] = [title, description];
                if (alpha.parentAlphaId != null) {
                    let parentAlpha = alphas.find(a => a.id === alpha.parentAlphaId);
                    let parentReferenceValue:WorkItemRelation={
                        attributes:{isLocked:false,comment:`${alpha.name} is a SubAlpha of Alpha ${parentAlpha?.name}`,name:'Parent'},
                        rel:'System.LinkTypes.Hierarchy-Reverse',
                        url:`${projectData.vssRestClientOptions.rootPath}${projectData.projectId}/_apis/wit/wokrItems/${parentAlpha?.WIId}`

                    };
                    let parentReference = CreateRequestBodyWIObject({
                        path: "/relations/System.LinkTypes.Hierarchy-Reverse",
                        value: parentReferenceValue //TODO:link to azure parent element "https://dev.azure.com/{organization}/{projectId}/_apis/wit/wokrItems/{WIid}}" ${projectData.vssRestClientOptions.rootPath}${projectData.projectId}/_apis/wit/wokrItems/
                    })
                    bodyRequest.push(parentReference)
                }

                console.log(bodyRequest);


                await AzureFetch({
                    path: `${projectData.projectId}/_apis/wit/workitems/$${alphaName}`,//  /{project}/_apis/wit/workitems/${type}?
                    vssRestClientOptions: projectData.vssRestClientOptions,
                    method: 'POST',
                    body: JSON.stringify(bodyRequest),
                    contentType: "application/json-patch+json"
                }).then(res => res.json()).then(json => {
                    console.log(json);
                    alpha.WIId = json.id;//TODO:check that response was OK and assign WIid,otherwise console.log problem info
                });

                alphasLeft--;


            }
        }
        return alphas;

    }

    for (let data of dataCollection) {//???
        data.alphas=await createAlphas(data.alphas);
        console.log("creation finished")
    }

    async function TestFunction() {
        let wiId = "58"

        await AzureFetch({
            path: `${projectData.projectId}/_apis/wit/workitems/${wiId}`,
            query: `$expand=all`,
            vssRestClientOptions: projectData.vssRestClientOptions,
            //contentType: "application/json-patch+json"
        }).then(res => res.json()).then(json => console.log(json));
    }


    //CreateStates
    //Create Checkpoints
    //Create Activities

}


function CreateRequestBodyWIObject(params: WIRequestBodyData): WIRequestBodyData {
    //default op:"add",from:null
    return {
        op: params.op ?? "add",
        path: params.path,
        from: params.from ?? null,
        value: params.value
    };
}