import { parse as CssParse } from "css-parser";

export const getStyleMap = (sheet:string) => {
  const AST = CssParse(sheet);

  const map: Record<string, CSSStyleRule> = {};
  for (let rule of Object.values(AST.cssRules)) {
    let key = (rule as CSSStyleRule).selectorText;
    map[key] = (rule as CSSStyleRule)
  }
  
  return map;
}