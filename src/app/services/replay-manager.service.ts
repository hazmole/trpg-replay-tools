import { Injectable } from '@angular/core';
import { ReplayInfo } from 'src/app/interfaces/replay-info.interface';
import { ParserService } from './parser.service';

@Injectable({
  providedIn: 'root'
})
export class ReplayManagerService {

  constructor() { }

  private replayInfo:(ReplayInfo|null) = null;

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
      this.replayInfo = parser.Parse(fileName, fileData);
      if(this.replayInfo == null) {
        throw "unknown_file_format";
      }
      return true;
    })
  };

  public Test() {
    console.log(this.replayInfo);
  }

}
