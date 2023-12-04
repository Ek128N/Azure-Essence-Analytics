export default class JsonInputTemplate {
    public activities?: [Activity];
    public alphaContainments?: [AlphaContainment];
    public alphaCriterions?: [AlphaCriterion];
    public alphas?: [Alpha];
    public checkpoints?: [Checkpoint];
    public degreesOfEvidence?: [DegreeOfEvidence];
    public levelOfDetails?: [LevelOfDetail];
    public workProductCriterions?: [WorkProductCriterion];
    public states?: [State];
    public workProductManifests?: [WorkProductManifest];
    public workProducts?: [WorkProduct];
}


interface WorkItemId{
     WIId?:string|null;
}
class Activity implements WorkItemId{
    public WIId?:string|null;
    public name!: string;
    public description!: string;
    public id!: string;
}

class AlphaContainment {
    public upperBound?: number;
    public lowerBound?: number;
    public supAlphaId?: string;
    public subAlphaId?: string;
    public normalValue?: number;
}

class AlphaCriterion implements WorkItemId {
    public WIId?:string|null;
    public criterionTypeEnumValue?: number
    public partial?: boolean;
    public minimal?: number;
    public id?: string;
    public stateId?: string;
    public activityId?: string;
}

export class Alpha implements WorkItemId {
    public WIId?:string|null;
    public parentAlphaId?: string;
    public name?: string;
    public description?: string;
    public id!: string;
}

class Checkpoint implements WorkItemId {
    public WIId?:string|null;
    public name?: string;
    public description?: string;
    public order?: number;
    public id?: string;
    public specialId?: string;
    public degreeOfEvidenceEnumValueManagerOpinion?: number;
    public detailId?: string;
}

class DegreeOfEvidence implements WorkItemId {
    public WIId?:string|null;
    public id?: string;
    public iCheckableId?: string;
    public typeOfEvidence?: boolean;
    public checkpointId?: string;
    public degreeOfEvidenceEnumValue?: number;
}

class LevelOfDetail implements WorkItemId {
    public WIId?:string|null;
    public id?: string;
    public specialId?: string;
    public name?: string;
    public description?: string;
    public workProductId?: string;
    public order?: number;
}

class WorkProductCriterion implements WorkItemId {
    public WIId?:string|null;
    public criterionTypeEnumValue?: number;
    public partial?: boolean;
    public minimal?: number;
    public id?: string;
    public levelOfDetailId?: string;
    public activityId?: string;
}

class State implements WorkItemId {
    public WIId?:string|null;
    public id?: string;
    public specialId?: string;
    public name?: string;
    public description?: string;
    public alphaId?: string;
    public order?: number;

}

class WorkProductManifest {
    public upperBound?: number;
    public lowerBound?: number;
    public alphaId?: string;
    public workProductId?: string;
    public normalValue?: number;
}

class WorkProduct implements WorkItemId {
    public WIId?:string|null;
    public name?: string;
    public description?: string;
    public id?: string;
}
