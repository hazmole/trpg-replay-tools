import { ScriptEntry } from "../classes/script-entry";

export interface ScriptAction {
    type: ActionType;
    param: ActionParamMove | ActionParamAdd | ActionParamEdit | ActionParamDel;
}

export type ActionType = "move" | "add" | "edit" | "delete";

export interface ActionParamMove {
    toIdx: number;
    fromIdx: number;
}

export interface ActionParamAdd {
    idx: number;
    newEntry: ScriptEntry;
}

export interface ActionParamEdit {
    idx: number;
    originEntry: ScriptEntry;
    newEntry: ScriptEntry;
}

export interface ActionParamDel {
    idx: number;
    originEntry: ScriptEntry;
}
