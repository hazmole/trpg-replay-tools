import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ChannelType } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";


export const ParseDondotoF:ParserFunc = (content:string) => {
    const info:ReplayInfo = newReplayInfo();

    const body = RegMatchByIdx("htmlBody", content, 1);
    const sectionArr = RegMatchArr("ddfFotmat", body);
    
    const actorTable: Record<string, ActorInfo> = {};
    sectionArr.forEach((data:string) => {
        // Content Match
        let matchMap = [...data.matchAll(RegExpList.ddfFotmat)][0];
        let channel = (matchMap[2] || "");
        let color = matchMap[3];
        let actor = matchMap[4];
        let content = matchMap[5];

        // Handle ActorInfo
        let actorObj = registerActorByName(actorTable, actor, color);
        // Handle ScriptEntry
        let scriptEntry:ScriptEntry = {
            type: "talk",
            channel: parseChannel(channel),
            actorId: actorObj.id,
            content: content.trim(),
        }
        info.script.push(scriptEntry);
    });

    // Add Actor
    Object.values(actorTable).forEach((actor) => {
        info.actors[actor.id] = (actor);
    });

    return info;
};

function parseChannel(channel:string): ChannelType {
    switch(channel.toLowerCase()) {
        case "主要":
        case "メイン":
        case "main":
        case "":
            return "main";
        default:
            return channel;
    }
}

function registerActorByName(table: Record<string, ActorInfo>, actorName:string, color:string): ActorInfo {
    if(table[actorName] == null) {
        const newActor = {
            id: Object.keys(table).length,
            name: actorName,
            color: "#"+color.toUpperCase(),
            imgUrl: "",
        };
        table[actorName] = newActor;
    } 
    return table[actorName];
}