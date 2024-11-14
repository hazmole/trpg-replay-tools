import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ChannelType } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";
import { registerNewActorByName } from "./lib-parser";

export const ParseCCFolia:ParserFunc = (content:string) => {
    const info:ReplayInfo = newReplayInfo();

    const body = RegMatchByIdx("htmlBody", content, 1);
    const sectionArr = RegMatchArr("ccfFotmat", body);
    
    const actorTable: Record<string, ActorInfo> = {};
    sectionArr.forEach((data:string) => {
        // Content Match
        let matchMap = [...data.matchAll(RegExpList.ccfFotmat)][0];
        let color = matchMap[1];
        let channel = matchMap[2];
        let actor = matchMap[3];
        let content = matchMap[4];

        // Handle ActorInfo
        let actorObj = registerNewActorByName(actorTable, actor, color, "");
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
        case "主頻道":
        case "メイン":
        case "main":
            return "main";
        case "情報":
        case "info":
            return "情報";
        case "閒聊":
        case "雑談":
        case "other":
            return "閒聊";
        default:
            return channel;
    }
}
