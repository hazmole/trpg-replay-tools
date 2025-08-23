export interface ScriptEntry {
    type: ScriptEntryType;
    content: string;

    channelId?: string;
    actorId?: string;
}
export type ScriptEntryType = "chat" | "title" | "halt" | "setBg";