import { Injectable } from '@angular/core';
import { ReplayConfig, ReplayInfo, ScriptEntry } from 'src/app/interfaces/replay-info.interface';
import { ParserService } from './parser.service';
import { StorageManagerService } from './storage-manager.service';

import { ActorInfo, newReplayInfo } from 'src/app/interfaces/replay-info.interface';
import { mergeActorTable } from './parser/lib-parser';

@Injectable({
  providedIn: 'root'
})
export class ReplayManagerService {

  constructor(
    private storageServ: StorageManagerService,
  ) { }

  private replayInfo:ReplayInfo = newReplayInfo();

  public Import(file: File, options: ImportOptions): Promise<any> {
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
      let replayInfo = parser.Parse(fileName, fileData);
      if(replayInfo == null) {
        throw "unknown_file_format";
      }
      return replayInfo;
    })
    // Step 3: Inherit
    .then((newRpInfo) => {
      if(options.isInheritActor) {
        newRpInfo.actors = mergeActorTable(newRpInfo.actors, this.replayInfo.actors);
      }
      if(options.isInheritTheme) {
        newRpInfo.config.colorTheme = this.replayInfo.config.colorTheme;
      }
      this.replayInfo = newRpInfo;
    })
  };

  public isReplayLoaded(): boolean {
    return (this.replayInfo.isLoaded);
  }

  /* General */
  public GetInfo(): ReplayInfo {
    return this.replayInfo;
  }
  public GetInfoJSON(): Object {
    return this.replayInfo;
  }
  public LoadInfoFromJSON(): void {
    let infoObj = this.storageServ.Load();
    if(infoObj) this.replayInfo = infoObj;
  }
  public Clear(): void {
    this.replayInfo.isLoaded = false;
    this.replayInfo.filename = "";
    this.replayInfo.config = { title: "未命名團錄" };
    this.replayInfo.actors = {};
    this.replayInfo.script.length = 0;

    this.Save();
  }

  /* Config */
  public GetConfig(): ReplayConfig {
    return this.replayInfo.config;
  }
  public SetConfig(config: ReplayConfig) {
    this.replayInfo.config = config;
    this.Save();
  }

  /* Actor */
  public GetActorList(): Record<number, ActorInfo> {
    return (this.replayInfo.actors);
  }
  public SetActorInfo(id: number, newValues: Partial<ActorInfo>){
    const actorList = this.replayInfo.actors;
    if(actorList[id] != undefined) {
      Object.assign(actorList[id], newValues);
    } else {
      actorList[id] = Object.assign({ id, name: "", color: "888888", imgUrl: "" }, newValues);
    }
    this.Save();
  }
  public DeleteActorInfo(id: number) {
    const actorList = this.replayInfo.actors;
    delete actorList[id];
    this.Save();
  }


  /* Script */
  public GetScriptEntryList(): Array<ScriptEntry> {
    return (this.replayInfo.script);
  }
  public SetScriptEntryList(list: Array<ScriptEntry>): void {
    this.replayInfo.script = list;
    this.Save();
  }


  public Save() {
    this.storageServ.Save(this.replayInfo);
  }
  public Test() {
    console.log(this.replayInfo);
  }

}


export interface ImportOptions {
  isInheritActor: boolean;
  isInheritTheme: boolean;
}