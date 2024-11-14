import { ActorInfo, ScriptEntry } from "src/app/interfaces/replay-info.interface";

export interface BasicWebOptions {
    version: string;
    title: string;
    subtitle: string;
    description: string;
    styleVarArr: Array<string>;
    styleActorArr: Array<string>;
    scriptList: Array<string>;
}


const genBasicWeb = (opt:BasicWebOptions) => {
    return `
<html>
    <head>
        <meta charset="utf-8">
        <meta property="og:title" content="${opt.title}">
        <meta property="og:description" content="${opt.description}">
        <title>${opt.title}</title>
        <style>
            :root{
                ${ opt.styleVarArr.join('\n') }
            }
            body { display:flex; flex-direction:column; align-items:center; background:var(--color-bg); }
            h1{ margin: 5px 0; color:var(--color-title); }
            ._hidden { display:none; }
            ._main { display:flex; flex-direction:column; align-items:stretch; gap:10px; width:1080px; }
            ._subtitle { color:var(--color-subtitle); margin-top:20px; }
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

            ${ opt.styleActorArr.join('\n') }
        </style>
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


const genActorStyle = (actor:ActorInfo) => {
    return `
._actor_${actor.id} ._name { color:${actor.color}; content:'${actor.name}'; }
._actor_${actor.id} ._img { background-image:url('${actor.imgUrl}'); display:${actor.imgUrl===""? "none": "block"}; }`.trim();
}

const genScriptEntryOuter = (type:string, content:string) => {
    return `
<div class="_script-outer" data-type="${type}">
    ${content}
</div><!--EOS-->`.trim();
};

const genScriptTalkElem = (entry:ScriptEntry, actor:ActorInfo) => {
    return `
<div class="_talk _actor_${actor.id} ${entry.channel=="main"? "_main": "_other"}" data-channel="${entry.channel}">
    <div class="_lCol">
        <div class="_img"></div>
    </div>
    <div class="_rCol">
        <div class="_name">
            ${actor.name}
            <div class="_channel">[${entry.channel}]</div>
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
    genScriptEntryOuter,
    genScriptTalkElem,
    genScriptTitleElem,
    genScriptHaltElem,
    genScriptBgImageElem,
};