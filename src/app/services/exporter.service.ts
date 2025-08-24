import { Injectable } from '@angular/core';
import { templateBuilder as builder, BasicWebOptions } from './exporter-template/template';
import { ReplayConfig } from '../classes/replay-config';
import { Actor } from '../classes/actor-collection';
import { LayoutConfig } from '../classes/layout-config';
import { Channel } from '../classes/channel-collection';
import { ScriptEntry } from '../classes/script-entry';
import { APP_VERSION } from '../version';

@Injectable({
  providedIn: 'root'
})
export class ExporterService {

  constructor() { }

  GenerateFile(rpCfg: ReplayConfig): string {
    // Declare Param
    const options:BasicWebOptions = {
      version: `hazmole_v${APP_VERSION}`,
      title:    rpCfg.layoutCfg.title || "",
      subtitle: rpCfg.layoutCfg.subtitle || "",
      description: "",
      styleVarArr: [],
      styleActorArr: [],
      channelArr: [],
      scriptList: []
    };

    this.appendStyleVars(options.styleVarArr, rpCfg.layoutCfg);
    this.appendStyleActor(options.styleActorArr, rpCfg.actorColle.GetList());
    this.appendChannelInfo(options.channelArr, rpCfg.channelColle.GetList());
    this.appendScriptEntry(options.scriptList, rpCfg);

    return builder.genBasicWeb(options);
  }

  private appendStyleVars(ref:Array<string>, layoutCfg:LayoutConfig) {
    ref.push(`--color-bg: ${layoutCfg.colorTheme?.background || "#454752"};`);
    ref.push(`--color-title: ${layoutCfg.colorTheme?.titleText || "#FFFFFF"};`);
    ref.push(`--color-subtitle: #dddddd;`);
    ref.push(`--color-talk-bg: #1E1E1E;`);
    ref.push(`--color-talk-panel-bg: #2A2A2A;`);
    ref.push(`--color-talk-panel-text: #EEEEEE;`);
  }

  private appendStyleActor(ref:Array<string>, actorList:Array<Actor>) {
    actorList.forEach(actor => {
      ref.push(...builder.genActorStyle(actor));
    });
  }

  private appendChannelInfo(ref:Array<string>, channelList:Array<Channel>) {
    channelList.forEach(channel => {
      ref.push(builder.genChannelInfo(channel));
    });
  }

  private appendScriptEntry(ref:Array<string>, rpCfg:ReplayConfig) {
    const scriptList = rpCfg.scriptArray;
    scriptList.forEach(entry => {
      let isHidden = false;
      if(entry.channelId != null) {
        const channelObj = rpCfg.channelColle.GetByID(entry.channelId);
        isHidden = channelObj.isHidden;
      }
      let innerElem = this.getScriptInnerElem(entry, rpCfg);
      ref.push(builder.genScriptEntryOuter(entry.type, innerElem, isHidden))
    });
  }

  private getScriptInnerElem(entry:ScriptEntry, rpCfg:ReplayConfig): string {
    switch(entry.type){
      case "chat": 
        const actor = rpCfg.actorColle.GetByID(entry.actorId || "");
        const channel = rpCfg.channelColle.GetByID(entry.channelId || "");
        return builder.genScriptTalkElem(entry, actor, channel);
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
