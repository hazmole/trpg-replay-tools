import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegexpService {
  constructor() { }

  

  static isMatchByKey(key: RegExpKey, text: string): boolean {
    return this.isMatch(REGEXP_LIST[key], text);
  }
  static getByKey(key: RegExpKey, text: string): string {
    return this.get(REGEXP_LIST[key], text);
  }


  /* Base Function */
  static isMatch(expression: RegExp, text: string): boolean {
    const result = text.match(expression);
    return (result != null);
  }

  static get(expression: RegExp, text: string): string {
    const result = easyMatch(expression, text);
    return (result.length === 0)? "": result[1];
  }
  static getArr(expression: RegExp, text: string): Array<string> {
    if (!expression.flags.includes("g")) {
      console.warn(`unexpected usage: regexp flag should includes "g"`);
    }
    const result = easyMatch(expression, text);
    return result
      .map(item => item.trim())
      .filter( item => item !== "");
  }

  static getfields(expression: RegExp, text: string, structDefine: Array<(string | null)>): Record<string, string> {
    const result = easyMatchAll(expression, text);
    if (result.length === 0) return {};

    const data = result[0];
    const record: Record<string, string> = {};
    structDefine.forEach((defKey, idx) => {
      if (!defKey || defKey === "_") return ;
      record[defKey] = data[idx + 1];
    });
    return record;
  }


}

// easy formating
function easyMatch(expression: RegExp, text: string): Array<string> {
  const result = text.match(expression);
    if (result == null) {
      console.error(`cannot do match() using regexp ${expression} for text: ${text}`);
      return [];
    }
    return result;
}

function easyMatchAll(expression: RegExp, text: string): Array<Array<string>> {
  const result = [...text.matchAll(expression)];
  if (result == null) {
    console.error(`cannot do matchAll() using regexp ${expression} for text: ${text}`);
    return [];
  }
  return result;
}

const REGEXP_LIST = {
  hazWebVersion: new RegExp(/<version>hazmole_v(.*?)<\/version>/),
  
  htmlBody:  new RegExp(/<body.*?>(.*)<\/body>/, 's'),
  htmlHead:  new RegExp(/<head.*?>(.*)<\/head>/, 's'),
  htmlStyle: new RegExp(/<style.*?>(.*)<\/style>/, 's'),
  htmlTitle: new RegExp(/<title>(.*?)<\/title>/, 's'),
  cssUrl: new RegExp(/url\((.*?)\)/, 's'),
};
type RegExpKey = keyof typeof REGEXP_LIST