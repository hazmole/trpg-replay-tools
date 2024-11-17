export interface ReplayInfo {
    filename: string;
    config: ReplayConfig;
    actors: Record<number, ActorInfo>;
    channels: Record<number, ChannelInfo>;
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
        channels: {},
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
export interface ChannelInfo {
    id: number;
    name: string;
    isMain: boolean;
}
export interface ReplayConfig {
    title: string;
    subtitle?: string;
    colorTheme?: ColorTheme;
};

export interface ColorTheme {
    pageBgColor?: string;
    pageTitleColor?: string;
    scriptTalkBgColor?: string;
    scriptTalkPanelBgColor?: string;
    scriptTalkPaneltextColor?: string;
};

export interface ScriptEntry {
    type: ScriptEntryType;
    channelId?: number;
    actorId?: number;
    content: string;
}

export type ConfigKey = keyof ReplayConfig;

export type ScriptEntryType = "talk" | "title" | "halt" | "setBg";

export type ChannelType = "main" | string;

export type ParserFunc = (content:string) => (ReplayInfo);