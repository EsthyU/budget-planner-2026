import { useState, useMemo, useEffect, useCallback } from "react";
const MONTHS=["May","June","July","August","September","October","November","December"];
const MO=["MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MI=8;const SK="bp2026_v4";
const sv=d=>{try{localStorage.setItem(SK,JSON.stringify(d))}catch(e){}};
const ld=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):null}catch(e){return null}};
const cl=()=>{try{localStorage.removeItem(SK)}catch(e){}};
let _u=Date.now();const uid=()=>String(++_u);
const fmt=(v,c,R)=>{const n=c==="RON"?v:v/R[c];const a=Math.abs(n);const s=a<0.5?"0":a.toLocaleString("en",{maximumFractionDigits:0});return c==="RON"?`${n<0?"-":""}${s} RON`:`${n<0?"-":""}${{EUR:"\u20ac",USD:"$",GBP:"\u00a3"}[c]}${s}`};
const DEF={rates:{EUR:5.0948,USD:4.3411,GBP:5.8739},salaryGBP:1458.33,cur:"RON",
exp:[{id:"1",n:"Work Tax (Partner)",a:1625},{id:"2",n:"Nails",a:310},{id:"3",n:"Food & Groceries",a:500},{id:"4",n:"Klarna Payment",a:370},{id:"5",n:"Internet",a:60},{id:"6",n:"Netflix",a:55},{id:"7",n:"Claude AI",a:100},{id:"8",n:"Transport",a:200},{id:"9",n:"Skincare & Body Care",a:150}],
debts:[{id:"d1",n:"Pastor Awede",t:2100,s:[0,0,0,2100,0,0,0,0],dl:"August 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d2",n:"A",t:1720,s:[0,1000,770,0,0,0,0,0],dl:"Jun\u2013Jul 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d3",n:"Vivian",t:3360,s:[0,0,3360,0,0,0,0,0],dl:"July 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d4",n:"PhD",t:300,s:[0,0,0,0,0,0,0,0],dl:"TBD",p:[false,false,false,false,false,false,false,false]},
{id:"d5",n:"Excel King",t:1260,s:[940,0,0,0,0,0,0,0],dl:"May 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d6",n:"Monica",t:850,s:[0,850,0,0,0,0,0,0],dl:"June 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d7",n:"David",t:4500,s:[0,4500,0,0,0,0,0,0],dl:"June 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d8",n:"Cassandra",t:8000,s:[0,4000,4000,0,0,0,0,0],dl:"Jun\u2013Jul 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d9",n:"Ikemfuna",t:1700,s:[0,0,0,1700,0,0,0,0],dl:"August 2026",p:[false,false,false,false,false,false,false,false]},
{id:"d10",n:"Peace",t:1500,s:[0,1500,0,0,0,0,0,0],dl:"June 2026",p:[false,false,false,false,false,false,false,false]}],
streams:[{id:"s1",n:"2nd Job",a:[0,0,0,0,0,0,0,0]},{id:"s2",n:"Business",a:[0,0,0,0,0,0,0,0]},{id:"s3",n:"Side Hustles",a:[0,0,0,0,0,0,0,0]},{id:"s4",n:"Collections",a:[0,0,0,0,0,0,0,0]}],
sav:[0,1000,1000,1500,1500,2000,2000,2000],
owed:[{id:"o1",n:"Olivia",a:925,st:"Pending",nt:""},{id:"o2",n:"Emelda",a:3240,st:"Pending",nt:""},{id:"o3",n:"Given",a:1000,st:"Pending",nt:""}],
plans:[{id:"m1",n:"Work Permit",a:2547,tg:"After debt",st:"Not Started",nt:"\u20ac500"},{id:"m2",n:"School Fees",a:33105,tg:"2027\u20132028",st:"Not Started",nt:""},{id:"m3",n:"Passport Renewal",a:894,tg:"Q4 2026",st:"Not Started",nt:""},{id:"m4",n:"WES",a:1144,tg:"2027+",st:"Not Started",nt:""},{id:"m5",n:"Doctorate Defense",a:3000,tg:"2027+",st:"Not Started",nt:""}],
future:[{id:"f1",n:"Anderson",a:510,nt:"Pay when comfortable"},{id:"f2",n:"Irene",a:850,nt:"Pay when comfortable"},{id:"f3",n:"Adeola",a:0,nt:"Amount TBD"}],
mx:Array.from({length:8},()=>[])};

const C={bg:"#060a12",pn:"#0c1119",bd:"#161f2e",gd:"#c9a84c",gn:"#34d399",rd:"#f87171",pr:"#a78bfa",bl:"#60a5fa",tx:"#d4d0c8",mt:"#5a6577",dm:"#2a3545"};

// Mobile-first components
const Inp=({value:v,onChange:oc,type:t="number",color:cl,placeholder:ph,style:sx})=>(<input type={t} value={v} placeholder={ph} onChange={e=>oc(t==="number"?(Number(e.target.value)||0):e.target.value)} style={{width:"100%",padding:"8px 12px",borderRadius:8,outline:"none",border:`1px solid ${C.dm}`,background:C.bg,fontSize:16,fontWeight:600,fontFamily:"'Outfit',sans-serif",textAlign:t==="number"?"right":"left",color:cl||C.tx,...sx}}/>);

const Btn=({children:ch,onClick:oc,color:cl=C.gd,sm,fill,style:sx})=>(<button onClick={oc} style={{padding:sm?"4px 12px":"10px 20px",borderRadius:8,border:fill?"none":`1px dashed ${cl}50`,background:fill?cl:"transparent",cursor:"pointer",color:fill?C.bg:cl,fontSize:sm?11:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",letterSpacing:.3,...sx}}>{ch}</button>);

const Panel=({children:ch,style:sx})=>(<div style={{background:C.pn,border:`1px solid ${C.bd}`,borderRadius:16,padding:"20px 16px",...sx}}>{ch}</div>);

const Title=({children:ch,sub})=>(<div style={{marginBottom:16}}><h2 style={{margin:0,fontSize:18,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:C.gd}}>{ch}</h2>{sub&&<p style={{margin:"4px 0 0",fontSize:12,color:C.mt}}>{sub}</p>}</div>);

const Stat=({label:l,value:v,color:cl=C.gd})=>(<div style={{padding:"14px 16px",background:C.bg,borderRadius:10,border:`1px solid ${C.bd}`,flex:1,minWidth:0}}><div style={{fontSize:9,fontWeight:700,color:C.mt,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>{l}</div><div style={{fontSize:18,fontWeight:800,color:cl,fontFamily:"'Cormorant Garamond',serif",wordBreak:"break-all"}}>{v}</div></div>);

const Bar=({value:v,max:mx,color:cl=C.gd,h=6})=>(<div style={{width:"100%",background:C.dm,borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${mx>0?Math.min((v/mx)*100,100):0}%`,background:cl,height:"100%",borderRadius:99,transition:"width .6s ease"}}/></div>);

const Row=({children:ch,style:sx})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.bd}`,gap:8,...sx}}>{ch}</div>);

const Del=({onClick:oc})=>(<button onClick={oc} style={{padding:"4px 10px",borderRadius:6,border:"none",background:`${C.rd}20`,color:C.rd,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif",flexShrink:0}}>X</button>);

export default function App(){
  const init=useMemo(()=>ld()||{},[]);
  const g=k=>init[k]!==undefined?JSON.parse(JSON.stringify(init[k])):JSON.parse(JSON.stringify(DEF[k]));
  const[tab,sTab]=useState("dash");
  const[cur,sCur]=useState(init.cur||"RON");
  const[rates,sRates]=useState(g("rates"));
  const[salary,sSal]=useState(init.salaryGBP??DEF.salaryGBP);
  const[exp,sExp]=useState(g("exp"));
  const[debts,sDbt]=useState(g("debts"));
  const[streams,sStr]=useState(g("streams"));
  const[sav,sSav]=useState(g("sav"));
  const[owed,sOwe]=useState(g("owed"));
  const[plans,sPln]=useState(g("plans"));
  const[future,sFut]=useState(g("future"));
  const[mx,sMx]=useState(g("mx"));
  const[sm,sSm]=useState(0);
  const[rc,sRc]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>sv({cur,rates,salaryGBP:salary,exp,debts,streams,sav,owed,plans,future,mx}),400);return()=>clearTimeout(t)},[cur,rates,salary,exp,debts,streams,sav,owed,plans,future,mx]);

  const salRON=salary*rates.GBP;
  const f=useCallback(v=>fmt(v,cur,rates),[cur,rates]);
  const totExp=exp.reduce((s,e)=>s+e.a,0);
  const extInc=useCallback(i=>streams.reduce((s,st)=>s+(st.a[i]||0),0),[streams]);
  const mxExp=useCallback(i=>(mx[i]||[]).reduce((s,e)=>s+e.a,0),[mx]);
  const inc=useCallback(i=>salRON+extInc(i),[salRON,extInc]);
  const dPmt=useCallback(i=>debts.reduce((s,d)=>s+(d.p[i]?0:(d.s[i]||0)),0),[debts]);
  const net=useCallback(i=>inc(i)-totExp-mxExp(i)-dPmt(i)-sav[i],[inc,totExp,mxExp,dPmt,sav]);
  const totDebt=debts.reduce((s,d)=>s+d.t,0);
  const totPd=debts.reduce((s,d)=>s+d.s.reduce((a,v,i)=>a+(d.p[i]?v:0),0),0);
  const totRem=totDebt-totPd;
  const annInc=useMemo(()=>Array(MI).fill(0).reduce((s,_,i)=>s+inc(i),0),[inc]);
  const annSav=sav.reduce((a,b)=>a+b,0);
  const totOwed=owed.reduce((s,o)=>s+o.a,0);
  const cumSav=useCallback(i=>{let t=0;for(let j=0;j<=i;j++)t+=sav[j];return t},[sav]);

  const uL=(set,id,fld,val)=>set(p=>p.map(x=>x.id===id?{...x,[fld]:val}:x));
  const aL=(set,item)=>set(p=>[...p,item]);
  const dL=(set,id)=>set(p=>p.filter(x=>x.id!==id));
  const uDS=(id,mi,val)=>sDbt(p=>p.map(d=>d.id===id?{...d,s:d.s.map((v,i)=>i===mi?val:v)}:d));
  const tP=(id,mi)=>sDbt(p=>p.map(d=>d.id===id?{...d,p:d.p.map((v,i)=>i===mi?!v:v)}:d));
  const uSA=(id,mi,val)=>sStr(p=>p.map(s=>s.id===id?{...s,a:s.a.map((v,i)=>i===mi?val:v)}:s));
  const uSv=(mi,val)=>sSav(p=>p.map((v,i)=>i===mi?val:v));
  const aMx=mi=>sMx(p=>{const n=p.map(a=>[...a]);n[mi]=[...n[mi],{id:uid(),n:"",a:0}];return n});
  const uMx=(mi,id,fld,val)=>sMx(p=>{const n=p.map(a=>a.map(e=>({...e})));n[mi]=n[mi].map(e=>e.id===id?{...e,[fld]:val}:e);return n});
  const dMx=(mi,id)=>sMx(p=>{const n=p.map(a=>[...a]);n[mi]=n[mi].filter(e=>e.id!==id);return n});

  

  const tabs=[{id:"dash",l:"Dashboard"},{id:"mo",l:"Monthly"},{id:"inc",l:"Income"},{id:"debt",l:"Debts"},{id:"save",l:"Savings"},{id:"owe",l:"Owed to Me"},{id:"plan",l:"Plans"},{id:"set",l:"Settings"}];

  return(<div style={{minHeight:"100vh",background:C.bg,color:C.tx,fontFamily:"'Outfit',sans-serif",maxWidth:"100vw",overflowX:"hidden"}}>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${C.bg}}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:${C.dm};border-radius:3px}input[type=number]::-webkit-inner-spin-button{opacity:0}input:focus,select:focus{border-color:${C.gd}!important}table{border-collapse:collapse;width:100%}input,select{font-size:16px!important}`}</style>

{/* Header */}
<header style={{borderBottom:`1px solid ${C.bd}`,padding:"16px 16px 12px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:9,fontWeight:700,color:C.gd,letterSpacing:4,textTransform:"uppercase"}}>BUDGET PLANNER</div>
<h1 style={{fontSize:24,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#f0ece4"}}>2026</h1></div>
<div style={{display:"flex",gap:2,background:C.pn,borderRadius:8,padding:2,border:`1px solid ${C.bd}`}}>
{["RON","EUR","USD","GBP"].map(c=>(<button key={c} onClick={()=>sCur(c)} style={{padding:"5px 10px",borderRadius:6,border:"none",cursor:"pointer",fontSize:10,fontWeight:800,fontFamily:"'Outfit',sans-serif",letterSpacing:1,background:cur===c?C.gd:"transparent",color:cur===c?C.bg:C.mt}}>{c}</button>))}</div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
<Stat label="Income" value={f(salRON)} color={C.gn}/>
<Stat label="Expenses" value={f(totExp)} color={C.rd}/>
<Stat label="Debt Left" value={f(totRem)} color={totRem<=0?C.gn:C.rd}/>
<Stat label="Savings" value={f(annSav)} color={C.gd}/></div>
</header>

{/* Nav */}
<nav style={{background:C.pn,borderBottom:`1px solid ${C.bd}`,position:"sticky",top:0,zIndex:10,padding:"0 8px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
<div style={{display:"flex",gap:0,padding:"4px 0",minWidth:"max-content"}}>
{tabs.map(t=>(<button key={t.id} onClick={()=>sTab(t.id)} style={{padding:"8px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",background:tab===t.id?`${C.gd}18`:"transparent",color:tab===t.id?C.gd:C.mt,borderBottom:tab===t.id?`2px solid ${C.gd}`:"2px solid transparent"}}>{t.l}</button>))}</div></nav>

<main style={{padding:"16px 16px 60px"}}>

{/* DASHBOARD */}
{tab==="dash"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="May \u2013 December 2026">Overview</Title>
<div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",margin:"0 -8px",padding:"0 8px"}}><table style={{minWidth:600}}><thead><tr>{["",  ...MO,"TOTAL"].map((h,i)=><td key={i} style={{padding:"8px 6px",fontSize:9,fontWeight:700,color:i===MO.length+1?C.gd:C.mt,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`,textAlign:i>0?"right":"left",whiteSpace:"nowrap"}}>{h}</td>)}</tr></thead><tbody>
{[{l:"Income",c:C.gn,fn:i=>inc(i),tot:annInc},{l:"Expenses",c:C.mt,fn:i=>totExp+mxExp(i),tot:Array(MI).fill(0).reduce((s,_,i)=>s+totExp+mxExp(i),0)},{l:"Debt",c:C.rd,fn:i=>dPmt(i),tot:Array(MI).fill(0).reduce((s,_,i)=>s+dPmt(i),0)},{l:"Savings",c:C.pr,fn:i=>sav[i],tot:annSav},{l:"Net",c:C.gd,fn:i=>net(i),tot:Array(MI).fill(0).reduce((s,_,i)=>s+net(i),0)}].map((r,ri)=>(
<tr key={ri} style={{background:ri===4?`${C.gd}08`:"transparent"}}><td style={{padding:"8px 6px",fontSize:12,fontWeight:700,color:r.c,borderBottom:`1px solid ${C.bd}`,whiteSpace:"nowrap"}}>{r.l}</td>
{MO.map((_,i)=>{const v=r.fn(i);return<td key={i} style={{padding:"8px 4px",fontSize:11,fontWeight:600,color:ri===4?(v>=0?C.gn:C.rd):r.c,borderBottom:`1px solid ${C.bd}`,textAlign:"right",whiteSpace:"nowrap"}}>{v>0||ri===4?f(v):"\u2014"}</td>})}
<td style={{padding:"8px 6px",fontSize:11,fontWeight:700,color:C.gd,borderBottom:`1px solid ${C.bd}`,textAlign:"right",whiteSpace:"nowrap"}}>{f(r.tot)}</td></tr>))}
</tbody></table></div></Panel>

<Panel><Title>Debt Progress</Title>
<div style={{textAlign:"center",marginBottom:16}}>
<div style={{fontSize:32,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:totRem<=0?C.gn:C.rd}}>{f(totRem)}</div>
<div style={{fontSize:11,color:C.mt}}>of {f(totDebt)} \u00b7 {totDebt>0?((totPd/totDebt)*100).toFixed(0):0}% cleared</div>
<div style={{margin:"10px auto",maxWidth:280}}><Bar value={totPd} max={totDebt} color={C.gn} h={8}/></div></div>
{debts.map(d=>{const pd=d.s.reduce((a,v,i)=>a+(d.p[i]?v:0),0);const dn=pd>=d.t&&d.t>0;return(
<div key={d.id} style={{marginBottom:8,opacity:dn?.4:1}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
<span style={{fontWeight:600,textDecoration:dn?"line-through":"none"}}>{d.n}</span>
<span style={{color:dn?C.gn:C.rd,fontWeight:700}}>{dn?"CLEARED":f(d.t-pd)}</span></div>
<Bar value={pd} max={d.t} color={dn?C.gn:C.gd} h={4}/></div>)})}</Panel>

<Panel><Title>Currency Summary</Title>
{[{l:"Income",v:annInc,c:C.gn},{l:"Expenses",v:totExp*MI,c:C.rd},{l:"Debt",v:totDebt,c:C.rd},{l:"Savings",v:annSav,c:C.pr}].map((r,i)=>(
<Row key={i}><span style={{fontSize:13,fontWeight:700,color:r.c}}>{r.l}</span>
<div style={{textAlign:"right",fontSize:12}}>{["RON","EUR","USD","GBP"].map(c=><div key={c} style={{color:c===cur?C.tx:C.mt,fontWeight:c===cur?700:400}}>{fmt(r.v,c,rates)}</div>)}</div></Row>))}</Panel>
</div>)}

{/* MONTHLY */}
{tab==="mo"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
{MONTHS.map((m,i)=><button key={m} onClick={()=>sSm(i)} style={{padding:"10px 4px",borderRadius:8,border:`1px solid ${sm===i?C.gd:C.bd}`,cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",background:sm===i?`${C.gd}15`:C.pn,color:sm===i?C.gd:C.mt}}>{MO[i]}</button>)}</div>
<Panel><Title>{MONTHS[sm]} 2026</Title>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:20}}>
{[{l:"Income",v:inc(sm),c:C.gn},{l:"Expenses",v:totExp+mxExp(sm),c:C.mt},{l:"Debt",v:dPmt(sm),c:C.rd},{l:"Savings",v:sav[sm],c:C.pr},{l:"Net Balance",v:net(sm),c:net(sm)>=0?C.gn:C.rd}].map((s,i)=>(
<div key={i} style={{padding:"12px",background:C.bg,borderRadius:10,borderLeft:`3px solid ${s.c}`,gridColumn:i===4?"1/3":undefined}}>
<div style={{fontSize:9,fontWeight:700,color:C.mt,letterSpacing:1.5,textTransform:"uppercase"}}>{s.l}</div>
<div style={{fontSize:i===4?22:18,fontWeight:800,color:s.c,fontFamily:"'Cormorant Garamond',serif",marginTop:2}}>{f(s.v)}</div></div>))}</div>

<h4 style={{fontSize:10,fontWeight:700,color:C.mt,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>FIXED EXPENSES</h4>
{exp.map((e,i)=><Row key={e.id} style={{background:i%2===0?`${C.bg}60`:"transparent"}}><span style={{fontSize:13}}>{e.n}</span><span style={{fontSize:13,fontWeight:700}}>{f(e.a)}</span></Row>)}

<h4 style={{fontSize:10,fontWeight:700,color:C.gd,letterSpacing:1.5,textTransform:"uppercase",margin:"20px 0 8px"}}>EXTRA EXPENSES \u2014 {MONTHS[sm]}</h4>
{(mx[sm]||[]).map(e=>(<Row key={e.id}><div style={{flex:1,marginRight:8}}><Inp type="text" value={e.n} onChange={v=>uMx(sm,e.id,"n",v)} placeholder="Name"/></div><div style={{width:90}}><Inp value={e.a} onChange={v=>uMx(sm,e.id,"a",v)} color={C.gd}/></div><Del onClick={()=>dMx(sm,e.id)}/></Row>))}
<Btn onClick={()=>aMx(sm)} style={{marginTop:8}}>+ Add {MONTHS[sm]} Expense</Btn>

<h4 style={{fontSize:10,fontWeight:700,color:C.rd,letterSpacing:1.5,textTransform:"uppercase",margin:"20px 0 8px"}}>DEBT PAYMENTS \u2014 {MONTHS[sm]}</h4>
{debts.map(d=>{const v=d.s[sm];const ip=d.p[sm];const left=d.t-d.s.reduce((a,val,mi)=>a+(d.p[mi]?val:0),0);return(
<Row key={d.id} style={{opacity:ip&&v>0?.4:1,flexWrap:"wrap"}}>
<div style={{flex:"1 1 120px"}}><div style={{fontSize:13,fontWeight:600,textDecoration:ip&&v>0?"line-through":"none"}}>{d.n}</div><div style={{fontSize:10,color:C.mt}}>owes {f(Math.max(left,0))}</div></div>
<div style={{width:80}}><Inp value={v} onChange={val=>uDS(d.id,sm,val)} color={v>0?C.rd:C.dm}/></div>
{v>0&&<Btn onClick={()=>tP(d.id,sm)} sm fill={ip} color={ip?C.gn:C.rd}>{ip?"\u2713 PAID":"MARK PAID"}</Btn>}
</Row>)})}
<Row style={{background:`${C.rd}10`}}><span style={{fontSize:13,fontWeight:700,color:C.rd}}>Total Debt</span><span style={{fontSize:14,fontWeight:700,color:C.rd}}>{f(dPmt(sm))}</span></Row>
<div style={{marginTop:12,padding:12,background:C.bg,borderRadius:10,fontSize:12,color:C.mt}}>Change any amount to reschedule. Reduce this month, add the balance to next month.</div>
</Panel></div>)}

{/* INCOME */}
{tab==="inc"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="Edit amounts \u2014 everything recalculates">Income Streams</Title>
<div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",margin:"0 -8px",padding:"0 8px"}}><table style={{minWidth:550}}><thead><tr><td style={{padding:"8px 6px",fontSize:9,fontWeight:700,color:C.mt,letterSpacing:1,borderBottom:`1px solid ${C.bd}`}}>SOURCE</td>
{MO.map(m=><td key={m} style={{padding:"8px 4px",fontSize:9,fontWeight:700,color:C.mt,letterSpacing:1,textAlign:"center",borderBottom:`1px solid ${C.bd}`}}>{m}</td>)}
<td style={{padding:"8px 6px",fontSize:9,fontWeight:700,color:C.gd,letterSpacing:1,textAlign:"right",borderBottom:`1px solid ${C.bd}`}}>TOTAL</td><td style={{borderBottom:`1px solid ${C.bd}`}}/></tr></thead><tbody>
<tr style={{background:`${C.gn}08`}}><td style={{padding:"8px 6px",fontSize:12,fontWeight:700,color:C.gn,borderBottom:`1px solid ${C.bd}`,whiteSpace:"nowrap"}}>Salary</td>
{MO.map((_,i)=><td key={i} style={{padding:"8px 4px",fontSize:11,fontWeight:600,color:C.gn,textAlign:"center",borderBottom:`1px solid ${C.bd}`}}>{f(salRON)}</td>)}
<td style={{padding:"8px 6px",fontSize:11,fontWeight:700,color:C.gn,textAlign:"right",borderBottom:`1px solid ${C.bd}`}}>{f(salRON*MI)}</td><td style={{borderBottom:`1px solid ${C.bd}`}}/></tr>
{streams.map(s=>(<tr key={s.id}><td style={{padding:"4px 4px",borderBottom:`1px solid ${C.bd}`,minWidth:80}}><Inp type="text" value={s.n} onChange={v=>uL(sStr,s.id,"n",v)}/></td>
{MO.map((_,mi)=><td key={mi} style={{padding:"3px 2px",borderBottom:`1px solid ${C.bd}`}}><Inp value={s.a[mi]||0} onChange={v=>uSA(s.id,mi,v)} color={C.gd} style={{padding:"6px 4px",fontSize:13}}/></td>)}
<td style={{padding:"8px 6px",fontSize:11,fontWeight:700,textAlign:"right",borderBottom:`1px solid ${C.bd}`}}>{f(s.a.reduce((a,b)=>a+b,0))}</td>
<td style={{padding:4,borderBottom:`1px solid ${C.bd}`}}><Del onClick={()=>dL(sStr,s.id)}/></td></tr>))}
<tr style={{background:`${C.gd}08`}}><td style={{padding:"8px 6px",fontSize:12,fontWeight:700,color:C.gd,borderBottom:`1px solid ${C.bd}`}}>TOTAL</td>
{MO.map((_,i)=><td key={i} style={{padding:"8px 4px",fontSize:11,fontWeight:700,color:C.gd,textAlign:"center",borderBottom:`1px solid ${C.bd}`}}>{f(inc(i))}</td>)}
<td style={{padding:"8px 6px",fontSize:11,fontWeight:700,color:C.gd,textAlign:"right",borderBottom:`1px solid ${C.bd}`}}>{f(annInc)}</td><td style={{borderBottom:`1px solid ${C.bd}`}}/></tr>
</tbody></table></div>
<Btn onClick={()=>aL(sStr,{id:uid(),n:"",a:Array(MI).fill(0)})} style={{marginTop:8}}>+ Add Income Stream</Btn></Panel></div>)}

{/* DEBTS */}
{tab==="debt"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="Edit amounts, move payments, mark paid">Debt Schedule</Title>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
<Stat label="Total" value={f(totDebt)} color={C.rd}/>
<Stat label="Paid" value={f(totPd)} color={C.gn}/>
<Stat label="Left" value={f(totRem)} color={totRem<=0?C.gn:C.gd}/></div>

{debts.map(d=>{const pd=d.s.reduce((a,v,i)=>a+(d.p[i]?v:0),0);const left=d.t-pd;const dn=left<=0&&d.t>0;return(
<div key={d.id} style={{background:C.bg,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${dn?`${C.gn}30`:C.bd}`,opacity:dn?.5:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,gap:8}}>
<Inp type="text" value={d.n} onChange={v=>uL(sDbt,d.id,"n",v)} style={{fontWeight:700,fontSize:15,textDecoration:dn?"line-through":"none"}}/>
<Del onClick={()=>dL(sDbt,d.id)}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>OWED</div><Inp value={d.t} onChange={v=>uL(sDbt,d.id,"t",v)} color={C.rd}/></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>PAID</div><div style={{padding:"8px 12px",background:C.pn,borderRadius:8,textAlign:"right",fontSize:14,fontWeight:700,color:C.gn}}>{f(pd)}</div></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,textTransform:"uppercase",marginBottom:2}}>LEFT</div><div style={{padding:"8px 12px",background:C.pn,borderRadius:8,textAlign:"right",fontSize:14,fontWeight:700,color:dn?C.gn:C.gd}}>{dn?"\u2713":f(left)}</div></div></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4}}>
{d.s.slice(0,4).map((v,mi)=>(
<div key={mi} style={{textAlign:"center"}}>
<div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>{MO[mi]}</div>
<Inp value={v} onChange={val=>uDS(d.id,mi,val)} color={d.p[mi]?C.gn:v>0?C.bl:C.dm} style={{padding:"6px 4px",fontSize:13,border:d.p[mi]?`1px solid ${C.gn}40`:undefined,background:d.p[mi]?`${C.gn}10`:undefined,marginBottom:2}}/>
{v>0&&<Btn onClick={()=>tP(d.id,mi)} sm color={d.p[mi]?C.gn:C.mt} style={{width:"100%",padding:"2px 0",fontSize:9}}>{d.p[mi]?"PAID \u2713":"MARK"}</Btn>}</div>))}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:4,marginTop:4}}>
{d.s.slice(4).map((v,mi)=>(
<div key={mi+4} style={{textAlign:"center"}}>
<div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>{MO[mi+4]}</div>
<Inp value={v} onChange={val=>uDS(d.id,mi+4,val)} color={d.p[mi+4]?C.gn:v>0?C.bl:C.dm} style={{padding:"6px 4px",fontSize:13,border:d.p[mi+4]?`1px solid ${C.gn}40`:undefined,background:d.p[mi+4]?`${C.gn}10`:undefined,marginBottom:2}}/>
{v>0&&<Btn onClick={()=>tP(d.id,mi+4)} sm color={d.p[mi+4]?C.gn:C.mt} style={{width:"100%",padding:"2px 0",fontSize:9}}>{d.p[mi+4]?"PAID \u2713":"MARK"}</Btn>}</div>))}</div>
<div style={{marginTop:8}}><Inp type="text" value={d.dl} onChange={v=>uL(sDbt,d.id,"dl",v)} placeholder="Deadline"/></div>
</div>)})}
<Btn onClick={()=>aL(sDbt,{id:uid(),n:"",t:0,s:Array(MI).fill(0),dl:"",p:Array(MI).fill(false)})}>+ Add Debt</Btn>

<Title sub="Not in current budget" style={{marginTop:16}}>Future Debts</Title>
{future.map(d=>(<Row key={d.id}><div style={{flex:1}}><Inp type="text" value={d.n} onChange={v=>uL(sFut,d.id,"n",v)}/></div><div style={{width:80}}><Inp value={d.a} onChange={v=>uL(sFut,d.id,"a",v)} color={C.mt}/></div><Del onClick={()=>dL(sFut,d.id)}/></Row>))}
<Btn onClick={()=>aL(sFut,{id:uid(),n:"",a:0,nt:""})} style={{marginTop:8}}>+ Add Future Debt</Btn>
</Panel></div>)}

{/* SAVINGS */}
{tab==="save"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="Edit monthly targets">Savings Tracker</Title>
<div style={{textAlign:"center",marginBottom:20}}>
<div style={{fontSize:40,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:C.gd}}>{f(annSav)}</div>
<div style={{fontSize:12,color:C.mt}}>Annual Target</div></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
{MONTHS.map((m,i)=>(<div key={m} style={{padding:14,borderRadius:10,textAlign:"center",background:sav[i]>0?`${C.gd}08`:C.bg,border:`1px solid ${sav[i]>0?`${C.gd}40`:C.bd}`}}>
<div style={{fontSize:10,fontWeight:700,color:C.mt,marginBottom:8}}>{MO[i]}</div>
<Inp value={sav[i]} onChange={v=>uSv(i,v)} color={C.gd} style={{textAlign:"center"}}/>
<div style={{fontSize:10,color:C.dm,marginTop:6}}>Cumulative: {f(cumSav(i))}</div></div>))}</div></Panel>
<Panel><Title>Growth Chart</Title>
<div style={{display:"flex",alignItems:"flex-end",height:140,gap:6}}>
{MONTHS.map((m,i)=>{const c=cumSav(i);const mxv=cumSav(MI-1);return(<div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}>
<div style={{fontSize:8,fontWeight:700,color:C.gd,marginBottom:3}}>{f(c)}</div>
<div style={{width:"100%",background:C.gd,borderRadius:"4px 4px 0 0",height:`${mxv>0?(c/mxv)*70:0}%`,minHeight:c>0?3:0,transition:"height .5s ease"}}/>
<span style={{fontSize:9,fontWeight:700,color:C.mt,marginTop:4}}>{MO[i]}</span></div>)})}
</div></Panel></div>)}

{/* OWED TO ME */}
{tab==="owe"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="Track money people owe you">Money Owed to Me</Title>
<div style={{textAlign:"center",marginBottom:20}}>
<div style={{fontSize:36,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:C.gn}}>{f(totOwed)}</div>
<div style={{fontSize:12,color:C.mt}}>Total Receivable</div></div>
{owed.map(o=>(<div key={o.id} style={{background:C.bg,borderRadius:12,padding:14,marginBottom:8,border:`1px solid ${C.bd}`,opacity:o.st==="Collected"?.4:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:8}}>
<div style={{flex:1}}><Inp type="text" value={o.n} onChange={v=>uL(sOwe,o.id,"n",v)} style={{fontWeight:700}}/></div><Del onClick={()=>dL(sOwe,o.id)}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>AMOUNT</div><Inp value={o.a} onChange={v=>uL(sOwe,o.id,"a",v)} color={C.gn}/></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>STATUS</div><select value={o.st} onChange={e=>uL(sOwe,o.id,"st",e.target.value)} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1px solid ${C.dm}`,background:C.bg,fontSize:14,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none",color:o.st==="Collected"?C.gn:o.st==="Partial"?C.gd:C.mt}}><option>Pending</option><option>Partial</option><option>Collected</option></select></div></div>
<div style={{marginTop:8}}><Inp type="text" value={o.nt||""} onChange={v=>uL(sOwe,o.id,"nt",v)} placeholder="Notes"/></div>
</div>))}
<Btn onClick={()=>aL(sOwe,{id:uid(),n:"",a:0,st:"Pending",nt:""})}>+ Add Person</Btn></Panel></div>)}

{/* MAJOR PLANS */}
{tab==="plan"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel><Title sub="Track major planned expenses">Major Planned Expenses</Title>
<div style={{textAlign:"center",marginBottom:16}}>
<div style={{fontSize:28,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:C.gd}}>{f(plans.reduce((s,p)=>s+p.a,0))}</div>
<div style={{fontSize:12,color:C.mt}}>Total Planned</div></div>
{plans.map(p=>(<div key={p.id} style={{background:C.bg,borderRadius:12,padding:14,marginBottom:8,border:`1px solid ${C.bd}`,opacity:p.st==="Done"?.4:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:8}}>
<div style={{flex:1}}><Inp type="text" value={p.n} onChange={v=>uL(sPln,p.id,"n",v)} style={{fontWeight:700}}/></div><Del onClick={()=>dL(sPln,p.id)}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>COST (RON)</div><Inp value={p.a} onChange={v=>uL(sPln,p.id,"a",v)} color={C.gd}/></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>= {cur}</div><div style={{padding:"8px 12px",background:C.pn,borderRadius:8,textAlign:"right",fontSize:14,fontWeight:600,color:C.mt}}>{f(p.a)}</div></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>TARGET</div><Inp type="text" value={p.tg} onChange={v=>uL(sPln,p.id,"tg",v)}/></div>
<div><div style={{fontSize:9,color:C.mt,letterSpacing:1,marginBottom:2}}>STATUS</div><select value={p.st} onChange={e=>uL(sPln,p.id,"st",e.target.value)} style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1px solid ${C.dm}`,background:C.bg,fontSize:14,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none",color:p.st==="Done"?C.gn:p.st==="In Progress"?C.gd:C.mt}}><option>Not Started</option><option>In Progress</option><option>Done</option></select></div></div>
<div style={{marginTop:8}}><Inp type="text" value={p.nt||""} onChange={v=>uL(sPln,p.id,"nt",v)} placeholder="Notes"/></div>
</div>))}
<Btn onClick={()=>aL(sPln,{id:uid(),n:"",a:0,tg:"",st:"Not Started",nt:""})}>+ Add Planned Expense</Btn></Panel></div>)}


{/* SETTINGS */}
{tab==="set"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
<Panel>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<Title>Settings</Title>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
<span style={{fontSize:11,color:C.gn,fontWeight:600}}>{"\u2713"} Saved</span>
{rc?<div style={{display:"flex",gap:4}}><Btn onClick={()=>{cl();window.location.reload()}} sm fill color={C.rd}>Reset</Btn><Btn onClick={()=>sRc(false)} sm>Cancel</Btn></div>
:<Btn onClick={()=>sRc(true)} sm color={C.mt}>Reset All</Btn>}</div></div>

<h4 style={{fontSize:10,fontWeight:700,color:C.gd,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>EXCHANGE RATES</h4>
{["EUR","USD","GBP"].map(c=>(<Row key={c}><span style={{fontWeight:600}}>1 {c} =</span><div style={{width:100}}><Inp value={rates[c]} onChange={v=>sRates(p=>({...p,[c]:v||1}))} color={C.gd}/></div></Row>))}

<h4 style={{fontSize:10,fontWeight:700,color:C.gd,letterSpacing:1.5,textTransform:"uppercase",margin:"20px 0 10px"}}>PRIMARY INCOME</h4>
<Row><span style={{fontWeight:600}}>Salary (GBP)</span><div style={{width:110}}><Inp value={salary} onChange={sSal} color={C.gd}/></div></Row>
<Row><span style={{fontWeight:600}}>= RON</span><span style={{fontWeight:800,color:C.gn,fontSize:18}}>{fmt(salRON,"RON",rates)}</span></Row>

<h4 style={{fontSize:10,fontWeight:700,color:C.gd,letterSpacing:1.5,textTransform:"uppercase",margin:"20px 0 10px"}}>FIXED MONTHLY EXPENSES</h4>
{exp.map((e,i)=>(<Row key={e.id} style={{background:i%2===0?`${C.bg}60`:"transparent"}}>
<div style={{flex:1,marginRight:8}}><Inp type="text" value={e.n} onChange={v=>uL(sExp,e.id,"n",v)}/></div>
<div style={{width:90}}><Inp value={e.a} onChange={v=>uL(sExp,e.id,"a",v)} color={C.gd}/></div>
<Del onClick={()=>dL(sExp,e.id)}/></Row>))}
<Row style={{background:`${C.rd}10`}}><span style={{fontWeight:700,color:C.rd}}>TOTAL</span><span style={{fontWeight:700,color:C.rd}}>{f(totExp)}</span></Row>
<Row style={{background:`${C.gn}10`}}><span style={{fontWeight:700,color:C.gn}}>AVAILABLE</span><span style={{fontWeight:700,color:C.gn}}>{f(salRON-totExp)}</span></Row>
<Btn onClick={()=>aL(sExp,{id:uid(),n:"",a:0})} style={{marginTop:8}}>+ Add Expense</Btn>
</Panel></div>)}

</main>
<footer style={{textAlign:"center",padding:"16px 16px 28px",borderTop:`1px solid ${C.bd}`}}>
<div style={{fontSize:8,color:C.dm,letterSpacing:2,textTransform:"uppercase"}}>Budget Planner 2026 {"\u00b7"} Auto-saved {"\u00b7"} Private</div></footer>
</div>);}
