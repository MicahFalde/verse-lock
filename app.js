const V=[["John 3:16","For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.","KJV"],
["Psalm 46:10","Be still, and know that I am God.","KJV"],["Philippians 4:13","I can do all things through Christ which strengtheneth me.","KJV"],
["Proverbs 3:5","Trust in the LORD with all thine heart; and lean not unto thine own understanding.","KJV"],
["Romans 8:28","We know that all things work together for good for those who love God, for those who are called according to his purpose.","WEB"],
["Matthew 11:28","Come to me, all you who labor and are heavily burdened, and I will give you rest.","WEB"],
["Joshua 1:9","Be strong and courageous. Don't be afraid. Don't be dismayed, for Yahweh your God is with you wherever you go.","WEB"],
["Psalm 119:105","Thy word is a lamp unto my feet, and a light unto my path.","KJV"]];
const FREE=3,today=()=>new Date().toISOString().slice(0,10);
let S=JSON.parse(localStorage.vl||'null')||{intention:'',streak:0,last:null,unlockedUntil:0,pro:false,graceUsed:false,
 cards:{},log:[],rem:{Prayer:'07:00',"Bible reading":'21:00',Gratitude:'20:00',Fasting:''}};
const save=()=>localStorage.vl=JSON.stringify(S),$=h=>document.getElementById('app').innerHTML=h;
const card=i=>S.cards[i]||(S.cards[i]={box:0,due:today()});
function dueVerses(){const n=S.pro?V.length:FREE;return V.slice(0,n).map((v,i)=>i).filter(i=>card(i).due<=today())}
function complete(kind){const t=today();if(S.last!==t){const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
 if(S.last===y)S.streak++;else if(S.last&&!S.graceUsed&&S.last===new Date(Date.now()-1728e5).toISOString().slice(0,10)){S.streak++;S.graceUsed=true}else S.streak=1;S.last=t}
 S.log.push({t:Date.now(),kind});S.unlockedUntil=Date.now()+15*60e3;save();home('Unlocked for 15 minutes. Go in peace.')}
function nav(){return `<nav><button class=q onclick=home()>Home</button><button class=q onclick=gate()>Locked app</button><button class=q onclick=verses()>Verses</button><button class=q onclick=rem()>Reminders</button><button class=q onclick=pay()>${S.pro?'Pro ✓':'Upgrade'}</button></nav>`}
function home(msg=''){const lock=Date.now()<S.unlockedUntil?'Unlocked':'Locked';
$(`<h1>VerseLock</h1>${nav()}${msg?`<div class=card>${msg}</div>`:''}<div class=card><div class=big>${S.streak} day${S.streak==1?'':'s'}</div><div class=muted>streak · one free grace day per streak ${S.graceUsed?'(used)':''}</div></div>
<div class=card><b>Today's intention</b><input id=int value="${S.intention}" placeholder="e.g. Be patient with my kids" onchange="S.intention=this.value;save()"></div>
<div class=card>Distracting apps: <b>${lock}</b><br><span class=muted>${dueVerses().length} verse(s) due for review</span><br><button onclick=gate()>Simulate opening Instagram</button></div>`)}
function gate(){if(Date.now()<S.unlockedUntil)return home('Still unlocked. Opening would continue normally.');
$(`<h1>Pause before you scroll</h1>${nav()}<div class=card>${S.intention?`Your intention: <i>${S.intention}</i><br><br>`:''}Unlock by praying or by reciting a verse.<br><button onclick=pray()>Pray (60s)</button><button onclick=recall()>Recite a verse</button><button class=q onclick="home('You chose not to open it. Nice.')">Not now</button></div>`)}
function pray(){let s=60;$(`<h1>Pray</h1><div class=card><p class=muted>Adoration · Confession · Thanksgiving · Supplication</p><textarea id=p placeholder="Optional: who or what are you praying for?"></textarea><div class=big id=t>60</div><button class=q onclick="clearInterval(window.T);home()">Cancel</button></div>`);
window.T=setInterval(()=>{s--;document.getElementById('t').textContent=s;if(s<=0){clearInterval(T);document.getElementById('t').outerHTML='<button onclick="complete(\'prayer\')">Amen</button>'}},1000)}
function blank(txt,lvl){const w=txt.split(' ');return w.map((x,i)=>(lvl==0? (i%3==1):lvl==1?(i%2==1):true)?x.replace(/[A-Za-z']+/,m=>m[0]+'_'.repeat(m.length-1)):x).join(' ')}
function recall(i){const d=dueVerses();if(i===undefined)i=d.length?d[0]:Math.floor(Math.random()*(S.pro?V.length:FREE));const c=card(i),[ref,txt,tr]=V[i];
$(`<h1>Recite</h1><div class=card><b>${ref}</b> <span class=muted>(${tr}, level ${c.box})</span><p style="font-size:18px;line-height:1.5">${blank(txt,Math.min(c.box,2))}</p>
<p class=muted>Type the verse (first letters show as hints).</p><textarea id=a></textarea><button onclick=check(${i})>Check</button><button class=q onclick=home()>Cancel</button></div>`)}
function check(i){const n=s=>s.toLowerCase().replace(/[^a-z ]/g,'').split(/\s+/).filter(Boolean);const t=n(V[i][1]),a=n(document.getElementById('a').value);
let hit=t.filter((w,k)=>a[k]===w).length,sc=hit/t.length,c=card(i);
if(sc>=.8){c.box=Math.min(c.box+1,5);const days=[1,2,4,7,14,30][c.box];c.due=new Date(Date.now()+days*864e5).toISOString().slice(0,10);save();complete('verse '+V[i][0])}
else{c.box=0;c.due=today();save();$(`<h1>Close!</h1><div class=card>${Math.round(sc*100)}% word-for-word. Here it is:<p><i>${V[i][1]}</i></p><button onclick=recall(${i})>Try again</button><button class=q onclick=pray()>Pray instead</button></div>`)}}
function verses(){$(`<h1>Verse memory</h1>${nav()}${V.map((v,i)=>{const lock=!S.pro&&i>=FREE,c=card(i);return `<div class=card><b>${v[0]}</b> ${lock?'<span class=pro>PRO</span>':`<span class=muted>level ${c.box} · due ${c.due}</span>`}<br>${lock?'<button class=q onclick=pay()>Unlock</button>':`<button class=q onclick=recall(${i})>Practice</button>`}</div>`}).join('')}<p class=muted>Spaced repetition: 1, 2, 4, 7, 14, 30 days. KJV and WEB are public domain.</p>`)}
function rem(){$(`<h1>Reminders</h1>${nav()}<div class=card>${Object.entries(S.rem).map(([k,v])=>`${k}<input type=time value="${v}" onchange="S.rem['${k}']=this.value;save()">`).join('')}
<button onclick="Notification.requestPermission().then(p=>alert('Notifications: '+p))">Enable notifications</button><p class=muted>Gentle nudges only. Missing one never costs you anything. (In the prototype, reminders fire while the app is open.)</p></div>`)}
function pay(){$(`<h1>VerseLock Pro</h1>${nav()}<div class=card><b>Free forever:</b> prayer unlock, 3 verses, streaks, reminders.<br><br><b>Pro:</b> full verse library and packs, unlimited memory decks, prayer list, stats, widgets.</div>
<div class=card><button onclick="S.pro=true;save();home('Pro unlocked (mock, no charge).')">$29.99 / year · 7-day free trial</button><br><button class=q onclick="S.pro=true;save();home('Pro unlocked (mock).')">$4.99 / month</button><button class=q onclick="S.pro=true;save();home('Pro unlocked (mock).')">$59.99 lifetime</button>
<p class=muted>We remind you 2 days before your trial ends. Cancel in one tap. Prototype only: no payment is taken.</p>${S.pro?'<button class=q onclick="S.pro=false;save();pay()">Reset to free</button>':''}</div>`)}
setInterval(()=>{const hm=new Date().toTimeString().slice(0,5);for(const[k,v]of Object.entries(S.rem))if(v===hm&&window.Notification&&Notification.permission==='granted'&&S['n'+k]!==today()+hm){S['n'+k]=today()+hm;save();new Notification('VerseLock',{body:`Time for ${k.toLowerCase()}.`})}},20000);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');home();
