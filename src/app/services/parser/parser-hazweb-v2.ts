import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ChannelType, ColorTheme } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";


export const ParseHazWebV2:ParserFunc = (content:string) => {
    const info:ReplayInfo = newReplayInfo();
    
    // Handle Title
    const title = RegMatchByIdx("hazv1_getDocTitle", content, 1);
    info.config.title = title;

    // Handle ColorTheme
    const colorTheme:ColorTheme = {};
    colorTheme.pageBgColor = RegMatchByIdx("hazv2_getTheme_varBgColor", content, 1) || "#454752";
    colorTheme.pageTitleColor = RegMatchByIdx("hazv2_getTheme_varTitleColor", content, 1) || "#FFFFFF";
    colorTheme.scriptTalkBgColor = RegMatchByIdx("hazv2_getTheme_varTalkBgColor", content, 1) || "#1E1E1E";
    colorTheme.scriptTalkPanelBgColor = RegMatchByIdx("hazv2_getTheme_varTalkPanelBgColor", content, 1) || "#2A2A2A";
    colorTheme.scriptTalkPaneltextColor = RegMatchByIdx("hazv2_getTheme_varTalkPanelTextColor", content, 1) || "#EEEEEE";

    info.config.colorTheme = colorTheme;

    // Handle Actors
    const style = RegMatchByIdx("htmlStyle", content, 1);
    (style.match(RegExpList.hazv2_actorCss) || []).forEach((actorData) => {
        let matchMap = [...actorData.matchAll(RegExpList.hazv2_actorCss)][0];
        let id     = parseInt(matchMap[1]);
        let color  = (matchMap[2] || "#888888").toUpperCase();
        let name   = (matchMap[3] || "");
        let imgUrl = (matchMap[4] || "");

        info.actors[id] = { id, name, color, imgUrl };
    });

    // Handle ScriptEntry
    const body  = RegMatchByIdx("htmlBody", content, 1);
    const sectionArr = RegMatchArr("hazV2Format", body);
    sectionArr.forEach((data:string) => {
        // Content Match
        let matchMap = [...data.matchAll(RegExpList.hazV2Format)][0];
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
    let titleText = (data.match(RegExpList.hazv2_getSectTitle)||[])[1];
    return { type: "title", content: titleText };
}
function genSetBgEntry(data:string): ScriptEntry {
    let imgUrl = (data.match(RegExpList.hazv2_getBgImage)||[])[1];
    return { type: "setBg", content: imgUrl };
}
function genTalkEntry(data:string): ScriptEntry {
    let matchMap;

    matchMap = [...data.matchAll(RegExpList.hazv2_getTalk)][0];
    let actorId = matchMap[1];

    matchMap = [...data.matchAll(RegExpList.hazv2_getTalkChannel)][0];
    let channel = matchMap[1];

    matchMap = [...data.matchAll(RegExpList.hazv2_getTalkContent)][0];
    let content = matchMap[1];

    return { 
        type: "talk",
        channel: channel,
        actorId: parseInt(actorId),
        content: content.trim()
    };
}
