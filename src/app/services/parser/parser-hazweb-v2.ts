import { ReplayConfig } from "src/app/classes/replay-config";
import { RegexpService } from "../regexp.service";
import { CssParser } from "./internal/css-parser";
import { ScriptEntry } from "src/app/classes/script-entry";
import { Channel } from "src/app/classes/channel-collection";

export class HazWebV2Parser {

  static regexp = {
    cssActorSelector: new RegExp(/\._actor_(\d+) ._name/, 's'),
    channelInfo: new RegExp(/_ch_(\d+): \{ name:"(.*?)"; main:(true|false); hide:(true|false); \}/, 'sg'),
    scriptBlock: new RegExp(/<div class="_script-outer.*?" data-type="(\w+)">(.*?)<\/div><!--EOS-->/, 'smg'),
    scriptTitleText: new RegExp(/<div class="_sctitle">(.*?)<\/div>/, 's'),
    scriptBgImgUrl: new RegExp(/<img src="(.*?)">/, 's'),
    scriptChatActor: new RegExp(/<div class="_talk _actor_(\d+) .*?">/, 's'),
    scriptChatContent: new RegExp(/<div class="_content">(.*?)<\/div>/, 'sm'),
    scriptChatChannelID: new RegExp(/<channel class="_hidden">(\d+)<\/channel>/, 's'),
    scriptChatChannelName: new RegExp(/<div class="_channel">\[(.*?)\]<\/div>/, 's'),
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

    // Handle ColorTheme
    /*
      const colorTheme:ColorTheme = {};
      const rootStyle = cssParser.getRule(":root");
      colorTheme.pageBgColor = rootStyle.getValue("--color-bg", "#454752");
      colorTheme.pageTitleColor = rootStyle.getValue("--color-title", "#FFFFFF");
      colorTheme.scriptTalkBgColor = rootStyle.getValue("--color-talk-bg", "#1E1E1E");
      colorTheme.scriptTalkPanelBgColor = rootStyle.getValue("--color-talk-panel-bg", "#2A2A2A");
      colorTheme.scriptTalkPaneltextColor = rootStyle.getValue("--color-talk-panel-text", "#EEEEEE");
      info.config.colorTheme = colorTheme;
    */

    // Handle Actor
    (Object.keys(styleMap) as Array<string>)
      .filter(selector => RegexpService.isMatch(this.regexp.cssActorSelector, selector))
      .forEach(selector => {
        const NID = RegexpService.get(this.regexp.cssActorSelector, selector);
        //  ._actor_(\d+) ._name { color:#000000; content:'example'; }
        //  ._actor_(\d+) ._img { background-image:url('example'); display:block; }
        const infoStyle = styleMap[`._actor_${NID} ._name`];
        const color = infoStyle.getValue("color", "#888888");
        const name  = infoStyle.getValue("content", "");
        const imgVal  = styleMap[`._actor_${NID} ._img`].getValue("background-image", "url()");
        
        replayConfig.actorColle.Add(`${NID}`, {
          id: `${NID}`,
          name: this.removeQuote(name),
          color,
          imgUrl: this.removeQuote(RegexpService.getByKey("cssUrl", imgVal)),
        });
      });

    // Handle Channel
    const channelList = RegexpService.getArr(this.regexp.channelInfo, rawHead);
    channelList.forEach((chText) => {
      const fields = RegexpService.getfields(this.regexp.channelInfo, chText, ["ID", "name", "isMain", "isHidden"]);
      replayConfig.channelColle.Add(fields["ID"], {
        id: fields["ID"],
        name: fields["name"],
        isMain: (fields["isMain"] === "true"),
        isHidden: (fields["isHidden"] === "true"),
      });
    });
    const hasChannelInfo = (channelList.length > 0);

    // Handle Script
    const scriptBlockArr = RegexpService.getArr(this.regexp.scriptBlock, rawBody);
    scriptBlockArr.forEach((blockText) => {
      const fields = RegexpService.getfields(this.regexp.scriptBlock, blockText, ["type", "innerData"]);
      switch (fields["type"]) {
        case "halt":
          replayConfig.scriptArray.push(this.genHaltEntry());
          break;
        case "title":
          replayConfig.scriptArray.push(this.genTitleEntry(fields["innerData"]));
          break;
        case "setBg":
          replayConfig.scriptArray.push(this.genBackgroundEntry(fields["innerData"]));
          break;
        case "talk":
          let chID = "";
          if (hasChannelInfo) {
            chID = RegexpService.get(this.regexp.scriptChatChannelID, fields["innerData"]);
          } else {
            const channelName = RegexpService.get(this.regexp.scriptChatChannelName, fields["innerData"]);
            const channel = replayConfig.channelColle.GetByName(channelName);
            if (channel) {
              chID = channel.id;
            } else {
              const newChannel = replayConfig.channelColle.Add("", {
                name: (channelName === "main")? "主要": channelName,
                isMain: (channelName === "main"),
                id: "", isHidden: false,
              });
              chID = newChannel.id;
            }
          }
          replayConfig.scriptArray.push(this.genChatEntry(chID, fields["innerData"]));
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
    const actorID = RegexpService.get(this.regexp.scriptChatActor, innerData);
    const content = RegexpService.get(this.regexp.scriptChatContent, innerData);
    return {
      type: "chat",
      channelId: chID,
      actorId: actorID,
      content: content,
    };
  }

  static removeQuote(text: string): string {
    return RegexpService.get(new RegExp(/^["']?(.*?)["']?$/, 's'), text);
  }
}