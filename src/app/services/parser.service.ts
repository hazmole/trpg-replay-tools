import { Injectable } from '@angular/core';
import { RegExpList } from './parser/regular-expression';
import { ReplayInfo } from 'src/app/interfaces/replay-info.interface';

import { ParseCCFolia } from './parser/parser-ccfolia';
import { ParseDondotoF } from './parser/parser-dondotof';
import { ParseHazWeb } from './parser/parser-hazweb';
import { ParseHazRpJSON } from './parser/parser-hazrp';

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
      case 'hazweb':    infoObj = ParseHazWeb(fileData); break;
      case 'hazrp':     infoObj = ParseHazRpJSON(fileData); break;
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
      if(this.isHazWebFile(fileData)) return "hazweb";
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
  private isHazWebFile(content: string): boolean {
    return (content.match(RegExpList.hazWebVersion) != null);
  }
  private isCCFFile(content: string): boolean {
    return (content.match(RegExpList.ccfFotmat) != null);
  }
  private isDDFFile(content: string): boolean {
    return (content.match(RegExpList.ddfFotmat) != null);
  }
}


export type SourceType = "ccfolia" | "dondotof" | "hazweb" | "hazrp" | "unknown";
