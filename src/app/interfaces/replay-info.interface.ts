export interface ReplayInfo {
    filename: string;
    config: ReplayConfig;
    actors: Record<number, ActorInfo>;
    script: Array<ScriptEntry>;
}
export const newReplayInfo = () => {
    return {
        filename: "",
        config: {},
        actors: {},
        script: [],
    }
}

export interface ActorInfo {
    id: number;
    name: string;
    color: string;
    imgUrl: string;
};
export interface ReplayConfig {
    title?: string;
    subtitle?: string;
};
export interface ScriptEntry {
    type: ScriptEntryType;
    channel?: ChannelType;
    actorId?: number;
    content: string;
}

export type ScriptEntryType = "talk" | "title" | "halt" | "setBg";

export type ChannelType = "main" | string;

export type ParserFunc = (content:string) => (ReplayInfo);