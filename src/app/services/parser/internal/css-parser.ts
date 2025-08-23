import { parse as CssParse } from "css-parser";

export class CssParser {
  constructor(sheetText: string) {
    this.load(sheetText);
  }

  private cssMap: Record<string, CssRule> = {};

  private load(sheetText: string): void {
    if (sheetText === "" || sheetText == undefined) {
      console.error("css-parser load error: empty sheetText.");
      return 
    }
    const AST = CssParse(sheetText);
    for (const rule of (Object.values(AST.cssRules) as Array<CSSStyleRule>)) {
      const selector = rule.selectorText;
      if (selector === undefined) continue;

      this.cssMap[selector] = new CssRule(rule);
    }
  }

  public getMap(): Record<string, CssRule> {
    return this.cssMap;
  }
  public getRule(selector: string): CssRule {
    return this.cssMap[selector];
  }
  public getValue(selector: string, key: string, defaultVal?: string): string {
    const rule = this.cssMap[selector];
    return (rule !== undefined)? rule.getValue(key, defaultVal):
      (defaultVal !== undefined)? defaultVal: "";
  }
}

class CssRule {

  private valMap: Record<string, string> = {};

  constructor(styleRule: CSSStyleRule) {
    for (let i = 0; i < styleRule.style.length; i++) {
      const key = styleRule.style[i];
      const val = (styleRule.style as any)[key];
      this.valMap[key] = val;
    }
  }

  public getValue(key: string, defaultVal?: string): string {
    const value = this.valMap[key];
    return (value !== undefined)? value: 
      (defaultVal !== undefined)? defaultVal: "";
  }
}