import { Injectable } from '@angular/core';
import { ActorInfo, ChannelInfo, ReplayInfo, ScriptEntry } from '../interfaces/replay-info.interface';
import { templateBuilder as builder, BasicWebOptions } from './exporter-template/template';

const VERSION = "hazmole_v2.0";

@Injectable({
  providedIn: 'root'
})
export class ExporterService {

  constructor() { }

  GenerateFile(rpInfo: ReplayInfo): string {
    // Declare Param
    const options:BasicWebOptions = {
      version: VERSION,
      title:    rpInfo.config.title || "",
      subtitle: rpInfo.config.subtitle || "",
      description: "",
      styleVarArr: [],
      styleActorArr: [],
      channelArr: [],
      scriptList: []
    };

    this.appendStyleVars(options.styleVarArr, rpInfo);
    this.appendStyleActor(options.styleActorArr, rpInfo);
    this.appendChannelInfo(options.channelArr, rpInfo);
    this.appendScriptEntry(options.scriptList, rpInfo);

    return builder.genBasicWeb(options);
  }

  private appendStyleVars(ref:Array<string>, rpInfo:ReplayInfo) {
    ref.push(`--color-bg: ${rpInfo.config.colorTheme?.pageBgColor || "#454752"};`);
    ref.push(`--color-title: ${rpInfo.config.colorTheme?.pageTitleColor || "#FFFFFF"};`);
    ref.push(`--color-subtitle: #dddddd;`);
    ref.push(`--color-talk-bg: ${rpInfo.config.colorTheme?.scriptTalkBgColor || "#1E1E1E"};`);
    ref.push(`--color-talk-panel-bg: ${rpInfo.config.colorTheme?.scriptTalkPanelBgColor || "#2A2A2A"};`);
    ref.push(`--color-talk-panel-text: ${rpInfo.config.colorTheme?.scriptTalkPaneltextColor || "#EEEEEE"};`);
  }

  private appendStyleActor(ref:Array<string>, rpInfo:ReplayInfo) {
    const actorList = Object.values(rpInfo.actors);

    actorList.forEach(actor => {
      ref.push(builder.genActorStyle(actor));
    });
  }

  private appendChannelInfo(ref:Array<string>, rpInfo:ReplayInfo) {
    const channelList = Object.values(rpInfo.channels);

    channelList.forEach(channel => {
      ref.push(builder.genChannelInfo(channel));
    });
  }

  private appendScriptEntry(ref:Array<string>, rpInfo:ReplayInfo) {
    const actorMap = rpInfo.actors;
    const scriptList = rpInfo.script;
    const channelMap = rpInfo.channels;

    scriptList.forEach(entry => {
      let isHidden = false;
      if(entry.channelId != null && channelMap[entry.channelId].isHidden) {
        isHidden = true;
      }
      let innerElem = this.getScriptInnerElem(entry, actorMap, channelMap);
      ref.push(builder.genScriptEntryOuter(entry.type, innerElem, isHidden))
    });
  }

  private getScriptInnerElem(entry:ScriptEntry, actorMap:Record<string, ActorInfo>, channelMap:Record<string, ChannelInfo>): string {
    switch(entry.type){
      case "talk": 
        return builder.genScriptTalkElem(entry, actorMap[entry.actorId||0], channelMap[entry.channelId||0]);
      case "title": 
        return builder.genScriptTitleElem(entry);
      case "halt":
        return builder.genScriptHaltElem(entry);
      case "setBg":
        return builder.genScriptBgImageElem(entry);
    }
    return "";
  }

}
