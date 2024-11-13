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
            ._main { display:flex; flex-direction:column; align-items: stretch; }
            ._subtitle { color:var(--color-subtitle); margin:5px 0 20px 0; }
            ._sctitle { background:#ddd; margin-top:30px; padding:10px;font-weight:bold;font-size:1.3rem;text-align:center; }


            ._talk { margin:5px 0; display:flex; border:1px solid black; background:#1e1e1e; color:#eee; width:100%; max-width:1080px; border-radius:5px; }
            ._talk ._lCol { width:125px; }
            ._talk ._rCol { flex-grow:1; }
            ._talk ._name{ padding:5px 10px; height:20px; font-size:18px; }
            ._talk ._img { margin:6px; width:110px; height:110px; background-repeat:no-repeat; background-size:cover; background-color:#2a2a2a; }
            ._talk ._content { margin:5px; background:#2a2a2a; font-size:1.1rem; padding:10px; height:calc(100% - 60px); border-radius:5px; }
            ._halt { padding:30px 0; }
            ._sctitle { border-radius:5px; margin-bottom:5px; }

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
._actor_${actor.id} ._img { background-image:url('${actor.imgUrl}'); }`.trim();
}

const genScriptEntryOuter = (type:string, content:string) => {
    return `
<div class="_script-outer" data-type="${type}">
    ${content}
</div><!--EOS-->`.trim();
};

const genScriptTalkElem = (entry:ScriptEntry, actor:ActorInfo) => {
    return `
<div class="_talk _actor_${actor.id}">
    <div class="_lCol">
        <div class="_img"></div>
    </div>
    <div class="_rCol">
        <div class="_name">${actor.name}</div>
        <div class="_content">${entry.content}</div>
    </div>
</div>`;
}

const genScriptTitleElem = (entry:ScriptEntry) => {
    return `<div class="_sctitle">${entry.content}"></div>`;
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