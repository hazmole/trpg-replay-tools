export interface DialogHeaderOptions {
    close: DialogButtonOptions;
  };

export interface DialogFooterOptions {
    close: DialogButtonOptions;
    confirm?: DialogButtonOptions;
};
  
export interface DialogButtonOptions {
    click: ((event?:Event) => void) | null;
    disabled?: (() => boolean) | boolean;
    text?: string;
};