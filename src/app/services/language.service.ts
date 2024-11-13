import { Injectable } from '@angular/core';
import { langMap } from './language/lang';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  

  public FMT(langKey:string): string {
    if (langMap[langKey] == undefined) return langKey;
    return langMap[langKey];
  }
}
