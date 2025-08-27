import { Actor } from "src/app/classes/actor-collection";
import { Channel } from "src/app/classes/channel-collection";
import { ScriptEntry } from "src/app/classes/script-entry";


export interface BasicWebOptions {
    version: string;
    title: string;
    subtitle: string;
    description: string;
    styleVarArr: Array<string>;
    styleActorArr: Array<string>;
    channelArr: Array<string>;
    scriptList: Array<string>;
}


const genBasicWeb = (opt:BasicWebOptions) => {
    return `
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:title" content="${opt.title}">
        <meta property="og:description" content="${opt.description}">
        <title>${opt.title}</title>
        <style>
            :root{
                ${ opt.styleVarArr.join('\n                ') }
            }
            body { display:flex; flex-direction:column; align-items:center; background:var(--color-bg); }
            h1{ margin: 5px 0; color:var(--color-title); }
            ._hidden { display:none !important; }
            ._main { display:flex; flex-direction:column; align-items:stretch; gap:10px; width:100%; max-width:1080px; }
            ._subtitle { color:var(--color-subtitle); margin-top:0; margin-bottom: 20px; }
            ._sctitle { background:#ddd; margin-top:30px; padding:10px;font-weight:bold;font-size:1.3rem;text-align:center; }

            ._talk { display:flex; flex-direction:row; gap:2px; background:var(--color-talk-bg); width:100%; border-radius:5px; }
            ._talk ._lCol { width:110px; flex-shrink:0; margin:6px; margin-right:0; }
            ._talk ._rCol { flex:1; display:flex; flex-direction: column; }
            ._talk ._img { width:110px; height:110px; background-repeat:no-repeat; background-size:cover; background-color:#ffffff10; }
            ._talk ._name { margin:6px; height:20px; font-size:18px; display:flex; justify-content:space-between; }
            ._talk ._channel { margin-left:5px; color:#888888; display:none; }
            ._talk ._content { flex:1; margin:6px; background:var(--color-talk-panel-bg); color:var(--color-talk-panel-text); font-size:1.1rem; padding:10px; border-radius:5px; }
            ._talk._other { width:50%; margin-left:auto; }
            ._talk._other ._lCol { display:none; }
            ._talk._other ._name { justify-content:end; }
            ._talk._other ._channel { display:block; }
            ._talk._other ._content { background:black; color:white; text-align:right; }

            ._halt { padding:30px 0; }
            ._sctitle { border-radius:5px; }
            ._bg-img { display:flex; justify-content: center; }
            ._bg-img img { max-width:100%; max-height:400px; }

            ${ opt.styleActorArr.join('\n            ') }
        </style>
        <meta-data class="_hidden">
            <channel>
                ${ opt.channelArr.join('\n                ') }
            </channel>
        </meta-data>
    </head>
    <body>
        <div class="_hidden"><version>${opt.version}</version></div>
        <h1>${opt.title}</h1>
        <div class="_subtitle">${opt.subtitle}</div>

        <div class="_main">
${opt.scriptList.join('\n')}
        </div>
    </body>
</html>`.trim();
};


const genActorStyle = (actor:Actor): Array<string> =>  {
    return [
        `._actor_${actor.id} ._name { color:${actor.color}; content:'${actor.name}'; }`,
        `._actor_${actor.id} ._img { background-image:url('${actor.imgUrl}'); display:${actor.imgUrl===""? "none": "block"}; }`
    ];
}

const genChannelInfo = (channel:Channel) => {
    return `_ch_${channel.id}: { name:"${channel.name}"; main:${channel.isMain}; hide:${channel.isHidden}; }`;
}

const genScriptEntryOuter = (type:string, content:string, isHidden:boolean) => {
    return `
<div class="_script-outer ${isHidden? "_hidden": ""}" data-type="${(type === "chat")? "talk": type}">
    ${content}
</div><!--EOS-->`.trim();
};

const genScriptTalkElem = (entry:ScriptEntry, actor:Actor, channel:Channel) => {
    return `
<div class="_talk _actor_${actor.id} ${channel.isMain? "_main": "_other"} ${channel.isHidden? "_hidden": ""}">
    <div class="_lCol">
        <div class="_img"></div>
    </div>
    <div class="_rCol">
        <div class="_name">
            ${actor.name}
            <div class="_channel">[${channel.name}]</div>
            <channel class="_hidden">${channel.id}</channel>
        </div>
        <div class="_content">${entry.content}</div>
    </div>
</div>`;
}

const genScriptTitleElem = (entry:ScriptEntry) => {
    return `<div class="_sctitle">${entry.content}</div>`;
}

const genScriptHaltElem = (entry:ScriptEntry) => {
    return `<div class="_halt"></div>`;
}

const genScriptBgImageElem = (entry:ScriptEntry) => {
    return `<div class="_bg-img"><img src="${entry.content}"></div>`;
}


export const templateBuilder = {
    genBasicWeb,
    genActorStyle,
    genChannelInfo,
    genScriptEntryOuter,
    genScriptTalkElem,
    genScriptTitleElem,
    genScriptHaltElem,
    genScriptBgImageElem,
};