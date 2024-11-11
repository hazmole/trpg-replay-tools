import { Injectable } from '@angular/core';
import { ReplayInfo } from 'src/app/interfaces/replay-info.interface';
import { ParserService } from './parser.service';

import { ActorInfo, newReplayInfo } from 'src/app/interfaces/replay-info.interface';

@Injectable({
  providedIn: 'root'
})
export class ReplayManagerService {

  constructor() { }

  private replayInfo:ReplayInfo = newReplayInfo();

  public Import(file: File): Promise<any> {
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
      } else {
        this.replayInfo = replayInfo;
      }
      return true;
    })
  };

  public isReplayLoaded(): boolean {
    return (this.replayInfo.isLoaded);
  }

  public GetInfoJSON(): Object {
    return this.replayInfo;
  }
  public SetInfoFromJSON(info: any): void {
    this.replayInfo = info;
  }

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
  }

  public Test() {
    console.log(this.replayInfo);
  }

}
