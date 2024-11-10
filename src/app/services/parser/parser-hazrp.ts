import { RegExpList } from "./regular-expression"
import { ParserFunc } from "src/app/interfaces/replay-info.interface";

export const ParseHazRpJSON:ParserFunc = (content:string) => {



    return {
        filename: "",
        config: {},
        actors: [],
        script: []
    };
};