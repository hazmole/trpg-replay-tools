import { ReplayConfig } from "src/app/classes/replay-config";
import { RegexpService } from "../regexp.service";
import { CssParser } from "./internal/css-parser";
import { ScriptEntry } from "src/app/classes/script-entry";
import { Channel } from "src/app/classes/channel-collection";


export class HazWebParser {

  static regexp = {
    cssActorSelector: new RegExp(/\._actor_(\d+) ._actorName/, 's'),
    scriptBlock: new RegExp(/<div class="_script" data-type="(\w+)">(.*?)<\/div><!--EOS-->/, 'smg'),
    scriptTitleText: new RegExp(/<div class="_sectTitle">(.*?)<\/div>/, 's'),
    scriptBgImgUrl: new RegExp(/<div class="_hidden">(.*?)<\/div>/, 's'),
    scriptChatInfo: new RegExp(/<div class="_talk (.*?) _actor_(\d+)">/, 'sg'),
    scriptChatContent: new RegExp(/<div class="_actorWords">(.*?)<\/div>/, 'sm'),
  }

  static Parse(rawHTML: string): ReplayConfig {
    const replayConfig: ReplayConfig = new ReplayConfig();

    // fetch html head/body
    const rawHead = RegexpService.getByKey("htmlHead", rawHTML);
    const rawBody = RegexpService.getByKey("htmlBody", rawHTML);
    const rawStyle = RegexpService.getByKey("htmlStyle", rawHead);
    // ready CSS parser
    const cssParser = new CssParser(rawStyle);
    const styleMap = cssParser.getMap();

    // ==================
    // Handle DocTitle
    const docTitle = RegexpService.getByKey("htmlTitle", rawHead);
    replayConfig.layoutCfg.title = docTitle;

    // Handle Actor
    (Object.keys(styleMap) as Array<string>)
      .filter(selector => RegexpService.isMatch(this.regexp.cssActorSelector, selector))
      .forEach(selector => {
        const NID = RegexpService.get(this.regexp.cssActorSelector, selector);
        //  ._actor_(\d+) ._actorName { color: #000000; }
        //  ._actor_(\d+) ._actorName::after { content:"example"; }
        //  ._actor_(\d+) ._actorImg { background-image:url("example"); }/
        const color  = styleMap[`._actor_${NID} ._actorName`].getValue("color", "#888888");
        const name   = styleMap[`._actor_${NID} ._actorName::after`].getValue("content", "");
        const imgVal = styleMap[`._actor_${NID} ._actorImg`].getValue("background-image", "url()");
        
        replayConfig.actorColle.Add(`${NID}`, {
          id: `${NID}`,
          name: this.removeQuote(name),
          color,
          imgUrl: RegexpService.getByKey("cssUrl", imgVal)
        });
      });
    
    // Handle Script & Channels
    const scriptBlockArr = RegexpService.getArr(this.regexp.scriptBlock, rawBody);
    scriptBlockArr.forEach((blockText) => {
      const fields = RegexpService.getfields(this.regexp.scriptBlock, blockText, ["type", "innerData"]);
      switch (fields["type"]) {
        case "halt":
          replayConfig.scriptArray.push(this.genHaltEntry());
          break;
        case "sect_title":
          replayConfig.scriptArray.push(this.genTitleEntry(fields["innerData"]));
          break;
        case "changeBg":
          replayConfig.scriptArray.push(this.genBackgroundEntry(fields["innerData"]));
          break;
        case "talk":
          const channel = replayConfig.channelColle.Add("", this.genChannel(fields["innerData"]));
          replayConfig.scriptArray.push(this.genChatEntry(channel.id, fields["innerData"]));
          break;
      }

    });


    return replayConfig;
  }


  static genHaltEntry(): ScriptEntry {
    return {
      type: "halt",
      content: "",
    };
  }
  static genTitleEntry(innerData: string): ScriptEntry {
    const titleText = RegexpService.get(this.regexp.scriptTitleText, innerData);
    return {
      type: "title",
      content: titleText,
    };
  }
  static genBackgroundEntry(innerData: string): ScriptEntry {
    const imageUrl = RegexpService.get(this.regexp.scriptBgImgUrl, innerData);
    return {
      type: "setBg",
      content: imageUrl,
    };
  }
  static genChatEntry(chID: string, innerData: string): ScriptEntry {
    const fields = RegexpService.getfields(this.regexp.scriptChatInfo, innerData, [null, "actorID"]);
    const content = RegexpService.get(this.regexp.scriptChatContent, innerData);
    return {
      type: "chat",
      channelId: chID,
      actorId: fields["actorID"],
      content: content,
    };
  }

  static genChannel(innerData: string): Channel {
    const fields = RegexpService.getfields(this.regexp.scriptChatInfo, innerData, ["channelTag", null]);
    const channelTag = fields["channelTag"];
    return {
      id: "",
      name: (channelTag === "mainCh")? "主要": "場外",
      isMain: (channelTag === "mainCh"),
      isHidden: false,
    };
  }

  static removeQuote(text: string): string {
    return RegexpService.get(new RegExp(/^"?(.*?)"?$/, 's'), text);
  }
}