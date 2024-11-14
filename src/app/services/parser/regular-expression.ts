
export const RegExpList = {
    htmlBody: new RegExp(/<body.*?>(.*)<\/body>/, 's'),
    htmlStyle: new RegExp(/<style>(.*)<\/style>/, 's'),

    hazWebVersion: new RegExp(/<version>hazmole_v(.*?)<\/version>/),
    ccfFotmat: new RegExp(/<p style="color:#([\w\d]{6});">.*?<span> \[(.*?)\].*?<span>(.*?)<\/span>.*?<span>(.*?)<\/span>/, 'smg'),
    ddfFotmat: new RegExp(/(^\[(.*?)\])?<font color='#([\w\d]{6})'><b>(.*?)<\/b>：(.*?)<\/font>/, 'smg'),
    
    hazV1Format: new RegExp(/<div class="_script" data-type="(\w+)">(.*?)<\/div><!--EOS-->/, 'smg'),
    hazv1_actorCss: new RegExp(/\._actor_(\d+) ._actorName { color: #([\w\d]{6}); }.*?\._actor_\d+ ._actorName::after { content:"(.*?)"; }.*?._actor_\d+ ._actorImg { background-image:url\((.*?)\); }/, 'sg'),
    hazv1_getDocTitle: new RegExp(/<title>(.*?)<\/title>/, 's'),
    hazv1_getSectTitle: new RegExp(/<div class="_sectTitle">(.*?)<\/div>/, 's'),
    hazv1_getBgImage: new RegExp(/<div class="_hidden">(.*?)<\/div>/, 's'),
    hazv1_getTalk: new RegExp(/<div class="_talk (.*?) _actor_(\d+)">/, 'sg'),
    hazv1_getTalkContent: new RegExp(/<div class="_actorWords">(.*?)<\/div>/, 'smg'),

    hazV2Format: new RegExp(/<div class="_script-outer" data-type="(\w+)">(.*?)<\/div><!--EOS-->/, 'smg'),
    hazv2_actorCss: new RegExp(/\._actor_(\d+) ._name { color:(#[\w\d]{6}); content:'(.*?)'; }.*?._actor_\d+ ._img { background-image:url\('(.*?)'\);/, 'sg'),
    hazv2_getSectTitle: new RegExp(/<div class="_sctitle">(.*?)<\/div>/, 's'),
    hazv2_getBgImage: new RegExp(/<img src="(.*?)">/, 's'),
    hazv2_getTalk: new RegExp(/<div class="_talk _actor_(\d+) .*?">/, 'sg'),
    hazv2_getTalkChannel: new RegExp(/<div class="_channel">(.*?)<\/div>/, 'sg'),
    hazv2_getTalkContent: new RegExp(/<div class="_content">(.*?)<\/div>/, 'smg'),
};

type RegExpKey = keyof typeof RegExpList


//
export const RegMatchByIdx = (key:RegExpKey, text:string, idx:number) => {
    let matchResult = text.match(RegExpList[key]);
    if(matchResult != null) return matchResult[idx];
    return "";
};
export const RegMatchArr = (key:RegExpKey, text:string) => {
    let array = text.match(RegExpList[key]);
    if(array != null) {
        return array
            .map( section => section.trim() )
            .filter( section => section !== "" );
    }
    return [];
};