export interface ReplayInfo {
    filename: string;
    config: ReplayConfig;
    actors: Record<number, ActorInfo>;
    script: Array<ScriptEntry>;
    isLoaded: boolean;
}
export const newReplayInfo = () => {
    return {
        filename: "",
        config: {
            title: "未命名標題",
        },
        actors: {},
        script: [],
        isLoaded: false,
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

export type ConfigKey = keyof ReplayConfig;

export type ScriptEntryType = "talk" | "title" | "halt" | "setBg";

export type ChannelType = "main" | string;

export type ParserFunc = (content:string) => (ReplayInfo);