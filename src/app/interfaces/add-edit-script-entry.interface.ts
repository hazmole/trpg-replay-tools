import { ScriptEntry } from "./replay-info.interface";

export type Mode = "add" | "edit";

export interface AddEditScriptParam {
    mode: Mode;
    entry?: ScriptEntry;
}
export interface AddEditScriptReturn {
    mode: Mode;
    entry?: ScriptEntry;
}