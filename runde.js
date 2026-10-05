/* Neon Park – App-Runde: eingebauter, regelbasierter Spielleiter (ohne KI-Kontingent),
   KI-Mitspieler (regelbasiert), Activities-Seite, Mehrspieler per WebRTC (PeerJS, kostenlos)
   + Fallback Spielstand-Code/Datei. Läuft komplett im Browser. Nutzt Globals der Hauptseite
   (S, fig, AV, OBER, UNTER, VOLK, ATTR, mod, rnd, esc, snd, showDice, maxTp, unterOf, FIGS, FIG_VOLK). */
(function(){
'use strict';
const RKEY='neonpark-runde-v1',GKEY='neonpark-runde-gast-v1',PIDKEY='neonpark-pid-v1',MPKEY='neonpark-mp-v1';
const MAXP=5,NARR={n:'Neon Omina',e:'🔮',c:'#C4B5FD'};
const BOTS=[
 {id:'paulov',name:'Paulov',e:'🐸',c:'#2DD4BF',look:'Cyber-Frosch',volk:'gnom',gen:'m',ober:'Kreativist',unter:'Ingenieur',st:[8,13,14,15,12,10],pref:{technik:3,analyse:3},
  info:'Physik & Mathe, analytisch',
  act:['Statistisch gesehen ist „{opt}“ unsere beste Option. Quak.','Lasst mich das kurz berechnen … {opt}!','Hypothese: {opt}. Experiment beginnt!'],
  ok:['Wie berechnet. 📐','Quod erat demonstrandum!','Die Formel hält. Quak!'],part:['Mit Messfehler, aber im Rahmen.','Nicht elegant, aber funktional.'],fail:['Hm. Meine Annahmen waren … optimistisch.','Fehler in Zeile eins: ich.'],
  idle:['Interessant: Die Lichtfrequenz hier schwankt um 3 Prozent.','Wusstet ihr, dass Frösche quantenmechanisch eigentlich überall gleichzeitig sind? Kleiner Scherz.']},
 {id:'hirakka',name:"Hira'kka",e:'🪕',c:'#FF9F3D',look:'Goblin-Bardin',volk:'goblin',gen:'w',ober:'Kreativist',unter:'Barde',st:[8,14,12,11,12,15],pref:{musik:3,sozial:2,heilen:2},
  info:'warmherzig, Musik verbindet',
  act:['Keine Sorge, ich mach das mit Gefühl: {opt}!','Ich spiel euch was – und dann {opt}!','Für die Gruppe! 🪕'],
  ok:['Ha! Das war ein Ohrwurm-Moment!','Seht ihr? Mit Herz geht alles.'],part:['Fast ein Hit!','Kleine Dissonanz, große Wirkung.'],fail:['Uff … die nächste Strophe wird besser!','Na gut, Patzer. Lachen hilft!'],
  idle:['Ihr macht das so toll, wisst ihr das?','Ich schreib schon ein Lied über diesen Abend. 🎶']},
 {id:'vigilis',name:'Vigilis',e:'🦂',c:'#A3E635',look:'Skorpion-Humanoid',volk:'elf',gen:'m',ober:'Manabendiger',unter:'Druide',st:[10,13,14,10,15,10],pref:{natur:3,analyse:2,schutz:1},
  info:'Botaniker, wachsam',
  act:['Ich habe etwas bemerkt. {opt}.','Ruhig. Ich beobachte zuerst … dann {opt}.','Die Pflanzen hier erzählen etwas.'],
  ok:['Wie erwartet.','Die Natur lügt nicht.'],part:['Teilweise. Bleibt wachsam.','Etwas fehlt noch.'],fail:['Mein Stachel war schneller als mein Kopf.','Ich hätte länger warten sollen.'],
  idle:['Achtung, da hinten bewegt sich etwas. … Nur eine Laterne.','Dieses Moos ist selten. Ich nehme eine Probe mit.']},
 {id:'yall',name:"Y'all",e:'🐊',c:'#D8B26E',look:'Hillbilly-Alligator',volk:'ork',gen:'m',ober:'Krieger',unter:'Wächter',st:[15,11,15,8,12,10],pref:{schutz:3,kampf:2,mut:1},
  info:'Beschützer mit großem Herz',
  act:['Keine Bange, Leute, ich steh vorne!','Na dann, Ärmel hoch, y\'all: {opt}!','Ich pass auf euch auf, versprochen.'],
  ok:['Yeehaw! So macht man das im Sumpf!','Hat geklappt wie Omas Maisbrot.'],part:['Hat \'n bisschen gezwickt, aber passt.','Halb so wild!'],fail:['Autsch. Aber ich steh noch!','Das ging daneben wie \'n Frosch im Butterfass.'],
  idle:['Wenn wer Hunger hat: Ich hab Sumpfkekse dabei.','Alles gut bei euch? Ich frag ja nur.']},
 {id:'fixxy',name:'Fixxy',e:'🔧',c:'#FF8BD8',look:'Mechanikerin',volk:'zwerg',gen:'w',ober:'Kreativist',unter:'Runenschmied',st:[14,14,14,12,10,8],pref:{technik:3,schutz:1,kampf:1},
  info:'praktisch, repariert alles',
  act:['Gib mal den Schraubenschlüssel. {opt}.','Praktisch gedacht: {opt}.','Das krieg ich hin. Zwei Minuten.'],
  ok:['Läuft. 🔧','Repariert. Nächstes Problem?'],part:['Hält. Erstmal.','Mit Klebeband geht alles.'],fail:['Mist, falsches Werkzeug.','Okay, Plan B. Ich hab immer einen Plan B.'],
  idle:['Da quietscht was. Ich hör das.','Wer hat meinen 7er-Schlüssel? … Ach, hier.']},
 {id:'chad',name:'Captain Chad Erics',e:'🧭',c:'#FFE45C',look:'Reisender',volk:'mensch',gen:'m',ober:'Athlet',unter:'Kundschafter',st:[12,15,12,10,11,13],pref:{mut:3,kampf:2,sozial:1},
  info:'mutiger Weltenreisender',
  act:['Abenteuer ruft! Ich übernehme: {opt}!','Ich war schon an schlimmeren Orten. Los geht\'s!','Mir nach, Crew! 🧭'],
  ok:['Wie damals in der Glaswüste!','Captain Chad Erics, zu Diensten!'],part:['Knapp, aber Captain-würdig.','Kleiner Umweg, gleiches Ziel.'],fail:['Hoppla! Das erzähle ich später anders.','Na gut, die Karte war falsch herum.'],
  idle:['Hab ich euch schon von den singenden Dünen erzählt?','Kompass zeigt: Abenteuer. Wie immer.']}
];
const BOT=Object.fromEntries(BOTS.map(b=>[b.id,b]));
const HUMC=['#00E5FF','#FF2BD6','#F6F0FF','#7B2CFF','#5CFF9D'];
const GEN_ACTS=[
 {id:'g:helfen',e:'❤️',l:'Jemandem helfen',a:'WEI',sw:10,tag:'heilen',gen:1},
 {id:'g:umsehen',e:'🔍',l:'Umsehen',a:'WEI',sw:12,tag:'analyse',gen:1}
];
const HEAL={'Leuchtbrezel':2,'Glitzertrank':'W6','Leuchtthermoskanne':'W6'};
const RESL={ok:'✅ Erfolg',part:'◐ Teilerfolg',fail:'✖ Fehlschlag'};
const TYP={gm:['🔮','Erzähler'],say:['💬','sagt'],act:['▶️','Aktion'],roll:['🎲','Wurf'],sys:['⚙️','System'],loot:['🎁','Fund']};

let K=null,KERR='',R=loadJ(RKEY),G=loadJ(GKEY),TAB='stand',FILT='alle',ONLYROLL=false,PAUSE=false,botT=null,BUSY=false,SPEED=1300;
let MP={role:'solo',code:'',peer:null,conns:{},status:'',hostConn:null};
const $$=id=>document.getElementById(id);
function loadJ(k){try{return JSON.parse(localStorage.getItem(k))||null}catch(e){return null}}
function saveJ(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function pid(){let p=null;try{p=localStorage.getItem(PIDKEY)}catch(e){}if(!p){p='p'+Math.random().toString(36).slice(2,10);try{localStorage.setItem(PIDKEY,p)}catch(e){}}return p}
const ME=pid();
function d(n){return rnd(n)}
function pick(a){return a&&a.length?a[d(a.length)-1]:''}
function aIdx(a){return ATTR.findIndex(x=>x[0]===a)}
function col(c){return /^#[0-9a-fA-F]{3,8}$/.test(String(c||''))?c:'#cccccc'}
function cleanTxt(t,n){return String(t==null?'':t).replace(/[\u0000-\u001f<>]/g,' ').trim().slice(0,n||140)}
function V(){return (MP.role==='client'||MP.role==='view')?G:R}
function isHost(){return MP.role==='solo'||MP.role==='host'}
function first(n){return String(n||'').split(' ')[0]}
function fill(t,m,extra){return String(t||'').replace(/\{n\}/g,m?first(m.name):'').replace(/\{opt\}/g,extra||'').replace(/\{ort\}/g,(scene()||{}).ort||'')}

/* ---------- Kampagne laden ---------- */
function loadK(){if(K||KERR==='lädt')return;KERR='lädt';fetch('kampagne.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{if(!j||j.format!=='np-kampagne')throw 0;K=j;KERR='';rerender()}).catch(()=>{KERR='Die Kampagne konnte nicht geladen werden. Bitte die Seite über den normalen Link (https) öffnen.';rerender()})}
function questOf(id){return K&&(K.kurzquests||[]).find(q=>q.id===id)||null}
function activeCamp(){if(!K)return null;const v=V();if(v&&v.mode==='schnell'&&v.questId){const q=questOf(v.questId);if(q)return Object.assign({},K,{id:q.id,titel:q.titel,kurz:q.kurz,dauer:q.dauer||'ca. 15–25 Min.',start:q.start,begruessung:q.begruessung||K.begruessung,szenen:q.szenen})}return K}
function scene(id){const v=V();const C=activeCamp();if(!C||!v)return null;return C.szenen.find(s=>s.id===(id||v.scene))||null}
function encDef(){const v=V();const C=activeCamp();return v&&v.enc&&C?(C.begegnungen||[]).find(e=>e.id===v.enc.id):null}
function shuffle(a){const L=a.slice();for(let i=L.length-1;i>0;i--){const j=d(i+1)-1;const t=L[i];L[i]=L[j];L[j]=t}return L}
function offerQuests(){ensureR();const pool=(K&&K.kurzquests)||[];if(!pool.length)return[];if(!R.questOffer||!R.questOffer.length){R.questOffer=shuffle(pool.map(q=>q.id)).slice(0,Math.min(3,pool.length));save()}return R.questOffer.map(id=>questOf(id)).filter(Boolean)}
function setMode(m){ensureR();R.mode=m;R.questId=null;if(m==='lang'){R.camp=K?K.id:'funkenflug';R.questOffer=null}else{R.camp='';R.questOffer=null}log('sys',m==='lang'?'📜 Modus: Langes Spiel':'⚡ Modus: Schnelles Spiel');commit()}
function pickQuest(id){ensureR();const q=questOf(id);if(!q)return;R.mode='schnell';R.questId=q.id;R.camp=q.id;log('sys',`⚡ Kurz-Quest gewählt: ${q.e} ${q.titel}`);commit()}

/* ---------- Figuren ---------- */
function usedColors(p){return new Set((p||[]).map(m=>m.color))}
function freeColor(p){const u=usedColors(p);return HUMC.find(c=>!u.has(c))||'#F6F0FF'}
function invFromS(){return (S.inv||[]).map(i=>({e:i.e,n:i.n,heal:i.heal||HEAL[i.n]||null,uses:i.uses==null?null:i.uses}))}
function figMember(f,dev,kind,color){const m=Math.max(6,OBER[f.ober].tp+mod(f.st[2])+((VOLK[f.volk]||{}).tp||0));return {id:(kind==='bot'?'bot:':'h:')+dev+':'+first(f.name).toLowerCase().replace(/[^a-z0-9äöüß]/g,''),name:cleanTxt(f.name,30),kind,dev,av:f.avatar||f.id||'eigener',ober:f.ober,unter:f.unter,volk:f.volk||'',st:f.st.slice(0,6),hp:m,max:m,inv:[],fx:[],color:color,online:true}}
function meMember(p){const f=fig();if(!f)return null;const m=figMember(f,ME,'mensch',freeColor(p));m.id='h:'+ME;m.own=1;m.inv=invFromS();m.hp=Math.max(1,Math.min(m.max,S.tp==null?m.max:S.tp));return m}
function botMember(b){const m=figMember({name:b.name,ober:b.ober,unter:b.unter,st:b.st,volk:b.volk,avatar:'npc'},'bot','bot',b.c);m.id='bot:'+b.id;m.bot=b.id;m.e=b.e;m.look=b.look;m.inv=[{e:'🥨',n:'Leuchtbrezel',heal:2,uses:1}];return m}
function hotMember(pg,p){const vv=FIG_VOLK[pg.id]||['mensch','d'];const m=figMember({name:pg.name,ober:pg.ober,unter:pg.unter,st:pg.st,volk:vv[0],avatar:pg.id},ME,'mensch',freeColor(p));m.id='h:'+ME+':'+pg.id;m.hot=1;m.inv=pg.inv.map(i=>({e:i[0],n:i[1],heal:i[2]?2:(HEAL[i[1]]||null),uses:i[2]?1:null}));return m}
function mem(id,v){v=v||V();return v&&v.party.find(m=>m.id===id)}
function curM(v){v=v||V();if(!v||!v.order||!v.order.length||v.ended)return null;return mem(v.order[v.ti%v.order.length],v)}
function mine(m){return !!(m&&m.kind==='mensch'&&m.dev===ME)}
function myMember(v){v=v||V();return v?v.party.find(m=>m.kind==='mensch'&&m.dev===ME&&!m.hot)||v.party.find(mine):null}
function avHtml(m,lg){const c=col(m&&m.color);if(!m)return `<span class="npr-av${lg?' lg':''}" style="--c:${NARR.c}" aria-hidden="true">${NARR.e}</span>`;
 if(m.kind==='bot')return `<span class="npr-av${lg?' lg':''}" style="--c:${c}" aria-hidden="true">${esc(m.e||'🤖')}</span>`;
 const src=(m.own&&m.dev===ME&&typeof IMG!=='undefined'&&IMG)?IMG:(AV[m.av]||AV.eigener);return `<img class="npr-av${lg?' lg':''}" style="--c:${c}" src="${src}" alt="">`}
function clsTxt(m){const v=VOLK[m.volk];return `${v?v.e+' '+v.s+' · ':''}${OBER[m.ober]?OBER[m.ober].e:''} ${esc(m.ober)} · ${esc(m.unter)}${m.look?' · '+esc(m.look):''}`}

/* ---------- Spielstand ---------- */
function newR(){const p=[];const me=meMember(p);if(me)p.push(me);return {format:'np-runde',v:1,camp:K?K.id:'funkenflug',mode:null,questId:null,questOffer:null,party:p,order:[],ti:0,round:1,scene:'',prog:0,ehp:null,done:{},goals:[],flags:{},enc:null,log:[],started:false,ended:false,seq:0,t0:Date.now()}}
function ensureR(){if(!R){R=newR();save()}return R}
function save(){saveJ(RKEY,R)}
function log(k,txt,who,extra){const v=R;const sc=scene();const e=Object.assign({i:++v.seq,t:Date.now(),k,sc:v.scene||'vorbereitung',st:sc?sc.t:'Vorbereitung',r:v.started?v.round:0,txt:String(txt)},who?{w:who.id,n:who.name,c:who.color,e:who.kind==='bot'?who.e:'',a:who.kind==='bot'?'':who.av}:{});Object.assign(e,extra||{});v.log.push(e);if(v.log.length>1500)v.log.splice(0,v.log.length-1500)}
function commit(){save();broadcast();rerender();schedule()}

/* ---------- Gruppe ---------- */
function fillBots(){ensureR();let n=0;for(const b of BOTS){if(R.party.length>=MAXP)break;if(R.party.some(m=>m.bot===b.id))continue;const m=botMember(b);R.party.push(m);if(R.started)R.order.push(m.id);log('sys',`${b.e} ${b.name} (${b.look}, KI-Mitspieler) stößt zur Gruppe.`,m);n++}
 if(!n){log('sys','Die Gruppe ist schon voll (5 Plätze).')}snd('good');commit()}
function removeM(id){if(!R)return;const m=mem(id,R);if(!m)return;const cur=curM(R);R.party=R.party.filter(x=>x.id!==id);const oi=R.order.indexOf(id);if(oi>=0){R.order.splice(oi,1);if(oi<R.ti)R.ti--;if(R.order.length)R.ti=R.ti%R.order.length;else R.ti=0}
 log('sys',`${m.kind==='bot'?(m.e+' '):''}${m.name} verlässt die Gruppe.`);if(MP.role==='host'&&m.kind==='mensch'&&m.dev!==ME){const c=MP.conns[m.dev];if(c)try{c.send({t:'kicked'})}catch(e){}}commit()}
function removeBots(){if(!R)return;R.party.filter(m=>m.kind==='bot').forEach(m=>{R.party=R.party.filter(x=>x.id!==m.id);const oi=R.order.indexOf(m.id);if(oi>=0){R.order.splice(oi,1);if(oi<R.ti)R.ti--}});if(R.order.length)R.ti=Math.max(0,R.ti)%R.order.length;else R.ti=0;log('sys','Alle KI-Mitspieler haben die Gruppe verlassen.');commit()}
function addHot(id){ensureR();const pg=FIGS.find(x=>x.id===id);if(!pg||R.party.length>=MAXP)return;if(R.party.some(m=>m.id==='h:'+ME+':'+id))return;const m=hotMember(pg,R.party);R.party.push(m);if(R.started)R.order.push(m.id);log('sys',`${m.name} spielt an diesem Gerät mit (Hot-Seat).`,m);commit()}
function syncMe(){const f=fig();let me=R.party.find(m=>m.id==='h:'+ME);if(!me){if(R.party.length<MAXP){me=meMember(R.party);R.party.unshift(me);save()}return}if(me.name!==f.name||me.unter!==f.unter||me.volk!==f.volk){const n=meMember(R.party.filter(x=>x!==me));Object.assign(me,{name:n.name,av:n.av,ober:n.ober,unter:n.unter,volk:n.volk,st:n.st,max:n.max,hp:n.max,inv:n.inv});save()}}
function refreshMe(){const me=R&&R.party.find(m=>m.id==='h:'+ME);const f=fig();if(!me||!f)return;const n=meMember(R.party.filter(x=>x!==me));Object.assign(me,{name:n.name,av:n.av,ober:n.ober,unter:n.unter,volk:n.volk,st:n.st,max:n.max,inv:n.inv});me.hp=Math.min(me.hp,me.max);commit()}

/* ---------- Spiel starten ---------- */
function start(){ensureR();const C=activeCamp();if(!C)return;if(R.mode==='schnell'&&!R.questId)return;if(!R.mode){R.mode='lang';R.camp=C.id}if(!R.party.length){const me=meMember([]);if(me)R.party.push(me)}if(!R.party.length)return;
 R.log=R.log.filter(e=>e.k==='sys');R.started=true;R.ended=false;R.round=1;R.done={};R.goals=[];R.flags={};R.enc=null;
 (C.begruessung||[]).forEach(t=>log('gm',t));
 const ini=R.party.map(m=>{const r=d(20),b=mod(m.st[1])+(m.ober==='Athlet'?1:0);return {m,r,b,t:r+b}}).sort((a,b)=>b.t-a.t);
 R.order=ini.map(x=>x.m.id);R.ti=0;
 log('sys','🔁 Initiative (W20 + Geschick): '+ini.map(x=>`${x.m.name} ${x.r}${x.b?(x.b>0?'+':'−')+Math.abs(x.b):''}=${x.t}`).join(' · ')+'. Zugreihenfolge: '+ini.map(x=>first(x.m.name)).join(' → '));
 enterScene(C.start);snd('portal');commit()}
function enterScene(id){const C=activeCamp();if(!C)return;const s=C.szenen.find(x=>x.id===id);if(!s)return;R.scene=s.id;R.prog=0;R.ehp=s.enemy?s.enemy.hp:null;R.done={};R.enc=null;
 log('gm',`📍 ${s.oe} ${s.ort} – „${s.t}“\n${pick(s.intro)}`);
 if(s.goal){if(!R.goals.some(g=>g.id===s.goal.id))R.goals.push({id:s.goal.id,t:s.goal.t,done:false,sc:s.id});log('sys',`🎯 Neues Ziel: ${s.goal.t}`)}
 if(s.enemy)log('gm',`${s.enemy.e} ${s.enemy.n} stellt sich euch in den Weg (Ausdauer ${s.enemy.hp}). Reden, Tricks und Mut zählen genauso wie Kraft – niemand wird ernsthaft verletzt.`);
 if(s.end){R.ended=true;R.goals.forEach(g=>g.done=true);log('sys','🏁 Abenteuer abgeschlossen!')}}
function need(){const s=scene(),v=V();return s?(s.need||0)*2+Math.max(0,((v&&v.party.length)||1)-3):0}
function sceneDone(){const s=scene();if(!s)return false;if(s.enemy)return R.ehp<=0;return R.prog>=need()}

/* ---------- Optionen ---------- */
function availOpts(m,v){v=v||V();const s=scene();if(!s||v.ended)return [];const e=encDef();const base=e?e.opts:s.opts;const L=base.map(o=>Object.assign({},o,{done:!e&&!s.enemy&&!!v.done[o.id]}));
 L.push(...GEN_ACTS.map(g=>Object.assign({},g)));
 if(m){(m.inv||[]).forEach((it,i)=>{if(it.heal&&(it.uses==null||it.uses>0))L.push({id:'i:'+i,e:it.e,l:`${it.n} benutzen`,item:i,gen:1,tag:'heilen'})})}
 return L}
function optHint(o,m){if(o.item!=null)return 'heilt, ohne Wurf';const ai=aIdx(o.a);const b=m?mod(m.st[ai])+(classBonus(m,o)):0;return `${ATTR[ai][1]} ${ATTR[ai][0]} ${b>=0?'+':'−'}${Math.abs(b)} · SW ${o.sw}`}
function classBonus(m,o){const u=unterOf(m);return u&&u[3]===o.a?1:0}

/* ---------- Aktion auflösen (nur Host) ---------- */
function resolve(mid,oid){if(!isHost()||!R||!R.started||R.ended)return null;const m=mem(mid,R);const c=curM(R);if(!m||!c||c.id!==mid)return null;
 const o=availOpts(m,R).find(x=>x.id===oid);if(!o||o.done)return null;
 if(o.item!=null){useItem(m,o.item);endTurn();return {d:null}}
 log('act',`${o.e} ${o.l}`,m);
 const ai=aIdx(o.a),b=mod(m.st[ai]),cb=classBonus(m,o);let d1=d(20),d2=null,dd=d1;const wind=(m.fx||[]).includes('Rückenwind');if(wind){d2=d(20);dd=Math.max(d1,d2);m.fx=m.fx.filter(x=>x!=='Rückenwind')}
 const tot=dd+b+cb;const res=dd===20?'ok':dd===1?'fail':tot>=o.sw?'ok':tot>=o.sw-4?'part':'fail';
 log('roll',`${ATTR[ai][2]}-Probe: W20 ${d2!=null?d1+'|'+d2+' → '+dd+' (Rückenwind)':dd} ${b>=0?'+':'−'}${Math.abs(b)} (${ATTR[ai][0]})${cb?' +1 (Klasse)':''} = ${tot} gegen SW ${o.sw} → ${RESL[res]}${dd===20?' · ✨ Nat 20!':dd===1?' · 😅 Nat 1':''}`,m,{roll:{d:dd,d2:d2!=null?[d1,d2]:null,mod:b+cb,tot,sw:o.sw,res,a:ATTR[ai][0]}});
 if(o.gen)genEffect(m,o,res);else optEffect(m,o,res,dd);
 if(m.kind==='bot'){const b2=BOT[m.bot];if(b2&&d(100)<=70)log('say',pick(b2[res]),m)}
 progressCheck();endTurn();return {d:dd,res}}
function optEffect(m,o,res,dd){const s=scene(),e=encDef();log('gm',fill(pick(o[res]),m),null);
 const fx=o[res+'Fx']||{};applyFx(m,fx);
 if(dd===20){log('gm',`✨ ${first(m.name)} hat einen Glücksmoment: zusätzlich Rückenwind für die nächste Probe!`);m.fx=(m.fx||[]).filter(x=>x!=='Rückenwind').concat('Rückenwind')}
 if(e){const en=e.enemy;if(en){const dm=res==='ok'?(o.dmg||5):res==='part'?Math.ceil((o.dmg||5)/2):0;R.enc.ehp=Math.max(0,R.enc.ehp-dm);if(dm)log('sys',`${en.e} ${en.n}: −${dm} Ausdauer (${R.enc.ehp}/${en.hp})`)}else{R.enc.prog+=(res==='ok'?2:res==='part'?1:0)+(fx.prog||0)}
  if((en&&R.enc.ehp<=0)||(!en&&R.enc.prog>=2)){log('gm',`${e.e} Die Begegnung „${e.t}“ ist überstanden. Ihr setzt euren Weg fort.`);R.enc=null}return}
 if(s.enemy){const dm=res==='ok'?(o.dmg||5):res==='part'?Math.ceil((o.dmg||5)/2):0;R.ehp=Math.max(0,R.ehp-dm);if(dm)log('sys',`${s.enemy.e} ${s.enemy.n}: −${dm} Ausdauer (${R.ehp}/${s.enemy.hp})`)}
 else{R.prog+=(res==='ok'?(dd===20?3:2):res==='part'?1:0)+(fx.prog||0);if(res==='ok')R.done[o.id]=1}}
function applyFx(m,fx){if(fx.hp)hpChange(m,fx.hp);if(fx.hpAll)R.party.forEach(x=>hpChange(x,fx.hpAll));if(fx.item)giveItem(m,fx.item);if(fx.wind==='all'){R.party.forEach(x=>{x.fx=(x.fx||[]).filter(y=>y!=='Rückenwind').concat('Rückenwind')});log('sys','🌬️ Rückenwind für die ganze Gruppe (nächste Probe: 2 W20, der höhere zählt).')}if(fx.wind==='self'){m.fx=(m.fx||[]).filter(y=>y!=='Rückenwind').concat('Rückenwind')}}
function hpChange(m,n){const old=m.hp;m.hp=Math.max(0,Math.min(m.max,m.hp+n));if(m.hp!==old)log('sys',`${n<0?'💥':'💚'} ${m.name}: ${n<0?'−':'+'}${Math.abs(m.hp-old)} TP (${m.hp}/${m.max})`,m);if(m.hp===0&&!(m.fx||[]).includes('Erschöpft')){m.fx=(m.fx||[]).concat('Erschöpft');log('gm',`${first(m.name)} ist erschöpft und setzt eine Runde aus – keine Sorge, in Neon Park wird niemand ernsthaft verletzt.`)}}
function giveItem(m,it){m.inv=m.inv||[];m.inv.push({e:it[0],n:it[1],heal:HEAL[it[1]]||null,uses:HEAL[it[1]]?(it[1]==='Leuchtthermoskanne'?3:1):null});log('loot',`${it[0]} ${m.name} erhält: ${it[1]}`,m)}
function useItem(m,i){const it=m.inv[i];if(!it)return;const tgt=lowest(m)||m;const h=it.heal==='W6'||it.heal==='1W6'?d(6):(+it.heal||1);log('act',`${it.e} benutzt ${it.n}${tgt!==m?' für '+tgt.name:''}`,m);hpChange(tgt,h);if(tgt.hp>0)tgt.fx=(tgt.fx||[]).filter(x=>x!=='Erschöpft');if(it.uses!=null){it.uses--;if(it.uses<=0)m.inv.splice(i,1)}}
function lowest(m){const L=R.party.filter(x=>x.hp<x.max).sort((a,b)=>a.hp/a.max-b.hp/b.max);return L[0]||null}
function genEffect(m,o,res){if(o.id==='g:helfen'){const t=lowest(m)||R.party.find(x=>x!==m)||m;const emp=m.ober==='Empath'?2:0;
  if(res==='ok'){log('gm',`${first(m.name)} kümmert sich um ${first(t.name)}: ein paar aufmunternde Worte, ein Pflaster mit Leuchtmuster – und Rückenwind für die nächste Probe.`);hpChange(t,d(4)+1+emp);t.fx=(t.fx||[]).filter(x=>x!=='Rückenwind'&&x!=='Erschöpft').concat('Rückenwind')}
  else if(res==='part'){log('gm',`${first(m.name)} hilft ${first(t.name)} kurz wieder auf die Beine.`);hpChange(t,1+Math.floor(emp/2))}
  else log('gm',`${first(m.name)} will helfen, stolpert aber über die eigenen Füße. Die Geste zählt!`)}
 if(o.id==='g:umsehen'){log('gm',pick((activeCamp()||K).stimmung));if(res==='ok'){log('gm',`${first(m.name)} entdeckt dabei einen nützlichen Hinweis.`);if(R.enc)R.enc.prog++;else if(!scene().enemy)R.prog++}}}
function progressCheck(){if(R.enc)return;const s=scene();if(!s||s.end||!sceneDone())return;log('gm',pick(s.exit));const fx=s.exitFx||{};if(fx.itemAll)R.party.forEach(m=>giveItem(m,fx.itemAll));if(fx.itemFirst){const m=R.party.find(x=>x.kind==='mensch')||R.party[0];if(m)giveItem(m,fx.itemFirst)}
 const g=R.goals.find(x=>x.id===(s.goal&&s.goal.id));if(g){g.done=true;log('sys',`✅ Ziel erreicht: ${g.t}`)}snd('good');enterScene(s.next)}
function endTurn(){if(!R.order.length)return;let guard=0;do{R.ti=(R.ti+1)%R.order.length;if(R.ti===0){R.round++;log('sys',`🔁 Runde ${R.round} beginnt.`);roundEvents()}const c=curM(R);if(c&&(c.fx||[]).includes('Erschöpft')){c.fx=c.fx.filter(x=>x!=='Erschöpft');c.hp=Math.max(1,c.hp);log('sys',`😮‍💨 ${c.name} verschnauft diese Runde und steht mit ${c.hp} TP wieder auf.`,c);continue}break}while(++guard<12)}
function roundEvents(){const s=scene();if(!s||R.ended||R.enc)return;if(s.enc&&d(100)<=Math.round(s.enc*100)){const e=pick((activeCamp()||K).begegnungen);R.enc={id:e.id,prog:0,ehp:e.enemy?e.enemy.hp:null};log('gm',`${e.e} Begegnung: „${e.t}“\n${pick(e.intro)}`);return}if(d(100)<=40)log('gm',pick((activeCamp()||K).stimmung))}
function skipTurn(){if(!isHost()||!R.started)return;const c=curM(R);if(c)log('sys',`⏭️ ${c.name} setzt diesen Zug aus.`,c);endTurn();commit()}
function sayAs(m,t){t=cleanTxt(t,140);if(!t||!m)return;log('say',t,m);commit()}

/* ---------- KI-Mitspieler ---------- */
function schedule(){clearTimeout(botT);if(!isHost()||!R||!R.started||R.ended||PAUSE)return;const c=curM(R);if(!c||c.kind!=='bot')return;botT=setTimeout(botTurn,SPEED)}
function botTurn(){if(!isHost()||!R||!R.started||R.ended)return;const m=curM(R);if(!m||m.kind!=='bot')return;const b=BOT[m.bot]||BOTS[0];
 const L=availOpts(m,R).filter(o=>!o.done);const hurt=lowest(m);let best=null,bs=-99;
 for(const o of L){let s;if(o.item!=null){s=hurt&&hurt.hp/hurt.max<=0.5?12:-50}else{const ai=aIdx(o.a);s=(mod(m.st[ai])+classBonus(m,o))*2+(b.pref[o.tag]||0)*2-(o.sw-12)+d(6);if(o.id==='g:helfen')s+=hurt&&hurt.hp/hurt.max<=0.5?6:-8;if(o.id==='g:umsehen')s-=4}if(s>bs){bs=s;best=o}}
 if(!best)return skipTurn();
 if(best.item==null&&d(100)<=75)log('say',fill(pick(b.act),m,best.l),m);else if(d(100)<=10)log('say',pick(b.idle),m);
 resolve(m.id,best.id);commit()}

/* ---------- Menschliche Aktion ---------- */
function humanAct(mid,oid){const v=V();const m=mem(mid,v);if(!mine(m))return;const c=curM(v);if(!c||c.id!==mid)return;
 if(MP.role==='client'){if(MP.hostConn&&MP.hostConn.open){MP.hostConn.send({t:'act',mid,opt:oid});BUSY=true;rerender();setTimeout(()=>{BUSY=false;rerender()},4000)}return}
 if(BUSY)return;BUSY=true;const r=resolve(mid,oid);if(!r){BUSY=false;rerender();return}
 const fin=()=>{BUSY=false;commit()};if(r.d!=null&&typeof showDice==='function'){save();showDice(r.d,fin)}else fin()}

/* ---------- Mehrspieler (PeerJS, kostenlos, ohne Konto) ---------- */
const ALPH='ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newCode(){let s='';for(let i=0;i<5;i++)s+=ALPH[d(ALPH.length)-1];return s}
function loadPeer(){return new Promise((res,rej)=>{if(window.Peer)return res();const s=document.createElement('script');s.src='vendor/peerjs.min.js';s.onload=()=>window.Peer?res():rej('PeerJS fehlt');s.onerror=()=>rej('PeerJS konnte nicht geladen werden');document.head.appendChild(s)})}
function mpStatus(t){MP.status=t;rerender()}
async function hostOpen(code){if(MP.peer)return;ensureR();try{await loadPeer()}catch(e){return mpStatus('❌ '+e)}
 code=code||((loadJ(MPKEY)||{}).code)||newCode();MP.role='host';MP.code=code;saveJ(MPKEY,{code});mpStatus('⏳ Online-Tisch wird geöffnet …');
 const p=new Peer('neonpark-'+code.toLowerCase(),{debug:0});MP.peer=p;
 p.on('open',()=>{mpStatus('🟢 Online-Tisch offen');log('sys',`🌐 Online-Tisch ${code} geöffnet.`);commit()});
 p.on('error',e=>{if(e&&e.type==='unavailable-id'){p.destroy();MP.peer=null;saveJ(MPKEY,null);hostOpen(newCode());return}mpStatus('⚠️ Verbindungsproblem: '+(e&&e.type||e))});
 p.on('disconnected',()=>{mpStatus('🟠 Signal-Server getrennt – verbinde neu …');try{p.reconnect()}catch(e){}});
 p.on('connection',c=>{c.on('data',x=>onHostData(c,x));c.on('close',()=>{const id=c._np;if(id){delete MP.conns[id];const m=R.party.find(q=>q.dev===id);if(m){m.online=false;log('sys',`📴 ${m.name} ist offline.`,m);commit()}}})})}
function onHostData(c,x){if(!x||typeof x!=='object')return;
 if(x.t==='hello'){const f=x.fig||{};const id=cleanTxt(x.pid,20).replace(/[^a-z0-9]/gi,'');if(!id||id===ME)return;
  if(!(OBER[f.ober]&&UNTER[f.ober].some(u=>u[1]===f.unter))||!Array.isArray(f.st)||f.st.length!==6||f.st.some(n=>!(n>=3&&n<=20)))return c.send({t:'err',msg:'Figur ungültig.'});
  c._np=id;MP.conns[id]=c;let m=R.party.find(q=>q.dev===id&&q.kind==='mensch');
  if(!m){if(R.party.length>=MAXP){const b=[...R.party].reverse().find(q=>q.kind==='bot');if(b){removeQuiet(b.id);log('sys',`${b.e} ${b.name} macht Platz für einen neuen Mitspieler.`)}else{c.send({t:'full'});return}}
   m=figMember({name:cleanTxt(f.name,30)||'Gast',ober:f.ober,unter:f.unter,st:f.st.map(Number),volk:VOLK[f.volk]?f.volk:'',avatar:AV[f.av]?f.av:'eigener'},id,'mensch',freeColor(R.party));m.id='h:'+id;
   m.inv=(Array.isArray(f.inv)?f.inv:[]).slice(0,12).map(i=>({e:cleanTxt(i.e,4)||'📦',n:cleanTxt(i.n,40),heal:HEAL[cleanTxt(i.n,40)]||null,uses:null}));
   R.party.push(m);if(R.started)R.order.push(m.id);log('sys',`🌐 ${m.name} ist dem Online-Tisch beigetreten.`,m)}else{m.online=true;log('sys',`🌐 ${m.name} ist wieder online.`,m)}
  commit();return}
 const id=c._np;if(!id)return;const m=R.party.find(q=>q.dev===id&&q.kind==='mensch');if(!m)return;
 if(x.t==='act'){const mm=mem(String(x.mid||''),R);if(mm&&mm.dev===id){resolve(mm.id,String(x.opt||''));commit()}}
 if(x.t==='say')sayAs(m,x.text)}
function removeQuiet(id){R.party=R.party.filter(x=>x.id!==id);const oi=R.order.indexOf(id);if(oi>=0){R.order.splice(oi,1);if(oi<R.ti)R.ti--;R.ti=R.order.length?Math.max(0,R.ti)%R.order.length:0}}
function broadcast(){if(MP.role!=='host')return;const pkt={t:'state',R:R,code:MP.code};Object.values(MP.conns).forEach(c=>{try{if(c.open)c.send(pkt)}catch(e){}})}
async function clientJoin(code){code=cleanTxt(code,12).toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4)return mpStatus('❌ Bitte den Tisch-Code eingeben (5 Zeichen).');const f=fig();if(!f)return mpStatus('❌ Erst eine Figur erstellen.');
 try{await loadPeer()}catch(e){return mpStatus('❌ '+e)}hostClose(true);MP.role='client';MP.code=code;mpStatus('⏳ Verbinde mit Tisch '+code+' …');
 const p=new Peer({debug:0});MP.peer=p;
 p.on('open',()=>{const c=p.connect('neonpark-'+code.toLowerCase(),{reliable:true});MP.hostConn=c;
  const to=setTimeout(()=>{if(!c.open)mpStatus('⚠️ Tisch '+code+' nicht erreichbar. Ist der Host online und der Code richtig?')},12000);
  c.on('open',()=>{clearTimeout(to);mpStatus('🟢 Verbunden mit Tisch '+code);c.send({t:'hello',pid:ME,fig:{name:f.name,ober:f.ober,unter:f.unter,st:f.st,volk:f.volk,av:f.avatar||f.id,inv:(S.inv||[]).map(i=>({e:i.e,n:i.n}))}})});
  c.on('data',x=>{if(!x)return;if(x.t==='state'&&x.R&&x.R.format==='np-runde'){G=x.R;saveJ(GKEY,G);BUSY=false;rerender()}if(x.t==='full')mpStatus('🚪 Der Tisch ist voll (5 Plätze).');if(x.t==='kicked')mpStatus('👋 Der Host hat dich aus der Gruppe genommen.');if(x.t==='err')mpStatus('❌ '+cleanTxt(x.msg))});
  c.on('close',()=>mpStatus('📴 Verbindung zum Host getrennt.'))});
 p.on('error',e=>mpStatus(e&&e.type==='peer-unavailable'?'⚠️ Tisch '+code+' nicht gefunden. Ist der Host online?':'⚠️ Verbindungsproblem: '+(e&&e.type||e)))}
function hostClose(quiet){try{if(MP.peer)MP.peer.destroy()}catch(e){}const wasHost=MP.role==='host';MP={role:'solo',code:'',peer:null,conns:{},status:'',hostConn:null};if(wasHost&&R&&!quiet){log('sys','🌐 Online-Tisch geschlossen.');commit()}else rerender()}
function clientSay(t){t=cleanTxt(t,140);if(!t)return;if(MP.role==='client'&&MP.hostConn&&MP.hostConn.open)MP.hostConn.send({t:'say',text:t})}

/* ---------- Teilen ohne Server: Code & Datei ---------- */
function b64e(s){return btoa(unescape(encodeURIComponent(s)))}
function b64d(s){return decodeURIComponent(escape(atob(s)))}
function shareCode(){const v=V();if(!v)return '';const c=Object.assign({},v,{log:v.log.slice(-60)});return 'NPR1:'+b64e(JSON.stringify(c))}
function parseShare(t){t=String(t||'').trim();let o=null;try{if(/^NPR1:/.test(t))o=JSON.parse(b64d(t.slice(5).replace(/\s+/g,'')));else o=JSON.parse(t)}catch(e){return null}if(o&&o.format==='np-runde-export'&&o.runde)o=o.runde;if(!o||o.format!=='np-runde'||!Array.isArray(o.party)||!Array.isArray(o.log))return null;return o}
function viewImport(o){G=o;saveJ(GKEY,G);hostClose(true);MP.role='view';rerender()}
function takeOver(o){if(R&&R.started&&!confirm('Eigene App-Runde auf diesem Gerät durch den eingefügten Spielstand ersetzen?'))return;hostClose(true);R=o;R.party.forEach(m=>{if(m.kind==='mensch'){m.dev=ME;m.online=true}});log('sys','📥 Spielstand übernommen – alle menschlichen Figuren spielen jetzt an diesem Gerät (Hot-Seat).');MP.role='solo';commit()}
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)}
function stamp(){const x=new Date();const p=n=>String(n).padStart(2,'0');return `${x.getFullYear()}-${p(x.getMonth()+1)}-${p(x.getDate())}-${p(x.getHours())}${p(x.getMinutes())}`}
function logText(v,list){const L=list||v.log;const AC=activeCamp();let out=[`Neon Park – App-Runde „${AC?AC.titel:(K?K.titel:'')}“ · Export ${new Date().toLocaleString('de-DE')}`,''];let sc=null,rd=null;
 L.forEach(e=>{if(e.sc!==sc){sc=e.sc;rd=null;out.push('','=== Szene: '+e.st+' ===')}if(e.r!==rd){rd=e.r;out.push('--- Runde '+(e.r||'–')+' ---')}const tm=new Date(e.t).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});const who=e.k==='gm'?'[Erzähler · Neon Omina]':e.n?`[${e.n}]`:'[System]';out.push(`${tm} ${TYP[e.k][0]} ${who} ${e.txt}`)});return out.join('\n')}
function exportTxt(){const v=V();if(!v)return;dl(`neonpark-runde-${stamp()}.txt`,logText(v,filtered(v)),'text/plain;charset=utf-8')}
function exportJson(){const v=V();if(!v)return;dl(`neonpark-runde-${stamp()}.json`,JSON.stringify({format:'np-runde-export',v:1,app:'Neon Park Spieler-Seite',exportiert:new Date().toISOString(),runde:v},null,1),'application/json')}

/* ---------- Rendering: Runde ---------- */
function rerender(){if(!$$('runde'))return;if(!$$('runde').classList.contains('hide'))renderRunde();if(!$$('akt').classList.contains('hide'))renderAkt()}
function show(which){loadK();if(typeof closeAll==='function')closeAll();if(typeof hideScreens==='function')hideScreens();const el=$$(which==='akt'?'akt':'runde');el.classList.remove('hide');document.body.dataset.screen=which==='akt'?'akt':'runde';if(which==='akt')renderAkt();else renderRunde();window.scrollTo(0,0)}
function topBar(){const st=MP.role==='host'?`<span class="npr-badge" style="--c:var(--green)">🌐 Host · ${esc(MP.code)}</span>`:MP.role==='client'?`<span class="npr-badge" style="--c:var(--cyan)">🌐 Gast · ${esc(MP.code)}</span>`:MP.role==='view'?`<span class="npr-badge" style="--c:var(--orange)">👁️ Nur ansehen</span>`:`<span class="npr-badge" style="--c:#ffffff66">📱 Solo / Hot-Seat</span>`;
 const online=MP.role==='host'||MP.role==='client'?`<div class="npr-online" role="status"><b>🌐 Online-Tisch aktiv</b> · ${MP.role==='host'?'Du bist Host – lass die Seite offen.':'Verbunden mit dem Host. Live-Sync per WebRTC.'}</div>`:'';
 return `<div class="npr-brand"><div><b>Neon Park</b><br><small>App-Runde</small></div></div><div class="npr-top"><button class="btn small" style="--c:#ffffff55" data-npr="menu">🏠 Hauptmenü</button>${st}</div>${online}`}
function feedHtml(L,full){return L.map(e=>entryHtml(e)).join('')}
function entryHtml(e){const c=e.k==='gm'?NARR.c:col(e.c||'#9aa');const tm=new Date(e.t).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});const ty=TYP[e.k]||TYP.sys;
 const who=e.k==='gm'?`<span class="npr-av" style="--c:${NARR.c}" aria-hidden="true">🔮</span>Neon Omina <span class="typ">${ty[0]} Erzähler</span>`:e.n?`${e.e?`<span class="npr-av" style="--c:${c}" aria-hidden="true">${esc(e.e)}</span>`:(e.a&&AV[e.a]?`<img class="npr-av" style="--c:${c}" src="${AV[e.a]}" alt="">`:`<span class="npr-av" style="--c:${c}" aria-hidden="true">${esc(first(e.n).slice(0,1))}</span>`)}${esc(e.n)} <span class="typ">${ty[0]} ${ty[1]}</span>`:`<span class="typ">${ty[0]} ${ty[1]}</span>`;
 let ex='';if(e.roll){const r=e.roll;ex=`<div class="npr-roll"><span class="npr-die${r.d===20?' n20':r.d===1?' n1':''}" aria-label="Würfel ${r.d}">${r.d}</span><span>${r.mod>=0?'+':'−'}${Math.abs(r.mod)} = <b>${r.tot}</b> vs SW ${r.sw}</span><span class="npr-res ${r.res}">${RESL[r.res]}</span></div>`}
 return `<li class="npr-e ${e.k}" style="--c:${c}" data-k="${e.k}"><div class="who">${who}<time>${tm}</time></div>${e.roll?ex:`<div class="txt">${esc(e.txt)}</div>`}${e.roll?`<div class="txt" style="font-size:13px;color:var(--muted)">${esc(e.txt)}</div>`:''}</li>`}
function memCard(m,v,ctrl){const cur=curM(v);const pct=Math.round(100*m.hp/m.max);const st=[];if((m.fx||[]).length)st.push(...m.fx.map(x=>x==='Rückenwind'?'🌬️ Rückenwind':x==='Erschöpft'?'😮‍💨 Erschöpft':esc(x)));
 const tag=m.kind==='bot'?'🤖 KI-Mitspieler':m.dev===ME?(m.hot?'🪑 Hot-Seat (dieses Gerät)':'⭐ Du'):(m.online===false?'📴 offline':'🌐 online');
 return `<div class="npr-mem" style="--c:${col(m.color)}">${avHtml(m,true)}<div class="grow"><div class="nm">${esc(m.name)} ${m.kind==='bot'?esc(m.e||''):''}${cur&&cur.id===m.id?' <span class="npr-badge" style="--c:var(--cyan)">🎯 am Zug</span>':''}</div><small>${clsTxt(m)}</small><small>${tag}${st.length?' · '+st.join(' · '):''}</small>
 <div class="npr-hp" role="progressbar" aria-label="Trefferpunkte ${esc(m.name)}" aria-valuenow="${m.hp}" aria-valuemax="${m.max}"><i style="width:${pct}%"></i></div><small>❤️ ${m.hp} / ${m.max} TP</small></div>${ctrl&&isHost()&&!(m.own)?`<button class="x" data-rm="${esc(m.id)}" aria-label="${esc(m.name)} entfernen" title="Entfernen">✖</button>`:''}</div>`}
function orderHtml(v){const cur=curM(v);return `<div class="npr-order" role="list" aria-label="Zugreihenfolge">${v.order.map(id=>{const m=mem(id,v);if(!m)return '';const a=cur&&cur.id===id;return `<div class="npr-oc${a?' cur':''}" role="listitem" style="--c:${col(m.color)}" ${a?'aria-current="step"':''}>${avHtml(m)}<span>${esc(mine(m)&&!m.hot?'Du':first(m.name))}</span>${a?'<em>dran</em>':''}</div>`}).join('<span aria-hidden="true" style="align-self:center;color:#ffffff66">›</span>')}</div>`}
function renderRunde(){const el=$$('runde');const v=V();let h=topBar();
 h+=`<h1>🔮 App-Runde mit Neon Omina</h1>`;
 if(!K){h+=`<p class="note">${KERR&&KERR!=='lädt'?esc(KERR):'⏳ Kampagne wird geladen …'}</p>`;el.innerHTML=h;wire(el);return}
 if(!fig()&&MP.role!=='view'){h+=`<p class="honest">Für die App-Runde brauchst du zuerst eine Figur. Danach kommst du über das Hauptmenü hierher zurück.</p><button class="btn big" style="--c:var(--pink)" data-npr="newfig">✨ Figur erstellen</button>${mpPanel()}`;el.innerHTML=h;wire(el);return}
 if(isHost()&&fig()){if(!R)ensureR();else if(!R.started)syncMe()}
 if(!V()||!V().started){h+=setupHtml(V());el.innerHTML=h;wire(el);return}
 const s=scene();const e=encDef();const c=curM(v);
 h+=`<div class="row" style="gap:8px"><button class="btn" style="--c:var(--cyan)" data-npr="akt">📋 Activities: Stand & Historie</button></div>`;
 h+=`<section class="npr-scene" aria-label="Aktuelle Szene"><div class="npr-ort"><span>${s?esc(s.oe):''} Ort: <b>${s?esc(s.ort):'–'}</b></span><span>🔁 Runde <b>${v.round}</b></span><span>📖 ${esc((activeCamp()||K).titel)}</span></div><h2>${s?esc(s.t):''}</h2>`+
  (s&&s.goal?`<div class="npr-goal">🎯 Ziel: ${esc(s.goal.t)}${!s.enemy&&!e?` <span class="tip">(Fortschritt ${Math.min(v.prog,need())}/${need()})</span>`:''}</div>`:'')+
  (s&&s.enemy&&!e?`<div class="npr-enemy">${esc(s.enemy.e)} <b>${esc(s.enemy.n)}</b> · Ausdauer ${v.ehp}/${s.enemy.hp}<div class="npr-hp"><i style="width:${Math.round(100*v.ehp/s.enemy.hp)}%"></i></div></div>`:'')+
  (e?`<div class="npr-enemy" style="border-color:var(--violet);background:#a78bfa1a">${esc(e.e)} <b>Begegnung: ${esc(e.t)}</b>${e.enemy?` · Ausdauer ${v.enc.ehp}/${e.enemy.hp}`:''}</div>`:'')+
  `<ul class="npr-feed" aria-live="polite">${feedHtml(v.log.slice(-6))}</ul></section>`;
 if(!v.ended)h+=orderHtml(v);
 if(v.ended){h+=`<div class="npr-turn" style="--c:var(--gold)"><h3>🌈 Abenteuer geschafft!</h3><p>Danke fürs Spielen. Die ganze Geschichte findest du unter 📋 Activities → Historie (auch als Text/JSON exportierbar).</p>${isHost()?'<button class="btn" style="--c:var(--pink)" data-npr="reset">🔁 Neues Abenteuer vorbereiten</button>':''}</div>`}
 else if(c){if(mine(c)&&MP.role!=='view'){const L=availOpts(c,v);h+=`<div class="npr-turn" style="--c:${col(c.color)}" role="region" aria-label="Dein Zug"><h3>🎯 ${c.hot?esc(c.name)+' ist dran (an diesem Gerät)':'Du bist dran, '+esc(first(c.name))+'!'}</h3><p class="tip">Tippe auf eine Aktion. Neon Omina würfelt und erzählt, was passiert. ✅ Erfolg · ◐ Teilerfolg · ✖ Fehlschlag.</p>
   <div class="npr-opts">${L.map(o=>`<button class="npr-opt${o.done?' done':''}" style="--c:${o.gen?'var(--violet)':'var(--cyan)'}" data-opt="${esc(o.id)}" data-mid="${esc(c.id)}" ${o.done||BUSY?'disabled':''}><span aria-hidden="true">${esc(o.e)}</span>${esc(o.l)}<small>${o.done?'✅ schon geschafft':esc(optHint(o,c))}</small></button>`).join('')}</div>
   ${isHost()?'<div class="row" style="margin-top:8px"><button class="btn small" style="--c:#ffffff55" data-npr="skip">⏭️ Zug aussetzen</button></div>':''}</div>`}
  else if(c.kind==='bot'){h+=`<div class="npr-turn" style="--c:${col(c.color)}"><h3 class="npr-think">${esc(c.e)} ${esc(c.name)} überlegt …</h3><p class="tip">KI-Mitspieler (regelbasiert, ohne Internet) wählt gleich selbst eine Aktion.</p>${isHost()?`<div class="row"><button class="btn small" style="--c:var(--cyan)" data-npr="botnow">▶️ Jetzt</button><button class="btn small" style="--c:var(--orange)" data-npr="pause" aria-pressed="${PAUSE}">${PAUSE?'▶️ KI fortsetzen':'⏸️ KI pausieren'}</button></div>`:''}</div>`}
  else h+=`<div class="npr-turn" style="--c:${col(c.color)}"><h3>⏳ ${esc(c.name)} ist dran${c.online===false?' (offline)':''}</h3><p class="tip">${MP.role==='client'?'Warte kurz – du siehst alles live.':'Wartet auf die Aktion vom Gerät dieser Person.'}</p>${isHost()?'<button class="btn small" style="--c:#ffffff55" data-npr="skip">⏭️ Zug überspringen</button>':''}</div>`}
 const me=myMember(v);if(me&&MP.role!=='view')h+=`<div class="npr-say"><label class="vh" for="nprSay">Etwas sagen</label><input type="text" id="nprSay" maxlength="140" placeholder="💬 ${esc(first(me.name))} sagt … (kostet keinen Zug)"><button class="btn small" style="--c:var(--pink)" data-npr="say">💬 Sagen</button></div>`;
 h+=`<details class="npr-panel" style="--c:var(--gold)"><summary><b>👥 Gruppe (${v.party.length}/${MAXP})</b></summary>${v.party.map(m=>memCard(m,v,true)).join('')}${isHost()?groupBtns(v):''}</details>`;
 h+=mpPanel()+sharePanel();el.innerHTML=h;wire(el)}
function groupBtns(v){const free=MAXP-v.party.length;const pg=FIGS.filter(p=>!v.party.some(m=>m.id==='h:'+ME+':'+p.id)&&!(fig()&&fig().id===p.id));return `<div class="row" style="margin-top:6px"><button class="btn" style="--c:var(--green)" data-npr="fill" ${free<=0?'disabled':''}>🤖 Gruppe mit KI-Spielern auffüllen${free>0?' (+'+free+')':' (voll)'}</button>${v.party.some(m=>m.kind==='bot')?'<button class="btn small" style="--c:var(--red)" data-npr="nobots">🧹 Alle KI entfernen</button>':''}</div>
 ${free>0&&pg.length?`<div class="row" style="margin-top:8px"><select id="nprHot" style="flex:1;width:auto" aria-label="Fertige Figur für Hot-Seat">${pg.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.unter)}</option>`).join('')}</select><button class="btn small" style="--c:var(--cyan)" data-npr="hot">🪑 Mitspieler an diesem Gerät</button></div>`:''}
 ${fig()&&v.party.some(m=>m.id==='h:'+ME)?'':fig()&&free>0?'<button class="btn small" style="--c:var(--pink);margin-top:8px" data-npr="addme">⭐ Meine Figur hinzufügen</button>':''}<p class="tip">Ziel: 5er-Gruppe. KI-Mitspieler handeln selbst (regelbasiert, ohne Internet) und sind jederzeit mit ✖ entfernbar.</p>`}
function diffBadge(s){const m={leicht:['var(--green)','leicht'],mittel:['var(--orange)','mittel'],knifflig:['var(--red)','knifflig']};const x=m[s]||['var(--cyan)',s||'?'];return `<span class="npr-diff" style="--c:${x[0]}">${esc(x[1])}</span>`}
function modePickerHtml(){return `<section class="npr-scene" aria-label="Spielmodus wählen"><div class="npr-ort"><span>🔮 App-Runde</span><span>Neon Omina im Gerät</span></div><h2>Wie wollt ihr spielen?</h2><p class="tip">Beide Modi nutzen denselben Spielleiter im Browser – ohne KI-Dienst, ohne Kosten. Figur-TP im Charakterbogen und HP in der App-Runde sind getrennt.</p>
 <div class="npr-modes">
  <button class="npr-mode" style="--c:var(--cyan)" data-npr="mode-schnell"><span aria-hidden="true">⚡</span><b>Schnelles Spiel</b><small>Kurz-Quest · ca. 15–25 Min. · 3 Szenarien zur Wahl</small></button>
  <button class="npr-mode" style="--c:var(--gold)" data-npr="mode-lang"><span aria-hidden="true">📜</span><b>Langes Spiel</b><small>${esc(K.titel)} · ${esc(K.dauer)} · volle Kampagne</small></button>
 </div></section>`+mpPanel()+sharePanel()}
function questPickerHtml(){const L=offerQuests();let h=`<section class="npr-scene"><div class="npr-ort"><span>⚡ Schnelles Spiel</span><span>3 von ${(K.kurzquests||[]).length} Quests</span></div><h2>Welche Kurz-Quest?</h2><p class="tip">Zufällig aus dem Pool. Tippe auf eine Karte – danach Gruppe auffüllen und starten.</p></section>`;
 h+=`<div class="npr-quests" role="list">${L.map(q=>`<button class="npr-quest" style="--c:var(--cyan)" data-npr="quest" data-qid="${esc(q.id)}" role="listitem"><span class="qe" aria-hidden="true">${esc(q.e||'⚡')}</span><div class="grow"><b>${esc(q.titel)}</b><p>${esc(q.kurz)}</p><div class="npr-qmeta"><span>⏱️ ${esc(q.dauer||'ca. 15–25 Min.')}</span>${diffBadge(q.schwierigkeit)}${(q.tags||[]).slice(0,2).map(t=>`<span class="npr-tag">${esc(t)}</span>`).join('')}</div></div></button>`).join('')}</div>`;
 h+=`<div class="row" style="margin-top:10px"><button class="btn small" style="--c:#ffffff55" data-npr="reroll">🎲 Andere 3 ziehen</button><button class="btn small" style="--c:var(--violet)" data-npr="mode-back">↩️ Modus wechseln</button></div>`;
 return h+mpPanel()+sharePanel()}
function setupHtml(v){const r=v||{party:[]};
 if(MP.role==='client'||MP.role==='view'){const C=activeCamp()||K;let h=`<section class="npr-scene"><div class="npr-ort"><span>📖 ${r.mode==='schnell'?'Kurz-Quest':'Kampagne'}</span><span>⏱️ ${esc(C.dauer)}</span></div><h2>${esc(C.titel)}</h2><p>${esc(C.kurz)}</p></section>`;
  h+=`<div class="npr-panel" style="--c:var(--cyan)"><h3>👥 Gruppe am Tisch</h3>${r.party.map(m=>memCard(m,r,false)).join('')||'<p class="tip">Noch keine Daten vom Host.</p>'}<p class="tip">⏳ Warte, bis der Host das Abenteuer startet.</p></div>`+mpPanel()+sharePanel();return h}
 if(!r.mode)return modePickerHtml();
 if(r.mode==='schnell'&&!r.questId)return questPickerHtml();
 const C=activeCamp()||K;const modeL=r.mode==='schnell'?`⚡ Schnelles Spiel`:`📜 Langes Spiel`;
 let h=`<section class="npr-scene"><div class="npr-ort"><span>${modeL}</span><span>⏱️ ${esc(C.dauer)}</span>${r.mode==='schnell'?diffBadge((questOf(r.questId)||{}).schwierigkeit):''}</div><h2>${esc(C.titel)}</h2><p>${esc(C.kurz)}</p><p class="tip">🔮 Neon Omina erzählt hier direkt im Browser – regelbasiert, ohne KI-Dienst, ohne Kosten. ${esc(C.regeln||K.regeln)}</p>
 <div class="row"><button class="btn small" style="--c:#ffffff55" data-npr="mode-back">↩️ Modus / Quest wechseln</button></div></section>`;
 h+=`<div class="npr-panel" style="--c:var(--gold)"><h3>👥 Eure Gruppe (${r.party.length}/${MAXP})</h3><p class="tip">Freunde einladen (Online-Tisch) oder mit KI-Mitspielern auffüllen – dann starten.</p>${r.party.map(m=>memCard(m,r,true)).join('')}${groupBtns(r)}</div>`;
 h+=`<div class="npr-online" role="note"><b>📌 Kurz notiert:</b> Online-Host muss die Seite offen lassen. Figur-TP (Charakterbogen) und Runden-HP sind getrennt – in der App-Runde zählen die HP der Gruppenkarten.</div>`;
 h+=`<button class="btn full big" style="--c:var(--pink);margin-top:6px" data-npr="start">▶️ Abenteuer starten</button>`;
 return h+mpPanel()+sharePanel()}
function mpPanel(){let h=`<div class="npr-panel" style="--c:var(--cyan)"><h3>🌐 Mehrspieler (kostenlos, ohne Konto)</h3>`;
 if(MP.role==='host'){const link=(/^https?:$/.test(location.protocol)?location.origin+location.pathname:'')+'#mp='+MP.code;h+=`<p>Tisch-Code:</p><p><span class="npr-code" id="nprCode">${esc(MP.code)}</span></p><p class="tip">${esc(MP.status)}</p><div class="row"><button class="btn small" style="--c:var(--cyan)" data-npr="cplink" data-link="${esc(link)}">🔗 Einladungslink kopieren</button><button class="btn small" style="--c:var(--red)" data-npr="close">⛔ Tisch schließen</button></div><p class="tip">Dein Gerät ist die Quelle der Wahrheit: Es würfelt, erzählt und schickt den Stand live an alle (WebRTC, direkt zwischen den Geräten). ⚠️ Lass diese Seite offen – lädst du neu, tippen Gäste „🔄 Neu verbinden“ (gleicher Code).</p>`}
 else if(MP.role==='client'){h+=`<p>${esc(MP.status)}</p><div class="row"><button class="btn small" style="--c:var(--cyan)" data-npr="rejoin">🔄 Neu verbinden</button><button class="btn small" style="--c:var(--red)" data-npr="close">🚪 Tisch verlassen</button></div>`}
 else{h+=`${MP.status?`<p>${esc(MP.status)}</p>`:''}<div class="row"><button class="btn" style="--c:var(--green)" data-npr="host">🌐 Online-Tisch öffnen (Host)</button></div><label class="f" for="nprJoin">Tisch-Code vom Host</label><div class="row"><input type="text" id="nprJoin" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="z. B. K7Q2M" style="flex:1;width:auto;text-transform:uppercase;letter-spacing:2px" value="${esc(PENDING||'')}"><button class="btn small" style="--c:var(--cyan)" data-npr="join">🚪 Beitreten</button></div><p class="tip">🔒 Verbindung direkt zwischen den Geräten (WebRTC). Nur zum Finden der Geräte wird der kostenlose PeerJS-Vermittlungsserver genutzt (sieht Tisch-Code und IP-Adresse, keine Spielinhalte). Übertragen werden nur Figurname, Volk, Klasse, Werte und Standard-Avatar – keine eigenen Bilder.</p>`}
 return h+'</div>'}
function sharePanel(){return `<details class="npr-panel" style="--c:var(--violet)"><summary><b>📤 Ohne Internet teilen (Code / Datei)</b></summary><p class="tip">Fallback: Spielstand als Code in den Chat kopieren oder als Datei schicken. Andere fügen ihn hier ein und sehen denselben Stand.</p><div class="row"><button class="btn small" style="--c:var(--violet)" data-npr="cpcode">📋 Spielstand-Code kopieren</button><button class="btn small" style="--c:var(--violet)" data-npr="json">💾 Als Datei (.json)</button></div><label class="f" for="nprImp">Code einfügen</label><textarea id="nprImp" style="min-height:70px" placeholder="NPR1:…"></textarea><div class="row"><button class="btn small" style="--c:var(--cyan)" data-npr="view">👁️ Ansehen</button><button class="btn small" style="--c:var(--orange)" data-npr="take">📥 Übernehmen & weiterspielen</button><label class="btn small" style="--c:var(--green)" for="nprFile">📂 Datei laden</label><input type="file" id="nprFile" accept=".json,application/json" class="vh"></div><p id="nprImpMsg" class="tip" aria-live="polite"></p>${MP.role==='view'?'<button class="btn small" style="--c:#ffffff55" data-npr="unview">↩️ Zurück zu meiner eigenen Runde</button>':''}</details>`}

/* ---------- Rendering: Activities ---------- */
function filtered(v){return v.log.filter(e=>(FILT==='alle'||(FILT==='gm'?e.k==='gm':e.w===FILT))&&(!ONLYROLL||e.k==='roll'))}
function renderAkt(){const el=$$('akt');const v=V();let h=topBar()+`<h1>📋 Activities</h1>`;
 if(!v||!v.party){h+=`<p class="note">Noch keine App-Runde. Starte eine unter 🔮 App-Runde.</p><button class="btn" style="--c:var(--pink)" data-npr="runde">🔮 Zur App-Runde</button>`;el.innerHTML=h;wire(el);return}
 h+=`<div class="npr-tabs" role="tablist" aria-label="Activities"><button role="tab" id="tabStand" aria-selected="${TAB==='stand'}" aria-controls="aktPanel" data-tab="stand"><span aria-hidden="true">📍</span>Aktueller Stand</button><button role="tab" id="tabHist" aria-selected="${TAB==='hist'}" aria-controls="aktPanel" data-tab="hist"><span aria-hidden="true">📜</span>Historie</button></div>`;
 h+=`<div id="aktPanel" role="tabpanel" aria-labelledby="${TAB==='stand'?'tabStand':'tabHist'}">`+(TAB==='stand'?standHtml(v):histHtml(v))+'</div>';
 h+=`<div class="row" style="margin-top:12px"><button class="btn" style="--c:var(--pink)" data-npr="runde">🔮 Zurück zur App-Runde</button></div>`;
 el.innerHTML=h;wire(el)}
function standHtml(v){const C=activeCamp();const s=C?C.szenen.find(x=>x.id===v.scene):null;const c=curM(v);const me=myMember(v);let h='';
 h+=`<section class="npr-scene"><div class="npr-ort"><span>${s?esc(s.oe):'🧭'} Ort: <b>${s?esc(s.ort):'noch nicht gestartet'}</b></span><span>🔁 Runde <b>${v.started?v.round:'–'}</b></span></div><h2>🎬 ${s?esc(s.t):'Vorbereitung'}</h2>`+
  (c&&v.started&&!v.ended?`<div class="row" style="margin-top:6px">${avHtml(c)}<b>🎯 Am Zug: ${esc(c.name)}</b>${mine(c)?' <span class="npr-badge" style="--c:var(--cyan)">⭐ das bist du</span>':''}</div>`:v.ended?'<p>🌈 Abenteuer abgeschlossen.</p>':'')+'</section>';
 if(me)h+=`<div class="npr-panel" style="--c:${col(me.color)}"><h3>⭐ Meine Figur</h3>${memCard(me,v,false)}<h3 style="margin-top:8px">🎒 Inventar</h3>${invHtml(me)}</div>`;
 h+=`<div class="npr-panel" style="--c:var(--green)"><h3>🎯 Offene Ziele</h3><ul class="npr-goals">${v.goals.length?v.goals.map(g=>`<li class="${g.done?'done':''}"><span aria-hidden="true">${g.done?'✅':'⬜'}</span><span><span class="vh">${g.done?'erledigt: ':'offen: '}</span>${esc(g.t)}</span></li>`).join(''):'<li>Noch keine Ziele – das Abenteuer hat noch nicht begonnen.</li>'}</ul></div>`;
 h+=`<div class="npr-panel" style="--c:var(--gold)"><h3>👥 Gruppe · HP & Status</h3>${v.order.length&&!v.ended?orderHtml(v):''}${v.party.map(m=>memCard(m,v,false)+`<details style="margin:-4px 0 10px 12px"><summary>🎒 Inventar von ${esc(first(m.name))} (${(m.inv||[]).length})</summary>${invHtml(m)}</details>`).join('')}</div>`;
 return h}
function invHtml(m){return (m.inv||[]).length?`<ul class="npr-goals">${m.inv.map(i=>`<li><span aria-hidden="true">${esc(i.e)}</span><span>${esc(i.n)}${i.heal?` <small class="tip">· heilt ${esc(i.heal)}${i.uses!=null?' · '+i.uses+'×':''}</small>`:''}</span></li>`).join('')}</ul>`:'<p class="tip">leer</p>'}
function histHtml(v){const L=filtered(v);let h=`<p class="tip">Vollständiges Protokoll, sortiert nach Szene und Runde. Jede Figur hat eine eigene Farbe <b>und</b> Namen/Symbol; Würfe sind als Würfelkästchen mit Ergebnis-Label markiert.</p>`;
 h+=`<div class="npr-legend" aria-label="Legende"><span>🔮 Erzähler</span><span>💬 sagt</span><span>▶️ Aktion</span><span>🎲 Wurf</span><span>🎁 Fund</span><span>⚙️ System</span><span>✅ Erfolg</span><span>◐ Teilerfolg</span><span>✖ Fehlschlag</span></div>`;
 h+=`<div class="npr-legend" aria-hidden="false"><span class="lg-gm">🔮 Erzähler (Lila-Rand)</span><span class="lg-fig">👤 Figuren (eigene Farben)</span><span>🎲 Würfe · 💬 Dialog</span></div>`;
 h+=`<div class="npr-filter" role="group" aria-label="Nach Figur filtern"><button data-f="alle" aria-pressed="${FILT==='alle'}" style="--c:#ffffff">👥 Alle</button><button data-f="gm" aria-pressed="${FILT==='gm'}" style="--c:${NARR.c}">🔮 Erzähler</button>${v.party.map(m=>`<button data-f="${esc(m.id)}" aria-pressed="${FILT===m.id}" style="--c:${col(m.color)}">${m.kind==='bot'?esc(m.e):'👤'} ${esc(first(m.name))}</button>`).join('')}</div>`;
 h+=`<label class="row" style="gap:10px;margin:4px 0 8px"><input type="checkbox" id="nprOnlyRoll" ${ONLYROLL?'checked':''} style="width:26px;height:26px"> 🎲 Nur Würfelwürfe zeigen</label>`;
 h+=`<div class="row"><button class="btn small" style="--c:var(--cyan)" data-npr="txt">📄 Export als Text</button><button class="btn small" style="--c:var(--violet)" data-npr="json">🧾 Export als JSON</button><span class="tip">${L.length} Einträge</span></div>`;
 let sc=null,rd=null,out='';L.forEach(e=>{if(e.sc!==sc){if(sc!==null)out+='</ul>';sc=e.sc;rd=null;out+=`<h3 class="npr-sec">🎬 Szene: ${esc(e.st)}</h3><ul class="npr-feed">`}if(e.r!==rd){rd=e.r;out+=`<li class="npr-rd">🔁 ${e.r?'Runde '+e.r:'Vorbereitung'}</li>`}out+=entryHtml(e)});if(sc!==null)out+='</ul>';
 return h+(out||'<p class="tip">Keine Einträge für diesen Filter.</p>')}

/* ---------- Events ---------- */
let PENDING='';
function wire(el){el.querySelectorAll('[data-npr]').forEach(b=>b.onclick=()=>act(b.dataset.npr,b));
 el.querySelectorAll('[data-opt]').forEach(b=>b.onclick=()=>humanAct(b.dataset.mid,b.dataset.opt));
 el.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{const m=mem(b.dataset.rm,R);if(m&&(m.kind==='bot'||confirm(m.name+' aus der Gruppe nehmen?')))removeM(b.dataset.rm)});
 el.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{TAB=b.dataset.tab;renderAkt();const t=$$(TAB==='stand'?'tabStand':'tabHist');if(t)t.focus()});
 el.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{FILT=b.dataset.f;renderAkt()});
 const o=$$('nprOnlyRoll');if(o)o.onchange=()=>{ONLYROLL=o.checked;renderAkt()};
 const sy=$$('nprSay');if(sy)sy.onkeydown=e=>{if(e.key==='Enter')act('say')};
 const fi=$$('nprFile');if(fi)fi.onchange=async()=>{const f=fi.files&&fi.files[0];if(!f)return;if(f.size>3e6){$$('nprImpMsg').textContent='❌ Datei zu groß.';return}const o2=parseShare(await f.text());if(!o2){$$('nprImpMsg').textContent='❌ Keine gültige App-Runden-Datei.';return}viewImport(o2)}}
function act(k,b){const v=V();
 if(k==='menu'){if(typeof SCR!=='undefined'){SCR='menu';show2()}return}
 if(k==='akt'){SCR='akt';show2();return}if(k==='runde'){SCR='runde';show2();return}
 if(k==='newfig'){SCR=null;if(typeof wizNew==='function'){wizNew()}show2();return}
 if(k==='fill')return fillBots();if(k==='nobots')return removeBots();if(k==='hot')return addHot($$('nprHot').value);
 if(k==='addme'){const m=meMember(R.party);if(m&&!R.party.some(x=>x.id===m.id)){R.party.unshift(m);if(R.started)R.order.push(m.id);commit()}return}
 if(k==='mode-schnell')return setMode('schnell');if(k==='mode-lang')return setMode('lang');
 if(k==='mode-back'){ensureR();R.mode=null;R.questId=null;R.questOffer=null;commit();return}
 if(k==='reroll'){ensureR();R.questOffer=null;R.questId=null;commit();return}
 if(k==='quest'){const id=b&&b.dataset&&b.dataset.qid;return pickQuest(id)}
 if(k==='start')return start();if(k==='skip')return skipTurn();
 if(k==='botnow'){clearTimeout(botT);return botTurn()}if(k==='pause'){PAUSE=!PAUSE;if(!PAUSE)schedule();else clearTimeout(botT);return rerender()}
 if(k==='reset'){if(!confirm('Neues Abenteuer vorbereiten? Die Gruppe bleibt, die Historie wird geleert (vorher ggf. exportieren). Danach wählst du erneut Schnelles oder Langes Spiel.'))return;const p=R.party;p.forEach(m=>{m.hp=m.max;m.fx=[]});R=newR();R.party=p;commit();return}
 if(k==='say'){const i=$$('nprSay');const t=i&&i.value;if(!t||!t.trim())return;const me=myMember(v);if(MP.role==='client')clientSay(t);else sayAs(curM(R)&&mine(curM(R))?curM(R):me,t);if(i)i.value='';snd('tap');return}
 if(k==='host')return hostOpen();if(k==='close'){if(MP.role==='client'){G=null;saveJ(GKEY,null)}return hostClose()}
 if(k==='join'){const c=$$('nprJoin').value;PENDING=c;return clientJoin(c)}if(k==='rejoin')return clientJoin(MP.code);
 if(k==='cplink'){copy(b.dataset.link,b);return}
 if(k==='cpcode'){copy(shareCode(),b);return}if(k==='json')return exportJson();if(k==='txt')return exportTxt();
 if(k==='view'||k==='take'){const o=parseShare($$('nprImp').value);if(!o){$$('nprImpMsg').textContent='❌ Kein gültiger Spielstand-Code (beginnt mit NPR1:).';return}return k==='view'?viewImport(o):takeOver(o)}
 if(k==='unview'){MP.role='solo';G=null;rerender();return}}
function copy(t,b){const done=ok=>{if(b){const o=b.textContent;b.textContent=ok?'✅ Kopiert':'Bitte manuell kopieren';setTimeout(()=>b.textContent=o,1600)}};if(typeof copyText==='function')copyText(t).then(done);else{navigator.clipboard.writeText(t).then(()=>done(true),()=>done(false))}}
function show2(){if(typeof window.show==='function')window.show()}

/* ---------- Start ---------- */
function boot(){const go=w=>()=>{if(typeof snd==='function')snd('step');SCR=w;window.show()};[['mRunde','runde'],['mAkt','akt'],['toRunde','runde'],['moreRunde','runde'],['moreAkt','akt']].forEach(([id,w])=>{const b=$$(id);if(b)b.onclick=go(w)});
 const h=new URLSearchParams(location.hash.slice(1));const c=h.get('mp');if(c){PENDING=c.toUpperCase();try{sessionStorage.setItem('neonpark-mp-join',PENDING)}catch(e){}}else{try{PENDING=sessionStorage.getItem('neonpark-mp-join')||''}catch(e){}}
 if(h.get('speed'))SPEED=Math.max(50,+h.get('speed')||SPEED);
 if(PENDING&&fig()&&typeof SCR!=='undefined'){SCR='runde';window.show()}
 if(h.get('screen')==='runde'||h.get('screen')==='akt'){SCR=h.get('screen');window.show()}
 loadK()}
window.NPR={show,boot,rerender,_:{get R(){return R},get G(){return G},MP:()=>MP,fillBots,start,resolve,BOTS,activeCamp,setMode,pickQuest}};
document.addEventListener('DOMContentLoaded',boot);
window.addEventListener('hashchange',()=>{const c=new URLSearchParams(location.hash.slice(1)).get('mp');if(c&&typeof fig==='function'&&fig()){PENDING=c.toUpperCase();try{sessionStorage.setItem('neonpark-mp-join',PENDING)}catch(e){}SCR='runde';window.show()}});
})();
