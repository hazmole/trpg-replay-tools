import { RegExpList, RegMatchArr, RegMatchByIdx } from "./regular-expression"
import { ReplayInfo, ActorInfo, ScriptEntry, ColorTheme, ChannelInfo } from "src/app/interfaces/replay-info.interface";
import { ParserFunc, newReplayInfo } from "src/app/interfaces/replay-info.interface";
import { registerNewChannelByName } from "./lib-parser";


export const ParseHazWebV2:ParserFunc = (html:string) => {
    const info:ReplayInfo = newReplayInfo();

    const body   = RegMatchByIdx("htmlBody",   html, 1);
    const header = RegMatchByIdx("htmlHeader", html, 1);
    
    // Handle Title
    const title = RegMatchByIdx("hazv1_getDocTitle", header, 1);
    info.config.title = title;

    // Handle ColorTheme
    const colorTheme:ColorTheme = {};
    colorTheme.pageBgColor = RegMatchByIdx("hazv2_getTheme_varBgColor", header, 1) || "#454752";
    colorTheme.pageTitleColor = RegMatchByIdx("hazv2_getTheme_varTitleColor", header, 1) || "#FFFFFF";
    colorTheme.scriptTalkBgColor = RegMatchByIdx("hazv2_getTheme_varTalkBgColor", header, 1) || "#1E1E1E";
    colorTheme.scriptTalkPanelBgColor = RegMatchByIdx("hazv2_getTheme_varTalkPanelBgColor", header, 1) || "#2A2A2A";
    colorTheme.scriptTalkPaneltextColor = RegMatchByIdx("hazv2_getTheme_varTalkPanelTextColor", header, 1) || "#EEEEEE";

    info.config.colorTheme = colorTheme;

    // Handle Actors
    const style = RegMatchByIdx("htmlStyle", header, 1);
    (style.match(RegExpList.hazv2_actorCss) || []).forEach((actorData) => {
        let matchMap = [...actorData.matchAll(RegExpList.hazv2_actorCss)][0];
        let id     = parseInt(matchMap[1]);
        let color  = (matchMap[2] || "#888888").toUpperCase();
        let name   = (matchMap[3] || "");
        let imgUrl = (matchMap[4] || "");

        let actorObj = { id, name, color, imgUrl };
        info.actors[id] = actorObj;
    });

    // Handle Channels
    const channelNameTable: Record<string, ChannelInfo> = {};
    (header.match(RegExpList.hazv2_chInfo) || []).forEach((chData) => {
        let matchMap = [...chData.matchAll(RegExpList.hazv2_chInfo)][0];
        let id = parseInt(matchMap[1]);
        let name = matchMap[2];
        let isMain = (matchMap[3] === "true");
        let isHidden = (matchMap[4] === "true");
        
        let chObj = { id, name, isMain, isHidden };
        info.channels[id] = chObj;
        channelNameTable[name] = chObj;
    });
    const hasChannelInfo: boolean = Object.keys(channelNameTable).length > 0;

    // Handle ScriptEntry
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
                let getChFunc = null;
                if(hasChannelInfo) getChFunc = findChannelByID.bind(this, innerData, info.channels);
                else               getChFunc = findChannelByName.bind(this, innerData, channelNameTable);
                info.script.push(genTalkEntry(innerData, getChFunc))
                break;
        }
    });

    // Append Channel (if needed)
    if(!hasChannelInfo) {
        Object.values(channelNameTable).forEach((ch) => {
            info.channels[ch.id] = (ch);
        });
    }

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

function genTalkEntry(data:string, getChannelObjFunc:Function): ScriptEntry {
    let matchMap;

    matchMap = [...data.matchAll(RegExpList.hazv2_getTalk)][0];
    let actorId = matchMap[1];

    let chObj = getChannelObjFunc();

    matchMap = [...data.matchAll(RegExpList.hazv2_getTalkContent)][0];
    let content = matchMap[1];

    return { 
        type: "talk",
        channelId: chObj.id,
        actorId: parseInt(actorId),
        content: content.trim()
    };
}

function findChannelByID(data:string, chList:Record<number, ChannelInfo>): ChannelInfo {
    let matchMap = [...data.matchAll(RegExpList.hazv2_getTalkChannelID)][0];
    let chID = parseInt(matchMap[1]);
    return chList[chID];
}
function findChannelByName(data:string, chNameTable:Record<string, ChannelInfo>): ChannelInfo {
    let matchMap = [...data.matchAll(RegExpList.hazv2_getTalkChannel)][0];
    let chName = (matchMap[1]);
    return registerNewChannelByName(chNameTable, chName, ["main"]);
}
