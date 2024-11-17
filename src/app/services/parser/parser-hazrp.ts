import { RegExpList } from "./regular-expression"
import { ParserFunc } from "src/app/interfaces/replay-info.interface";

export const ParseHazRpJSON:ParserFunc = (content:string) => {



    return {
        filename: "",
        config: { title: "未命名團錄" },
        actors: {},
        channels: {},
        script: [],
        isLoaded: false
    };
};