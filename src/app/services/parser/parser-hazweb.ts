import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ChannelType } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";


export const ParseHazWeb:ParserFunc = (content:string) => {
    const info:ReplayInfo = newReplayInfo();
    
    // Handle Actors
    const style = RegMatchByIdx("htmlStyle", content, 1);
    (style.match(RegExpList.hazv1_actorCss) || []).forEach((actorData) => {
        let matchMap = [...actorData.matchAll(RegExpList.hazv1_actorCss)][0];
        let id     = parseInt(matchMap[1]);
        let color  = "#"+(matchMap[2] || "888888").toUpperCase();
        let name   = (matchMap[3] || "");
        let imgUrl = (matchMap[4] || "");

        info.actors[id] = { id, name, color, imgUrl };
    });

    // Handle ScriptEntry
    const body  = RegMatchByIdx("htmlBody", content, 1);
    const sectionArr = RegMatchArr("hazV1Format", body);
    sectionArr.forEach((data:string) => {
        // Content Match
        let matchMap = [...data.matchAll(RegExpList.hazV1Format)][0];
        let type = matchMap[1];
        let innerData = matchMap[2];

        switch(type) {
            case "halt":
                info.script.push(genHaltEntry());
                break;
            case "sect_title":
                info.script.push(genTitleEntry(innerData));
                break;
            case "changeBg":
                info.script.push(genSetBgEntry(innerData));
                break;
            case "talk":
                info.script.push(genTalkEntry(innerData));
                break;
        }
    });

    return info;
};

function genHaltEntry(): ScriptEntry {
    return { type: "halt", content: "" };
}
function genTitleEntry(data:string): ScriptEntry {
    let titleText = (data.match(RegExpList.hazv1_getSectTitle)||[])[1];
    return { type: "title", content: titleText };
}
function genSetBgEntry(data:string): ScriptEntry {
    let imgUrl = (data.match(RegExpList.hazv1_getBgImage)||[])[1];
    return { type: "setBg", content: imgUrl };
}
function genTalkEntry(data:string): ScriptEntry {
    let matchMap;

    matchMap = [...data.matchAll(RegExpList.hazv1_getTalk)][0];
    let channel = matchMap[1];
    let actorId = matchMap[2];

    matchMap = [...data.matchAll(RegExpList.hazv1_getTalkContent)][0];
    let content = matchMap[1]

    return { 
        type: "talk",
        channel: (channel=="mainCh")? "main": "other",
        actorId: parseInt(actorId),
        content: content.trim()
    };
}
