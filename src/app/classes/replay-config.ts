import { Actor, ActorCollection } from "./actor-collection"
import { Channel, ChannelCollection } from "./channel-collection";
import { LayoutConfig } from "./layout-config";
import { ScriptEntry } from "./script-entry";

export class ReplayConfig {

  public filename: string;
  public actorColle: ActorCollection;
  public channelColle: ChannelCollection;
  public scriptArray: Array<ScriptEntry>;
  public layoutCfg: LayoutConfig;

  constructor() {
    this.actorColle = new ActorCollection();
    this.channelColle = new ChannelCollection();
    this.scriptArray = [];
    this.layoutCfg = new LayoutConfig();
  }

  public Overwrite(newCfg: ReplayConfig, param: InheritParams): void {
    if (param.isInheritActor) {
      newCfg.actorColle.Inherit(this.actorColle);
    }
    
    this.filename = newCfg.filename;
    this.actorColle = newCfg.actorColle;
    this.channelColle = newCfg.channelColle;
    this.scriptArray = newCfg.scriptArray;
    this.layoutCfg = newCfg.layoutCfg;
  }

  public Clear(): void {
    this.filename = "";
    this.actorColle.Clear();
    this.channelColle.Clear();
    this.scriptArray.length = 0;
  }
  public LoadFromJson(jsonData: ReplayConfigJSON): void {
    this.filename = jsonData.filename;
    this.actorColle.FromJson(jsonData.actors);
    this.channelColle.FromJson(jsonData.channels);
    this.scriptArray = jsonData.scripts;
    this.layoutCfg.FromJson(jsonData.layoutCfg);
  }
  public ToJson(): ReplayConfigJSON {
    return {
      filename: this.filename,
      actors: this.actorColle.ToJson(),
      channels: this.channelColle.ToJson(),
      scripts: this.scriptArray,
      layoutCfg: this.layoutCfg.ToJson(),
    };
  }
}

export interface InheritParams {
  isInheritActor: boolean;
  isInheritTheme: boolean;
}
export interface ReplayConfigJSON {
  filename: string;
  actors: Record<string, Actor>;
  channels: Record<string, Channel>;
  scripts: Array<ScriptEntry>;
  layoutCfg: Record<string, any>;
}