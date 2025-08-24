import { ScriptEntry } from "src/app/classes/script-entry";
import { RegexpService } from "../regexp.service";
import { ReplayConfig } from "src/app/classes/replay-config";
import { Actor } from "src/app/classes/actor-collection";
import { Channel } from "src/app/classes/channel-collection";

export class DondotofParser {

  static regexp = {
    chat: new RegExp(/(^\[(.*?)\])?<font color='(#[\w\d]{6})'><b>(.*?)<\/b>：(.*?)<\/font>/, 'smg')
  }

  static Parse(rawHTML: string): ReplayConfig {
    const replayConfig: ReplayConfig = new ReplayConfig();

    // fetch html body
    const rawBody = RegexpService.getByKey("htmlBody", rawHTML);
    const chatArr = RegexpService.getArr(this.regexp.chat, rawBody);

    // iterate html body
    chatArr.forEach((chatText:string) => {
      // Content Match
      const fields = RegexpService.getfields(this.regexp.chat, chatText, [null, "channel", "color", "name", "content"]);

      // Handle Actor
      const actor: Actor = replayConfig.actorColle.Add("", {
        id: "",
        name: fields['name'],
        color: fields['color'],
        imgUrl: "",
      });

      // Handle ChannelInfo
      const channel: Channel = replayConfig.channelColle.Add("", {
        id: "",
        name: this.translateChName(fields['channel'] || "主要"),
        isMain: this.isMainChannel(fields['channel'] || "主要"),
        isHidden: false,
      });

      // Handle ScriptEntry
      let scriptEntry:ScriptEntry = {
        type: "chat",
        channelId: channel.id,
        actorId: actor.id,
        content: fields['content'].trim(),
      }
      replayConfig.scriptArray.push(scriptEntry);
    });

    return replayConfig;
  }

  static mainChannelName = ["主要", "主頻道", "メイン", "Main", "main"];
  static chatChannelName = ["閒聊", "雑談", "other"];

  static translateChName(chName: string): string {
    if(this.mainChannelName.includes(chName)) return "主要";
    if(this.chatChannelName.includes(chName)) return "閒聊";
    return chName;
  }
  static isMainChannel(chName: string): boolean {
    return this.mainChannelName.includes(chName);
  }

}