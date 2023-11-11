

export class JsonInputTemplate{
    public methodDefinition?:MethodDefinition;
    public alphas!:[Alpha];
    public workProducts!:[WorkProduct];
}


class Alpha{

    public name!:string;
    // link ???
    public subAlphas?:[Alpha];
    public checkpoints!:[Checkpoint];
    public achievedState?:StateDefinition;
    public AlphaDefinition!:AlphaDefinition;
}
class Checkpoint{

    public checkpointDefinition!:CheckPointDefinition;
    public fulfilled:boolean=false;
    public degreeOfEvidence?:number; //Calculated on Checkpoint,StateDefinition,LevelOfDetailsDefinition
}

class CheckPointDefinition{

    public name!:string;
    public description?:string;
}

class StateDefinition{

    public name!:string;
    public description?:string;
    public order!:number;
    public checkpointDefinitions!:[CheckPointDefinition];
}

class AlphaDefinition{

    public name!:string;
    public description?:string;
    public subAlphaDefinition?:AlphaDefinition;
    public stateDefinitions!:[StateDefinition]
}


class MethodDefinition{
    public name!:string;
    public alphaDefinitions!:[AlphaDefinition];
    public workProductDefinitions!:[WorkProductDefinition]
}
class WorkProductDefinition{
    public name!:string;
    public description?:string;
    public levelOfDetailDefinitions!:[LevelOfDetailsDefinition];
}

class LevelOfDetailsDefinition{
    public name!:string;
    public description?:string;
    public order!:number;
    public checkpointDefinitions!:[CheckPointDefinition]
}

class WorkProduct{
    public name!:string;
    public link?:string;

    public workProductDefinition!:WorkProductDefinition;
    public achievedLevel?:LevelOfDetailsDefinition;
}
