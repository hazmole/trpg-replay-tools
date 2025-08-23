
export class LayoutConfig {
  
  public title: string;
  public subtitle: string;
  public colorTheme: ColorTheme;

  constructor() {}

  public Clear(): void {
    this.title = "";
    this.subtitle = "";
    this.colorTheme = {};
  }

  public FromJson(data: { [key:string]: any }): void {
    this.title = data["title"];
    this.subtitle = data["subtitle"];
  }
  public ToJson(): { [key:string]: any } {
    return {
      title: this.title,
      subtitle: this.subtitle,
      colorTheme: this.colorTheme,
    };
  }
};

interface ColorTheme {
  background?: string;
  titleText?: string;
}