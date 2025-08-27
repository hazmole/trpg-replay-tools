import { Injectable } from '@angular/core';
import { ParserService } from './parser.service';
import { StorageManagerService } from './storage-manager.service';
import { InheritParams, ReplayConfig, ReplayConfigJSON } from '../classes/replay-config';
import { ActorCollection } from '../classes/actor-collection';
import { ChannelCollection } from '../classes/channel-collection';
import { ScriptEntry } from '../classes/script-entry';
import { LayoutConfig } from '../classes/layout-config';

@Injectable({
  providedIn: 'root'
})
export class ReplayManagerService {
  
  private replayCfg: ReplayConfig;
  private isLoaded: boolean;

  constructor(
    private storageServ: StorageManagerService,
  ) {
    this.replayCfg = new ReplayConfig();
  }


  public Import(file: File, options: InheritParams): Promise<any> {
    const parser = new ParserService();
    const fileName = file.name;

    // Step 1: Read File
    return new Promise<any>((resolve)=>{
      let fileReader = new FileReader();
      fileReader.onload = (_event) => {
        resolve(fileReader.result);
      }
      fileReader.readAsText(file);
    })
    // Step 2: Parse
    .then((fileData: string) => {
      return parser.Parse(fileData);
    })
    // Step 3: Inherit
    .then((newRpInfo) => {
      this.replayCfg.Overwrite(newRpInfo, options);
      this.replayCfg.filename = fileName;
      this.isLoaded = true;
    })
  };

  public isReplayLoaded(): boolean {
    return this.isLoaded;
  }

  // Getter
  public GetReplayConfig(): ReplayConfig {
    return this.replayCfg;
  }
  public GetLayoutConfig(): LayoutConfig {
    return this.replayCfg.layoutCfg;
  }
  public GetActorColle(): ActorCollection {
    return this.replayCfg.actorColle;
  }
  public GetChannelColle(): ChannelCollection {
    return this.replayCfg.channelColle;
  }
  public GetScriptArray(): Array<ScriptEntry> {
    return this.replayCfg.scriptArray;
  }
  public SetScriptArray(newArray: Array<ScriptEntry>): void {
    this.replayCfg.scriptArray = newArray;
  }


  /* Save & Load */
  public Clear(): void {
    this.isLoaded = false;
    this.replayCfg.Clear();
    this.Save();
  }
  public Load() {
    let infoObj = (this.storageServ.Load() as ReplayConfigJSON);
    if(infoObj) {
      this.replayCfg.LoadFromJson(infoObj);
      this.isLoaded = true;
    }
  }
  public Save() {
    this.storageServ.Save(this.replayCfg.ToJson());
  }


  
  public Test() {
    console.log(this.replayCfg);
  }

}
