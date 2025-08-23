import { Injectable } from '@angular/core';
import { ReplayConfig } from '../classes/replay-config';
import { RegexpService } from './regexp.service';
import { DondotofParser } from './parser/parser-dondotof';
import { HazWebParser } from './parser/parser-hazweb';
import { HazWebV2Parser } from './parser/parser-hazweb-v2';
import { CCFoliaParser } from './parser/parser-ccfolia';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor() { }

  Parse(fileData:string): ReplayConfig {
    var config: ReplayConfig;
    
    let sourceType = this.CheckMode(fileData);
    switch(sourceType) {
      case 'ccfolia':   config = CCFoliaParser.Parse(fileData); break;
      case 'dondotof':  config = DondotofParser.Parse(fileData); break;
      // case 'hazrp':     infoObj = ParseHazRpJSON(fileData); break;
      case 'hazweb':    config = HazWebParser.Parse(fileData); break;
      case "hazweb_v2": config = HazWebV2Parser.Parse(fileData); break;
      default:
        throw "unknown source type."
    }
    
    return config;
  }

  CheckMode(fileData: string): SourceType {
    if(this.isJsonFile(fileData)) {
      return "hazrp";
    }
    else if(this.isHtmlFile(fileData)) {
      if(this.isHazWebFile(fileData)) {
        switch(this.getHazWebVersion(fileData)){
          case "2.0": return "hazweb_v2";
          default:    return "hazweb";
        }
      }
      if(this.isCCFFile(fileData)) return "ccfolia";
      if(this.isDDFFile(fileData)) return "dondotof";
    }
    return "unknown";
  }

  private isJsonFile(content: string): boolean {
    try {
      JSON.parse(content);
    } catch(e) { return false; }
    return true;
  }
  private isHtmlFile(content: string): boolean {
    return RegexpService.isMatchByKey("htmlBody", content);
  }
  private isCCFFile(content: string): boolean {
    return RegexpService.isMatch(CCFoliaParser.regexp.chat, content);
  }
  private isDDFFile(content: string): boolean {
    return RegexpService.isMatch(DondotofParser.regexp.chat, content);
  }
  private isHazWebFile(content: string): boolean {
    return RegexpService.isMatchByKey("hazWebVersion", content);
  }
  private getHazWebVersion(content: string): string {
    return RegexpService.getByKey("hazWebVersion", content);
  }
}


export type SourceType = "ccfolia" | "dondotof" | "hazrp" | "hazweb" | "hazweb_v2" | "unknown";
