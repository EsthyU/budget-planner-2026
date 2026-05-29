import { useState, useMemo, useEffect, useCallback } from "react";
const MONTHS=["May","June","July","August","September","October","November","December"];
const MO=["MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const MI=8;
const STORE_KEY="bp2026_v3";
const save=d=>{try{localStorage.setItem(STORE_KEY,JSON.stringify(d))}catch(e){}};
const load=()=>{try{const r=localStorage.getItem(STORE_KEY);return r?JSON.parse(r):null}catch(e){return null}};
const clear=()=>{try{localStorage.removeItem(STORE_KEY)}catch(e){}};
let _uid=Date.now();const uid=()=>String(++_uid);
const sym={RON:"RON",EUR:"\u20ac",USD:"$",GBP:"\u00a3"};
const fmt=(v,c,R)=>{const n=c==="RON"?v:v/R[c];const abs=Math.abs(n);const s=abs<0.5?"0":abs.toLocaleString("en",{maximumFractionDigits:0});if(c==="RON")return`${n<0?"-":""}${s} RON`;return`${n<0?"-":""}${sym[c]}${s}`};
const DEF={rates:{EUR:5.0948,USD:4.3411,GBP:5.8739},salaryGBP:1458.33,cur:"RON",
expenses:[{id:"1",name:"Work Tax (Partner)",amount:1625},{id:"2",name:"Nails",amount:310},{id:"3",name:"Food & Groceries",amount:500},{id:"4",name:"Klarna Payment",amount:370},{id:"5",name:"Internet",amount:60},{id:"6",name:"Netflix",amount:55},{id:"7",name:"Claude AI",amount:100},{id:"8",name:"Transport",amount:200},{id:"9",name:"Skincare & Body Care",amount:150}],
debts:[{id:"d1",name:"Monica",total:850,schedule:[425,0,0,0,0,0,0,0],deadline:"May",paid:[false,false,false,false,false,false,false,false]},{id:"d2",name:"Vivian (2,500 cash)",total:2500,schedule:[625,625,625,0,0,0,0,0],deadline:"May\u2013Jul",paid:[false,false,false,false,false,false,false,false]},{id:"d3",name:"David",total:4500,schedule:[4500,0,0,0,0,0,0,0],deadline:"ALL May",paid:[false,false,false,false,false,false,false,false]}],
incomeStreams:[{id:"s1",name:"2nd Job",amounts:[0,0,0,0,0,0,0,0]},{id:"s2",name:"Business",amounts:[0,0,0,0,0,0,0,0]},{id:"s3",name:"Side Hustles",amounts:[0,0,0,0,0,0,0,0]},{id:"s4",name:"Collections",amounts:[0,0,0,0,0,0,0,0]}],
savings:[0,1000,1000,1500,1500,2000,2000,2000],
owed:[{id:"o1",name:"Olivia",amount:925,status:"Pending",notes:""},{id:"o2",name:"Emelda",amount:3240,status:"Pending",notes:""},{id:"o3",name:"Given",amount:1000,status:"Pending",notes:""}],
majorPlans:[{id:"m1",name:"Work Permit",amount:2547,target:"After debt",status:"Not Started",notes:"\u20ac500"},{id:"m2",name:"School Fees",amount:33105,target:"2027\u20132028",status:"Not Started",notes:""},{id:"m3",name:"Passport Renewal",amount:894,target:"Q4 2026",status:"Not Started",notes:""},{id:"m4",name:"WES",amount:1144,target:"2027+",status:"Not Started",notes:""},{id:"m5",name:"Doctorate Defense",amount:3000,target:"2027+",status:"Not Started",notes:""}],
futureDebts:[{id:"f1",name:"Anderson",amount:510,notes:"Pay when comfortable"},{id:"f2",name:"Irene",amount:850,notes:"Pay when comfortable"},{id:"f3",name:"Adeola",amount:0,notes:"Amount TBD"}],
monthExtras:Array.from({length:MI},()=>[])};
const C={bg:"#05080f",panel:"#0b1018",pb:"#151e2d",gold:"#c9a84c",gd:"#c9a84c40",green:"#34d399",red:"#f87171",purple:"#a78bfa",blue:"#60a5fa",text:"#d4d0c8",muted:"#5a6577",dim:"#2a3545"};
const Inp=({value,onChange,type="number",w,color,placeholder,style:sx})=>(<input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(type==="number"?(Number(e.target.value)||0):e.target.value)} style={{width:w||"100%",padding:"7px 10px",borderRadius:6,outline:"none",border:`1px solid ${C.dim}`,background:C.bg,fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",textAlign:type==="number"?"right":"left",color:color||C.text,...sx}}/>);
const Btn=({children,onClick,color:cl=C.gold,variant="ghost",style:sx})=>(<button onClick={onClick} style={{padding:variant==="sm"?"3px 10px":"8px 18px",borderRadius:6,border:variant==="filled"?"none":`1px dashed ${cl}40`,background:variant==="filled"?cl:"transparent",cursor:"pointer",color:variant==="filled"?C.bg:cl,fontSize:variant==="sm"?10:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",transition:"all .2s",letterSpacing:.3,...sx}}>{children}</button>);
const Badge=({children,color:cl=C.muted})=>(<span style={{display:"inline-block",padding:"2px 10px",borderRadius:4,fontSize:10,fontWeight:700,background:`${cl}15`,color:cl,letterSpacing:.8,textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>{children}</span>);
const Panel=({children,style:sx})=>(<div style={{background:C.panel,border:`1px solid ${C.pb}`,borderRadius:14,padding:28,...sx}}>{children}</div>);
const Heading=({children,sub,right})=>(<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:8}}><div><h2 style={{margin:0,fontSize:20,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:C.gold,letterSpacing:.3}}>{children}</h2>{sub&&<p style={{margin:"4px 0 0",fontSize:12,color:C.muted}}>{sub}</p>}</div>{right&&<div>{right}</div>}</div>);
const Stat=({label,value,color:cl=C.gold})=>(<div style={{padding:"16px 20px",background:C.bg,borderRadius:10,border:`1px solid ${C.pb}`,flex:1,minWidth:140}}><div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:6}}>{label}</div><div style={{fontSize:22,fontWeight:800,color:cl,fontFamily:"'Cormorant Garamond',serif"}}>{value}</div></div>);
const Bar=({value,max,color:cl=C.gold,h=6})=>(<div style={{width:"100%",background:C.dim,borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${max>0?Math.min((value/max)*100,100):0}%`,background:cl,height:"100%",borderRadius:99,transition:"width .6s ease"}}/></div>);
const Td=({children,align="left",bold,color:cl,head,style:sx})=>(<td style={{padding:head?"10px 10px":"8px 10px",textAlign:align,fontWeight:bold||head?700:400,fontSize:head?10:13,color:cl||(head?C.muted:C.text),letterSpacing:head?1:0,textTransform:head?"uppercase":"none",borderBottom:`1px solid ${C.pb}`,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",...sx}}>{children}</td>);

export default function App(){
  const init=useMemo(()=>load()||{},[]);
  const g=key=>init[key]!==undefined?JSON.parse(JSON.stringify(init[key])):JSON.parse(JSON.stringify(DEF[key]));
  const[tab,setTab]=useState("dashboard");
  const[cur,setCur]=useState(init.cur||DEF.cur);
  const[rates,setRates]=useState(g("rates"));
  const[salaryGBP,setSalaryGBP]=useState(init.salaryGBP??DEF.salaryGBP);
  const[expenses,setExpenses]=useState(g("expenses"));
  const[debts,setDebts]=useState(g("debts"));
  const[incomeStreams,setIncomeStreams]=useState(g("incomeStreams"));
  const[savings,setSavings]=useState(g("savings"));
  const[owed,setOwed]=useState(g("owed"));
  const[majorPlans,setMajorPlans]=useState(g("majorPlans"));
  const[futureDebts,setFutureDebts]=useState(g("futureDebts"));
  const[monthExtras,setMonthExtras]=useState(g("monthExtras"));
  const[selMonth,setSelMonth]=useState(0);
  const[resetConfirm,setResetConfirm]=useState(false);

  useEffect(()=>{const t=setTimeout(()=>save({cur,rates,salaryGBP,expenses,debts,incomeStreams,savings,owed,majorPlans,futureDebts,monthExtras}),400);return()=>clearTimeout(t)},[cur,rates,salaryGBP,expenses,debts,incomeStreams,savings,owed,majorPlans,futureDebts,monthExtras]);
  const handleReset=()=>{clear();window.location.reload()};

  const salaryRON=salaryGBP*rates.GBP;
  const f=useCallback(v=>fmt(v,cur,rates),[cur,rates]);
  const totalFixed=expenses.reduce((s,e)=>s+e.amount,0);
  const extraInc=useCallback(i=>incomeStreams.reduce((s,st)=>s+(st.amounts[i]||0),0),[incomeStreams]);
  const monthExtra=useCallback(i=>(monthExtras[i]||[]).reduce((s,e)=>s+e.amount,0),[monthExtras]);
  const income=useCallback(i=>salaryRON+extraInc(i),[salaryRON,extraInc]);
  const debtPmt=useCallback(i=>debts.reduce((s,d)=>s+(d.paid[i]?0:(d.schedule[i]||0)),0),[debts]);
  const net=useCallback(i=>income(i)-totalFixed-monthExtra(i)-debtPmt(i)-savings[i],[income,totalFixed,monthExtra,debtPmt,savings]);
  const totalDebt=debts.reduce((s,d)=>s+d.total,0);
  const totalPaid=debts.reduce((s,d)=>s+d.schedule.reduce((a,v,i)=>a+(d.paid[i]?v:0),0),0);
  const totalRemaining=totalDebt-totalPaid;
  const annualIncome=useMemo(()=>Array(MI).fill(0).reduce((s,_,i)=>s+income(i),0),[income]);
  const annualSavings=savings.reduce((a,b)=>a+b,0);
  const totalOwed=owed.reduce((s,o)=>s+o.amount,0);
  const cumSaved=useCallback(i=>{let t=0;for(let j=0;j<=i;j++)t+=savings[j];return t},[savings]);

  const updList=(setter,id,field,val)=>setter(prev=>prev.map(item=>item.id===id?{...item,[field]:val}:item));
  const addToList=(setter,newItem)=>setter(prev=>[...prev,newItem]);
  const delFromList=(setter,id)=>setter(prev=>prev.filter(item=>item.id!==id));
  const updDebtSchedule=(id,mi,val)=>setDebts(prev=>prev.map(d=>d.id===id?{...d,schedule:d.schedule.map((v,i)=>i===mi?val:v)}:d));
  const togglePaid=(id,mi)=>setDebts(prev=>prev.map(d=>d.id===id?{...d,paid:d.paid.map((v,i)=>i===mi?!v:v)}:d));
  const updStreamAmt=(id,mi,val)=>setIncomeStreams(prev=>prev.map(s=>s.id===id?{...s,amounts:s.amounts.map((v,i)=>i===mi?val:v)}:s));
  const updSaving=(mi,val)=>setSavings(prev=>prev.map((v,i)=>i===mi?val:v));
  const addMonthExp=mi=>setMonthExtras(prev=>{const n=prev.map(a=>[...a]);n[mi]=[...n[mi],{id:uid(),name:"",amount:0}];return n});
  const updMonthExp=(mi,id,field,val)=>setMonthExtras(prev=>{const n=prev.map(a=>a.map(e=>({...e})));n[mi]=n[mi].map(e=>e.id===id?{...e,[field]:val}:e);return n});
  const delMonthExp=(mi,id)=>setMonthExtras(prev=>{const n=prev.map(a=>[...a]);n[mi]=n[mi].filter(e=>e.id!==id);return n});

  const actions=useMemo(()=>{const acts=[];debts.forEach(d=>{const paidAmt=d.schedule.reduce((a,v,i)=>a+(d.paid[i]?v:0),0);const isCleared=paidAmt>=d.total&&d.total>0;d.schedule.forEach((v,mi)=>{if(v>0)acts.push({id:`${d.id}-${mi}`,task:`Pay ${d.name} \u2014 ${fmt(v,"RON",rates)}`,month:MONTHS[mi],status:d.paid[mi]?"Done":"Pending",cleared:isCleared})})});owed.forEach(o=>{if(o.status!=="Collected")acts.push({id:`ow-${o.id}`,task:`Collect from ${o.name} \u2014 ${fmt(o.amount,"RON",rates)}`,month:"Ongoing",status:o.status==="Partial"?"In Progress":"Pending",cleared:false})});return acts},[debts,owed,rates]);

  const tabs=[{id:"dashboard",label:"Dashboard"},{id:"monthly",label:"Monthly"},{id:"income",label:"Income"},{id:"debts",label:"Debts"},{id:"savings",label:"Savings"},{id:"owed",label:"Owed to Me"},{id:"plans",label:"Major Plans"},{id:"actions",label:"Actions"},{id:"settings",label:"Settings"}];

  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Outfit',sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <style>{`*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.dim};border-radius:3px}input[type=number]::-webkit-inner-spin-button{opacity:0}input:focus{border-color:${C.gold}!important}select:focus{border-color:${C.gold}!important}table{border-collapse:collapse;width:100%}input,select{font-size:16px!important}`}</style>

    <header style={{borderBottom:`1px solid ${C.pb}`,padding:"20px 24px"}}><div style={{maxWidth:1300,margin:"0 auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}><div><div style={{fontSize:10,fontWeight:700,color:C.gold,letterSpacing:4,textTransform:"uppercase"}}>Budget Planner</div><h1 style={{fontSize:28,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#f0ece4",letterSpacing:-.5}}>2026</h1></div><div style={{display:"flex",gap:3,background:C.panel,borderRadius:8,padding:3,border:`1px solid ${C.pb}`}}>{["RON","EUR","USD","GBP"].map(c=>(<button key={c} onClick={()=>setCur(c)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,fontFamily:"'Outfit',sans-serif",letterSpacing:1,background:cur===c?C.gold:"transparent",color:cur===c?C.bg:C.muted}}>{c}</button>))}</div></div>
    <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}><Stat label="Monthly Income" value={f(salaryRON)} color={C.green}/><Stat label="Expenses" value={f(totalFixed)} color={C.red}/><Stat label="Debt Left" value={f(totalRemaining)} color={totalRemaining<=0?C.green:C.red}/><Stat label="Savings Target" value={f(annualSavings)} color={C.gold}/></div></div></header>

    <nav style={{background:C.panel,borderBottom:`1px solid ${C.pb}`,position:"sticky",top:0,zIndex:10,padding:"0 24px"}}><div style={{maxWidth:1300,margin:"0 auto",display:"flex",gap:1,overflowX:"auto",padding:"6px 0"}}>{tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",background:tab===t.id?`${C.gold}15`:"transparent",color:tab===t.id?C.gold:C.muted,borderBottom:tab===t.id?`2px solid ${C.gold}`:"2px solid transparent"}}>{t.label}</button>))}</div></nav>

    <main style={{maxWidth:1300,margin:"0 auto",padding:"20px 24px 60px"}}>

    {tab==="dashboard"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="May \u2013 December 2026">Monthly Overview</Heading><div style={{overflowX:"auto"}}><table><thead><tr><Td head>Category</Td>{MO.map(m=><Td head align="right" key={m}>{m}</Td>)}<Td head align="right" color={C.gold}>TOTAL</Td></tr></thead><tbody>
        <tr><Td bold color={C.green}>Income</Td>{MO.map((_,i)=><Td align="right" color={C.green} key={i}>{f(income(i))}</Td>)}<Td align="right" bold color={C.gold}>{f(annualIncome)}</Td></tr>
        <tr><Td color={C.muted}>Fixed Expenses</Td>{MO.map((_,i)=><Td align="right" color={C.muted} key={i}>{f(totalFixed)}</Td>)}<Td align="right" color={C.muted}>{f(totalFixed*MI)}</Td></tr>
        <tr><Td color={C.muted}>Extra Expenses</Td>{MO.map((_,i)=><Td align="right" color={C.muted} key={i}>{monthExtra(i)>0?f(monthExtra(i)):"\u2014"}</Td>)}<Td align="right" color={C.muted}>{f(Array(MI).fill(0).reduce((s,_,i)=>s+monthExtra(i),0))}</Td></tr>
        <tr><Td bold color={C.red}>Debt Payments</Td>{MO.map((_,i)=><Td align="right" color={C.red} key={i}>{debtPmt(i)>0?f(debtPmt(i)):"\u2014"}</Td>)}<Td align="right" bold color={C.red}>{f(Array(MI).fill(0).reduce((s,_,i)=>s+debtPmt(i),0))}</Td></tr>
        <tr><Td bold color={C.purple}>Savings</Td>{MO.map((_,i)=><Td align="right" color={C.purple} key={i}>{savings[i]>0?f(savings[i]):"\u2014"}</Td>)}<Td align="right" bold color={C.purple}>{f(annualSavings)}</Td></tr>
        <tr style={{background:`${C.gold}08`}}><Td bold color={C.gold}>Net Balance</Td>{MO.map((_,i)=>{const n=net(i);return<Td align="right" bold color={n>=0?C.green:C.red} key={i}>{f(n)}</Td>})}<Td align="right" bold color={C.gold}>{f(Array(MI).fill(0).reduce((s,_,i)=>s+net(i),0))}</Td></tr>
      </tbody></table></div></Panel>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:16}}>
        <Panel><Heading>Debt Progress</Heading><div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:36,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:totalRemaining<=0?C.green:C.red}}>{f(totalRemaining)}</div><div style={{fontSize:11,color:C.muted}}>of {f(totalDebt)} \u00b7 {totalDebt>0?((totalPaid/totalDebt)*100).toFixed(0):0}% cleared</div><div style={{margin:"10px auto",maxWidth:280}}><Bar value={totalPaid} max={totalDebt} color={C.green} h={8}/></div></div>
        {debts.map(d=>{const p=d.schedule.reduce((a,v,i)=>a+(d.paid[i]?v:0),0);const done=p>=d.total&&d.total>0;return(<div key={d.id} style={{marginBottom:8,opacity:done?.4:1}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:600,textDecoration:done?"line-through":"none"}}>{d.name}</span><span style={{color:done?C.green:C.red,fontWeight:700}}>{done?"CLEARED":f(d.total-p)}</span></div><Bar value={p} max={d.total} color={done?C.green:C.gold} h={4}/></div>)})}</Panel>
        <Panel><Heading>Currency Summary</Heading><table><thead><tr><Td head/><Td head align="right">RON</Td><Td head align="right">EUR</Td><Td head align="right">USD</Td><Td head align="right">GBP</Td></tr></thead><tbody>
        {[{l:"Income",v:annualIncome,c:C.green},{l:"Expenses",v:totalFixed*MI,c:C.red},{l:"Debt",v:totalDebt,c:C.red},{l:"Savings",v:annualSavings,c:C.purple}].map((r,i)=>(<tr key={i}><Td bold color={r.c}>{r.l}</Td>{["RON","EUR","USD","GBP"].map(c=><Td key={c} align="right">{fmt(r.v,c,rates)}</Td>)}</tr>))}</tbody></table></Panel>
      </div>
    </div>)}

    {tab==="monthly"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{MONTHS.map((m,i)=><button key={m} onClick={()=>setSelMonth(i)} style={{padding:"8px 18px",borderRadius:8,border:`1px solid ${selMonth===i?C.gold:C.pb}`,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",background:selMonth===i?`${C.gold}15`:C.panel,color:selMonth===i?C.gold:C.muted}}>{MO[i]}</button>)}</div>
      <Panel><Heading>{MONTHS[selMonth]} 2026</Heading>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>{[{l:"Income",v:income(selMonth),c:C.green},{l:"Expenses",v:totalFixed+monthExtra(selMonth),c:C.muted},{l:"Debt",v:debtPmt(selMonth),c:C.red},{l:"Savings",v:savings[selMonth],c:C.purple},{l:"Net",v:net(selMonth),c:net(selMonth)>=0?C.green:C.red}].map((s,i)=>(<div key={i} style={{flex:1,minWidth:110,padding:"12px 14px",background:C.bg,borderRadius:8,borderLeft:`3px solid ${s.c}`}}><div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase"}}>{s.l}</div><div style={{fontSize:20,fontWeight:800,color:s.c,fontFamily:"'Cormorant Garamond',serif",marginTop:4}}>{f(s.v)}</div></div>))}</div>
        <h4 style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Fixed Expenses</h4>
        <table><tbody>{expenses.map((e,i)=><tr key={e.id} style={{background:i%2===0?`${C.bg}80`:"transparent"}}><Td>{e.name}</Td><Td align="right" bold>{f(e.amount)}</Td></tr>)}</tbody></table>
        <h4 style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:1,textTransform:"uppercase",margin:"20px 0 8px"}}>Extra Expenses \u2014 {MONTHS[selMonth]}</h4>
        <table><tbody>{(monthExtras[selMonth]||[]).map(e=>(<tr key={e.id}><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={e.name} onChange={v=>updMonthExp(selMonth,e.id,"name",v)} placeholder="Name"/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:100}}><Inp value={e.amount} onChange={v=>updMonthExp(selMonth,e.id,"amount",v)} color={C.gold}/></td><td style={{padding:4,borderBottom:`1px solid ${C.pb}`,width:40}}><Btn onClick={()=>delMonthExp(selMonth,e.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}</tbody></table>
        <Btn onClick={()=>addMonthExp(selMonth)}>+ Add {MONTHS[selMonth]} Expense</Btn>
        <h4 style={{fontSize:11,fontWeight:700,color:C.red,letterSpacing:1,textTransform:"uppercase",margin:"20px 0 8px"}}>Debt Payments \u2014 {MONTHS[selMonth]}</h4>
        <table><tbody>{debts.map((d,i)=>{const v=d.schedule[selMonth];const ip=d.paid[selMonth];const left=d.total-d.schedule.reduce((a,val,mi)=>a+(d.paid[mi]?val:0),0);return(<tr key={d.id} style={{opacity:ip&&v>0?.4:1}}><Td style={{textDecoration:ip&&v>0?"line-through":"none"}}>{d.name}</Td><Td align="right" color={C.muted} style={{fontSize:11}}>owes {f(Math.max(left,0))}</Td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:90}}><Inp value={v} onChange={val=>updDebtSchedule(d.id,selMonth,val)} color={v>0?C.red:C.dim}/></td><Td align="center">{v>0&&<Btn onClick={()=>togglePaid(d.id,selMonth)} variant="sm" color={ip?C.green:C.red}>{ip?"\u2713 PAID":"MARK PAID"}</Btn>}</Td></tr>)})}
        <tr style={{background:`${C.red}10`}}><Td bold color={C.red}>Total</Td><Td/><Td align="right" bold color={C.red}>{f(debtPmt(selMonth))}</Td><Td/></tr></tbody></table>
        <div style={{marginTop:12,padding:12,background:C.bg,borderRadius:8,border:`1px solid ${C.pb}`,fontSize:12,color:C.muted}}>Change any amount to reschedule. Reduce this month, add the balance to next month.</div>
      </Panel>
    </div>)}

    {tab==="income"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Edit amounts \u2014 everything recalculates automatically">Income Streams</Heading><div style={{overflowX:"auto"}}><table><thead><tr><Td head>Source</Td>{MO.map(m=><Td head align="center" key={m}>{m}</Td>)}<Td head align="right">Total</Td><Td head/></tr></thead><tbody>
        <tr style={{background:`${C.green}08`}}><Td bold color={C.green}>Salary</Td>{MO.map((_,i)=><Td align="center" color={C.green} key={i}>{f(salaryRON)}</Td>)}<Td align="right" bold color={C.green}>{f(salaryRON*MI)}</Td><Td/></tr>
        {incomeStreams.map(s=>(<tr key={s.id}><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={s.name} onChange={v=>updList(setIncomeStreams,s.id,"name",v)}/></td>{MO.map((_,mi)=><td key={mi} style={{padding:"3px 2px",borderBottom:`1px solid ${C.pb}`}}><Inp value={s.amounts[mi]||0} onChange={v=>updStreamAmt(s.id,mi,v)} w={65} color={C.gold}/></td>)}<Td align="right" bold>{f(s.amounts.reduce((a,b)=>a+b,0))}</Td><td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setIncomeStreams,s.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}
        <tr style={{background:`${C.gold}08`}}><Td bold color={C.gold}>TOTAL</Td>{MO.map((_,i)=><Td align="center" bold color={C.gold} key={i}>{f(income(i))}</Td>)}<Td align="right" bold color={C.gold}>{f(annualIncome)}</Td><Td/></tr>
      </tbody></table></div><Btn onClick={()=>addToList(setIncomeStreams,{id:uid(),name:"",amounts:Array(MI).fill(0)})}>+ Add Income Stream</Btn></Panel>
    </div>)}

    {tab==="debts"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Edit amounts, move payments between months, mark as paid">Debt Schedule</Heading>
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}><Stat label="Total Owed" value={f(totalDebt)} color={C.red}/><Stat label="Paid" value={f(totalPaid)} color={C.green}/><Stat label="Remaining" value={f(totalRemaining)} color={totalRemaining<=0?C.green:C.gold}/></div>
        <div style={{overflowX:"auto"}}><table><thead><tr><Td head>Creditor</Td><Td head align="right">Owed</Td><Td head align="right" color={C.green}>Paid</Td><Td head align="right" color={C.gold}>Left</Td>{MO.map(m=><Td head align="center" key={m}>{m}</Td>)}<Td head>Deadline</Td><Td head/></tr></thead>
        <tbody>{debts.map((d,i)=>{const paid=d.schedule.reduce((a,v,mi)=>a+(d.paid[mi]?v:0),0);const left=d.total-paid;const done=left<=0&&d.total>0;return(<tr key={d.id} style={{background:done?`${C.green}05`:i%2===0?`${C.bg}60`:"transparent"}}>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={d.name} onChange={v=>updList(setDebts,d.id,"name",v)} style={{textDecoration:done?"line-through":"none",opacity:done?.5:1}}/></td>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:80}}><Inp value={d.total} onChange={v=>updList(setDebts,d.id,"total",v)} color={C.red}/></td>
          <Td align="right" bold color={C.green}>{f(paid)}</Td>
          <Td align="right" bold color={done?C.green:C.gold}>{done?"\u2713 CLEAR":f(left)}</Td>
          {d.schedule.map((v,mi)=>(<td key={mi} style={{padding:"3px 2px",borderBottom:`1px solid ${C.pb}`,textAlign:"center"}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><Inp value={v} onChange={val=>updDebtSchedule(d.id,mi,val)} w={58} color={d.paid[mi]?C.green:v>0?C.blue:C.dim} style={{border:d.paid[mi]?`1px solid ${C.green}40`:undefined,background:d.paid[mi]?`${C.green}10`:undefined}}/>{v>0&&<Btn onClick={()=>togglePaid(d.id,mi)} variant="sm" color={d.paid[mi]?C.green:C.muted}>{d.paid[mi]?"PAID \u2713":"MARK"}</Btn>}</div></td>))}
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={d.deadline} onChange={v=>updList(setDebts,d.id,"deadline",v)} w={90}/></td>
          <td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setDebts,d.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td>
        </tr>)})}
        <tr style={{background:`${C.red}10`}}><Td bold color={C.red}>TOTAL</Td><Td align="right" bold color={C.red}>{f(totalDebt)}</Td><Td align="right" bold color={C.green}>{f(totalPaid)}</Td><Td align="right" bold color={C.gold}>{f(totalRemaining)}</Td>{MO.map((_,i)=>{const v=debts.reduce((s,d)=>s+d.schedule[i],0);return<Td key={i} align="center" bold color={C.red}>{v>0?f(v):"\u2014"}</Td>})}<Td/><Td/></tr>
        </tbody></table></div>
        <Btn onClick={()=>addToList(setDebts,{id:uid(),name:"",total:0,schedule:Array(MI).fill(0),deadline:"",paid:Array(MI).fill(false)})}>+ Add Debt</Btn>
      </Panel>
      <Panel style={{opacity:.7}}><Heading sub="Not in current budget">Future Debts \u2014 2027+</Heading>
        <table><tbody>{futureDebts.map(d=>(<tr key={d.id}><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={d.name} onChange={v=>updList(setFutureDebts,d.id,"name",v)}/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:100}}><Inp value={d.amount} onChange={v=>updList(setFutureDebts,d.id,"amount",v)} color={C.muted}/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={d.notes} onChange={v=>updList(setFutureDebts,d.id,"notes",v)} placeholder="Notes"/></td><td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setFutureDebts,d.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}</tbody></table>
        <Btn onClick={()=>addToList(setFutureDebts,{id:uid(),name:"",amount:0,notes:""})}>+ Add Future Debt</Btn>
      </Panel>
    </div>)}

    {tab==="savings"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Edit monthly targets">Savings Tracker</Heading><div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:44,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:C.gold}}>{f(annualSavings)}</div><div style={{fontSize:12,color:C.muted}}>Annual Target</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>{MONTHS.map((m,i)=>(<div key={m} style={{padding:14,borderRadius:10,textAlign:"center",background:savings[i]>0?`${C.gold}08`:C.bg,border:`1px solid ${savings[i]>0?C.gd:C.pb}`}}><div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>{MO[i]}</div><Inp value={savings[i]} onChange={v=>updSaving(i,v)} w={80} color={C.gold}/><div style={{fontSize:10,color:C.dim,marginTop:6}}>Cum: {f(cumSaved(i))}</div></div>))}</div></Panel>
      <Panel><Heading>Growth Chart</Heading><div style={{display:"flex",alignItems:"flex-end",height:160,gap:8}}>{MONTHS.map((m,i)=>{const c=cumSaved(i);const mx=cumSaved(MI-1);return(<div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}><div style={{fontSize:9,fontWeight:700,color:C.gold,marginBottom:4}}>{f(c)}</div><div style={{width:"100%",background:C.gold,borderRadius:"4px 4px 0 0",height:`${mx>0?(c/mx)*70:0}%`,minHeight:c>0?3:0,transition:"height .5s ease"}}/><span style={{fontSize:10,fontWeight:700,color:C.muted,marginTop:6}}>{MO[i]}</span></div>)})}</div></Panel>
    </div>)}

    {tab==="owed"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Track money people owe you">Money Owed to Me</Heading><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:40,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:C.green}}>{f(totalOwed)}</div><div style={{fontSize:12,color:C.muted}}>Total Receivable</div></div>
        <table><thead><tr><Td head>Person</Td><Td head align="right">Amount</Td><Td head>Notes</Td><Td head>Status</Td><Td head/></tr></thead><tbody>{owed.map((o,i)=>(<tr key={o.id} style={{background:i%2===0?`${C.bg}60`:"transparent",opacity:o.status==="Collected"?.4:1}}><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={o.name} onChange={v=>updList(setOwed,o.id,"name",v)}/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:100}}><Inp value={o.amount} onChange={v=>updList(setOwed,o.id,"amount",v)} color={C.green}/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={o.notes||""} onChange={v=>updList(setOwed,o.id,"notes",v)} placeholder="Notes"/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:110}}><select value={o.status} onChange={e=>updList(setOwed,o.id,"status",e.target.value)} style={{padding:"6px 8px",borderRadius:6,border:`1px solid ${C.dim}`,background:C.bg,fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none",color:o.status==="Collected"?C.green:o.status==="Partial"?C.gold:C.muted,width:"100%"}}><option>Pending</option><option>Partial</option><option>Collected</option></select></td><td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setOwed,o.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}</tbody></table>
        <Btn onClick={()=>addToList(setOwed,{id:uid(),name:"",amount:0,status:"Pending",notes:""})}>+ Add Person</Btn></Panel>
    </div>)}

    {tab==="plans"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Track major planned expenses">Major Planned Expenses</Heading>
        <table><thead><tr><Td head>Expense</Td><Td head align="right">Cost (RON)</Td><Td head align="right">{cur}</Td><Td head>Target</Td><Td head>Status</Td><Td head>Notes</Td><Td head/></tr></thead><tbody>{majorPlans.map((p,i)=>(<tr key={p.id} style={{background:i%2===0?`${C.bg}60`:"transparent",opacity:p.status==="Done"?.4:1}}>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={p.name} onChange={v=>updList(setMajorPlans,p.id,"name",v)}/></td>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:100}}><Inp value={p.amount} onChange={v=>updList(setMajorPlans,p.id,"amount",v)} color={C.gold}/></td>
          <Td align="right" color={C.muted}>{f(p.amount)}</Td>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={p.target} onChange={v=>updList(setMajorPlans,p.id,"target",v)}/></td>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:120}}><select value={p.status} onChange={e=>updList(setMajorPlans,p.id,"status",e.target.value)} style={{padding:"6px 8px",borderRadius:6,border:`1px solid ${C.dim}`,background:C.bg,fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none",color:p.status==="Done"?C.green:p.status==="In Progress"?C.gold:C.muted,width:"100%"}}><option>Not Started</option><option>In Progress</option><option>Done</option></select></td>
          <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={p.notes||""} onChange={v=>updList(setMajorPlans,p.id,"notes",v)} placeholder="Notes"/></td>
          <td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setMajorPlans,p.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}</tbody></table>
        <div style={{marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><Btn onClick={()=>addToList(setMajorPlans,{id:uid(),name:"",amount:0,target:"",status:"Not Started",notes:""})}>+ Add Planned Expense</Btn><div style={{fontSize:13,fontWeight:700,color:C.gold}}>Total: {f(majorPlans.reduce((s,p)=>s+p.amount,0))}</div></div>
      </Panel>
    </div>)}

    {tab==="actions"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Auto-generated from debts and collections">Action Plan</Heading>
        <div style={{display:"flex",gap:10,marginBottom:20}}><Stat label="Total" value={actions.length} color={C.gold}/><Stat label="Done" value={actions.filter(a=>a.status==="Done").length} color={C.green}/><Stat label="Pending" value={actions.filter(a=>a.status==="Pending").length} color={C.red}/></div>
        <Bar value={actions.filter(a=>a.status==="Done").length} max={actions.length} color={C.green} h={8}/>
        <div style={{marginTop:20}}>{actions.map(a=>(<div key={a.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${C.pb}`,opacity:a.status==="Done"?.4:1}}><div style={{width:8,height:8,borderRadius:"50%",background:a.status==="Done"?C.green:a.status==="In Progress"?C.gold:C.red,flexShrink:0}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,textDecoration:a.status==="Done"?"line-through":"none"}}>{a.task}</div><div style={{display:"flex",gap:6,marginTop:4}}><Badge color={C.blue}>{a.month}</Badge><Badge color={a.status==="Done"?C.green:C.muted}>{a.status}</Badge></div></div></div>))}</div>
        {actions.length===0&&<div style={{textAlign:"center",padding:40,color:C.muted}}>No active debts or pending collections.</div>}
      </Panel>
    </div>)}

    {tab==="settings"&&(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel><Heading sub="Changes apply across every tab" right={<div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:11,color:C.green,fontWeight:600}}>{"\u2713"} Auto-saved</span>{resetConfirm?<div style={{display:"flex",gap:6}}><Btn onClick={handleReset} variant="filled" color={C.red} style={{padding:"4px 12px",fontSize:11}}>Yes, Reset</Btn><Btn onClick={()=>setResetConfirm(false)} variant="sm">Cancel</Btn></div>:<Btn onClick={()=>setResetConfirm(true)} variant="sm" color={C.muted}>Reset to Defaults</Btn>}</div>}>Settings</Heading>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          <div><h4 style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Exchange Rates (1 unit = RON)</h4>{["EUR","USD","GBP"].map(c=>(<div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.pb}`}}><span style={{fontWeight:600}}>1 {c}</span><Inp value={rates[c]} onChange={v=>setRates(p=>({...p,[c]:v||1}))} w={100} color={C.gold}/></div>))}</div>
          <div><h4 style={{fontSize:11,fontWeight:700,color:C.gold,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Primary Income</h4><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.pb}`}}><span style={{fontWeight:600}}>Salary (GBP)</span><Inp value={salaryGBP} onChange={setSalaryGBP} w={110} color={C.gold}/></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0"}}><span style={{fontWeight:600}}>= RON</span><span style={{fontWeight:800,color:C.green,fontSize:18}}>{fmt(salaryRON,"RON",rates)}</span></div></div>
        </div></Panel>
      <Panel><Heading sub="Apply to every month">Fixed Monthly Expenses</Heading>
        <table><thead><tr><Td head>Expense</Td><Td head align="right">Amount (RON)</Td><Td head align="right">{cur}</Td><Td head/></tr></thead><tbody>
        {expenses.map((e,i)=>(<tr key={e.id} style={{background:i%2===0?`${C.bg}60`:"transparent"}}><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`}}><Inp type="text" value={e.name} onChange={v=>updList(setExpenses,e.id,"name",v)}/></td><td style={{padding:"4px 6px",borderBottom:`1px solid ${C.pb}`,width:100}}><Inp value={e.amount} onChange={v=>updList(setExpenses,e.id,"amount",v)} color={C.gold}/></td><Td align="right" color={C.muted}>{f(e.amount)}</Td><td style={{padding:4,borderBottom:`1px solid ${C.pb}`}}><Btn onClick={()=>delFromList(setExpenses,e.id)} variant="sm" color={C.red}>{"\u2715"}</Btn></td></tr>))}
        <tr style={{background:`${C.red}10`}}><Td bold color={C.red}>TOTAL</Td><Td align="right" bold color={C.red}>{fmt(totalFixed,"RON",rates)}</Td><Td align="right" bold color={C.red}>{f(totalFixed)}</Td><Td/></tr>
        <tr style={{background:`${C.green}10`}}><Td bold color={C.green}>AVAILABLE</Td><Td align="right" bold color={C.green}>{fmt(salaryRON-totalFixed,"RON",rates)}</Td><Td align="right" bold color={C.green}>{f(salaryRON-totalFixed)}</Td><Td/></tr>
        </tbody></table><Btn onClick={()=>addToList(setExpenses,{id:uid(),name:"",amount:0})}>+ Add Expense</Btn></Panel>
    </div>)}

    </main>
    <footer style={{textAlign:"center",padding:"16px 24px 28px",borderTop:`1px solid ${C.pb}`}}><div style={{fontSize:9,color:C.dim,letterSpacing:2,textTransform:"uppercase"}}>Budget Planner 2026 \u00b7 Auto-saved \u00b7 Private to this device</div></footer>
  </div>);
}
