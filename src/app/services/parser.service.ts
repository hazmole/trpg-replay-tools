import { Injectable } from '@angular/core';
import { RegExpList } from './parser/regular-expression';
import { ReplayInfo } from 'src/app/interfaces/replay-info.interface';

import { ParseCCFolia } from './parser/parser-ccfolia';
import { ParseDondotoF } from './parser/parser-dondotof';
import { ParseHazRpJSON } from './parser/parser-hazrp';
import { ParseHazWeb } from './parser/parser-hazweb';
import { ParseHazWebV2 } from './parser/parser-hazweb-v2';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor() { }

  Parse(fileName:string, fileData:string): (ReplayInfo | null) {
    let infoObj:(ReplayInfo|null) = null;
    
    let sourceType = this.CheckMode(fileData);
    switch(sourceType) {
      case 'ccfolia':   infoObj = ParseCCFolia(fileData); break;
      case 'dondotof':  infoObj = ParseDondotoF(fileData); break;
      case 'hazrp':     infoObj = ParseHazRpJSON(fileData); break;
      case 'hazweb':    infoObj = ParseHazWeb(fileData); break;
      case "hazweb_v2": infoObj = ParseHazWebV2(fileData); break;
    }
    
    if(infoObj != null) {
      infoObj.filename = fileName;
      infoObj.isLoaded = true;
    }
    
    return infoObj;
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
    return (content.match(RegExpList.htmlBody) != null);
  }
  private isCCFFile(content: string): boolean {
    return (content.match(RegExpList.ccfFotmat) != null);
  }
  private isDDFFile(content: string): boolean {
    return (content.match(RegExpList.ddfFotmat) != null);
  }
  private isHazWebFile(content: string): boolean {
    return (content.match(RegExpList.hazWebVersion) != null);
  }
  private getHazWebVersion(content: string): string {
    return (content.match(RegExpList.hazWebVersion) || [])[1];
  }
}


export type SourceType = "ccfolia" | "dondotof" | "hazrp" | "hazweb" | "hazweb_v2" | "unknown";
