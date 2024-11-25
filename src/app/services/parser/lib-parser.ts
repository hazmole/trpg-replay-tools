import { ActorInfo, ChannelInfo } from "src/app/interfaces/replay-info.interface";

export const registerNewChannelByName = (table: Record<string, ChannelInfo>, chName:string, mainChNameArr:Array<string>):ChannelInfo => {
    if(table[chName] == null) {
        const newChannel:ChannelInfo = {
            id: Object.keys(table).length,
            name: chName,
            isMain: mainChNameArr.some((ch) => (ch == chName)),
            isHidden: false,
        };
        table[chName] = newChannel;
    } 
    return table[chName];
}


export const registerNewActorByName = (table: Record<string, ActorInfo>, actorName:string, color:string, imgUrl:string): ActorInfo => {
    if(table[actorName] == null) {
        const newActor:ActorInfo = {
            id: Object.keys(table).length,
            name: actorName,
            color: color.toUpperCase(),
            imgUrl: imgUrl,
        };
        table[actorName] = newActor;
    } 
    return table[actorName];
}

export const mergeActorTable = (originTable: Record<number, ActorInfo>, inheritTable: Record<number, ActorInfo>): Record<number, ActorInfo> => {
    const mergedTable = Object.assign({}, originTable);
    
    const originList = Object.values(originTable);
    let maxActorID = originList.map(actor => actor.id).sort().pop() || 0;
    
    Object.values(inheritTable).forEach((inheritActor) => {
        let oldActor = originList.find((originActor) => originActor.name == inheritActor.name);
        if(oldActor != undefined) {
            // Inherit Actor settings
            mergedTable[oldActor.id].color  = inheritActor.color;
            mergedTable[oldActor.id].imgUrl = inheritActor.imgUrl;
        } else {
            // Append New Actor
            mergedTable[maxActorID+1] = inheritActor;
            mergedTable[maxActorID+1].id = (maxActorID+1);
            maxActorID++;
        }
    });

    return mergedTable;
}