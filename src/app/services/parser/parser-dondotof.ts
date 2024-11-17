import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ChannelType, ChannelInfo } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";
import { registerNewActorByName, registerNewChannelByName } from "./lib-parser";

export const ParseDondotoF:ParserFunc = (content:string) => {
    const info:ReplayInfo = newReplayInfo();

    const body = RegMatchByIdx("htmlBody", content, 1);
    const sectionArr = RegMatchArr("ddfFotmat", body);
    
    const actorTable: Record<string, ActorInfo> = {};
    const channelTable: Record<string, ChannelInfo> = {};
    sectionArr.forEach((data:string) => {
        // Content Match
        let matchMap = [...data.matchAll(RegExpList.ddfFotmat)][0];
        let channel = autoTranslate(matchMap[2] || "");
        let color = matchMap[3];
        let actor = matchMap[4];
        let content = matchMap[5];

        // Handle ActorInfo
        let actorObj = registerNewActorByName(actorTable, actor, color, "");
        // Handle ChannelInfo
        let chObj = registerNewChannelByName(channelTable, channel, mainChannelName);
        // Handle ScriptEntry
        let scriptEntry:ScriptEntry = {
            type: "talk",
            channelId: chObj.id,
            actorId: actorObj.id,
            content: content.trim(),
        }
        info.script.push(scriptEntry);
    });

    // Add Actor
    Object.values(actorTable).forEach((actor) => {
        info.actors[actor.id] = (actor);
    });
    // Add Channel
    Object.values(channelTable).forEach((ch) => {
        info.channels[ch.id] = (ch);
    });

    return info;
};

const mainChannelName = ["主要", "主頻道", "メイン", "Main", "main"];
const chatChannelName = ["閒聊", "雑談", "other"];

function autoTranslate(chName: string): string {
    if(mainChannelName.includes(chName)) return "主要";
    if(chatChannelName.includes(chName)) return "閒聊";
    return chName;
}
