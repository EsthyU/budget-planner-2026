import { useState, useCallback, useMemo } from "react";

const MONTHS=["March","April","May","June","July","August","September","October","November","December"];
const MO=["MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const DEFAULT_RATES={EUR:5.0948,USD:4.3411,GBP:5.8739};
const sym={RON:" RON",EUR:"€",USD:"$",GBP:"£"};
const fmtN=(v,c,rates)=>{const n=c==="RON"?v:v/rates[c];const s=Math.abs(n)<0.5?"0":Math.abs(n).toLocaleString("en",{maximumFractionDigits:0});if(c==="RON")return`${n<0?"-":""}${s} RON`;return`${n<0?"-":""}${sym[c]}${s}`;};
let _id=100;const uid=()=>++_id;

const INIT_SALARY_GBP=1458.33;
const mkExp=(id,name,amount)=>({id,name,amount});
const mkDebt=(id,name,total,schedule,deadline)=>({id,name,total,schedule:[...schedule],deadline});
const INIT_EXPENSES=[mkExp("worktax","Work Tax (Partner)",1625),mkExp("nails","Nails",310),mkExp("food","Food & Groceries",500),mkExp("klarna","Klarna Payment",370),mkExp("internet","Internet",60),mkExp("netflix","Netflix",55),mkExp("claude","Claude AI",100),mkExp("transport","Transport",200),mkExp("skincare","Skincare & Body Care",150)];
const INIT_DEBTS=[mkDebt("awede","Pastor Awede",2349,[2349,0,0,0,0,0,0,0,0,0],"ALL March"),mkDebt("a","A",1720,[1400,320,0,0,0,0,0,0,0,0],"Majority Mar, rest Apr"),mkDebt("vivhalf","Vivian (half)",860,[860,0,0,0,0,0,0,0,0,0],"ALL March"),mkDebt("phd","PhD",300,[300,0,0,0,0,0,0,0,0,0],"ALL March"),mkDebt("omotolani","Omotolani (×2)",720,[360,360,0,0,0,0,0,0,0,0],"2 inst: Mar + Apr"),mkDebt("monica","Monica",850,[0,425,425,0,0,0,0,0,0,0],"2 inst: Apr + May"),mkDebt("ikemfeuna","Ikemfeuna",1155,[0,1155,0,0,0,0,0,0,0,0],"ALL April"),mkDebt("viv2500","Vivian (2,500 cash)",2500,[0,625,625,625,625,0,0,0,0,0],"Apr–Jul (625/mo)"),mkDebt("david","David",4500,[0,0,4500,0,0,0,0,0,0,0],"ALL May")];
const INIT_SAVINGS=[0,500,0,1000,1000,1500,1500,2000,2000,2000];
const OWED=[{id:"olivia",name:"Olivia",amount:925},{id:"emelda",name:"Emelda",amount:3240},{id:"given",name:"Given",amount:1000}];
const FUTURE_DEBTS=[{name:"Anderson",amount:510},{name:"Irene",amount:850},{name:"Adeola",amount:"TBD"}];
const ACTIONS=[{id:1,task:"Pay Pastor Awede — ALL 2,349",cat:"Debt",dl:"March",phase:1,p:"🔴"},{id:2,task:"Pay A — majority 1,400",cat:"Debt",dl:"March",phase:1,p:"🔴"},{id:3,task:"Pay Vivian — half 860",cat:"Debt",dl:"March",phase:1,p:"🔴"},{id:4,task:"Pay PhD — ALL 300",cat:"Debt",dl:"March",phase:1,p:"🔴"},{id:5,task:"Pay Omotolani — inst. 1/2",cat:"Debt",dl:"March",phase:1,p:"🔴"},{id:6,task:"Chase Olivia for 925 owed",cat:"Collect",dl:"March",phase:1,p:"🔴"},{id:7,task:"Chase Emelda for 3,240 owed",cat:"Collect",dl:"March",phase:1,p:"🔴"},{id:8,task:"Complete 2nd job interview",cat:"Income",dl:"Mar/Apr",phase:1,p:"🔴"},{id:9,task:"Pay A — remaining 320",cat:"Debt",dl:"April",phase:1,p:"🔴"},{id:10,task:"Pay Ikemfeuna — ALL 1,155",cat:"Debt",dl:"April",phase:1,p:"🔴"},{id:11,task:"Pay Omotolani — inst. 2/2",cat:"Debt",dl:"April",phase:2,p:"🔴"},{id:12,task:"Pay Monica — inst. 1/2",cat:"Debt",dl:"April",phase:2,p:"🔴"},{id:13,task:"Launch new business",cat:"Biz",dl:"May/Jun",phase:2,p:"🔴"},{id:14,task:"Pay David — ALL 4,500",cat:"Debt",dl:"May",phase:2,p:"🔴"},{id:15,task:"Pay Monica — inst. 2/2",cat:"Debt",dl:"May",phase:2,p:"🔴"},{id:16,task:"Pay Work Permit (€500)",cat:"Permit",dl:"Jun+",phase:2,p:"🟡"},{id:17,task:"Chase Given for 1,000",cat:"Collect",dl:"May",phase:2,p:"🟡"},{id:18,task:"Become DEBT-FREE 🎉",cat:"Goal",dl:"July",phase:3,p:"🔴"},{id:19,task:"Ramp savings 2,000/mo",cat:"Save",dl:"Oct+",phase:3,p:"🔴"},{id:20,task:"Build emergency fund",cat:"Save",dl:"Dec",phase:3,p:"🟡"},{id:21,task:"Passport Renewal (894)",cat:"Permit",dl:"Q4",phase:3,p:"🟡"},{id:22,task:"Scale business 1,000+",cat:"Biz",dl:"Q4",phase:3,p:"🟡"},{id:23,task:"Plan 2027 budget",cat:"Admin",dl:"Dec",phase:3,p:"🟢"}];
const MAJOR_NEEDS=[{name:"Work Permit",eur:500,target:"After debt"},{name:"School Fees",ron:33105,target:"2027–2028"},{name:"Passport Renewal",ron:894,target:"Q4 2026"},{name:"WES",ron:1144,target:"2027+"},{name:"Doctorate Defense",ron:3000,target:"2027+"}];
const catStyle={Debt:{bg:"#3a1c1c",tx:"#f87171"},Collect:{bg:"#1c2d3a",tx:"#60a5fa"},Income:{bg:"#1a2e1a",tx:"#4ade80"},Biz:{bg:"#2e2a1a",tx:"#fbbf24"},Permit:{bg:"#2a1a2e",tx:"#c084fc"},Save:{bg:"#1a2e1a",tx:"#4ade80"},Goal:{bg:"#2e2a1a",tx:"#fbbf24"},Admin:{bg:"#1e1e1e",tx:"#94a3b8"}};

// ── Editable Cell ──
const ECell=({value,onChange,align="right",color="#e2e0d8",bold,width})=>(
  <td style={{padding:"4px 6px",borderBottom:"1px solid #1e2a3a",textAlign:align}}>
    <input type="number" value={value} onChange={e=>onChange(Number(e.target.value)||0)}
      style={{width:width||"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #2a3a4a",background:"#0a0f1808",color,fontSize:14,fontWeight:bold?700:500,fontFamily:"'Outfit',sans-serif",textAlign:align,outline:"none",minWidth:50}} />
  </td>
);

// ── Editable Text Cell ──
const ETCell=({value,onChange,placeholder="Name"})=>(
  <td style={{padding:"4px 6px",borderBottom:"1px solid #1e2a3a"}}>
    <input type="text" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1px solid #2a3a4a",background:"transparent",color:"#e2e0d8",fontSize:13,fontWeight:600,fontFamily:"'Outfit',sans-serif",outline:"none"}} />
  </td>
);

const Cell=({children,align="left",bold,gold,red,green,muted,head,style:s})=>(<td style={{padding:head?"10px 12px":"8px 12px",textAlign:align,fontWeight:bold||head?700:400,fontSize:head?10:13,color:gold?"#d4a843":red?"#f87171":green?"#4ade80":muted?"#64748b":head?"#8a8a7a":"#e2e0d8",letterSpacing:head?1.2:0,textTransform:head?"uppercase":"none",borderBottom:"1px solid #1e2a3a",fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",...s}}>{children}</td>);
const Badge=({children,bg,tx})=>(<span style={{display:"inline-block",padding:"2px 10px",borderRadius:4,fontSize:10,fontWeight:700,background:bg,color:tx,letterSpacing:.8,textTransform:"uppercase",fontFamily:"'Outfit',sans-serif"}}>{children}</span>);
const SectionHead=({children,icon,gold})=>(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>{icon&&<span style={{fontSize:20}}>{icon}</span>}<h2 style={{margin:0,fontSize:18,fontWeight:700,fontFamily:"'Cormorant Garamond',serif",color:gold?"#d4a843":"#e2e0d8",letterSpacing:.5}}>{children}</h2><div style={{flex:1,height:1,background:"linear-gradient(90deg,#2a3a4a,transparent)"}}/></div>);
const Panel=({children,style:s,glow})=>(<div style={{background:"#0d1520",border:"1px solid #1a2535",borderRadius:12,padding:24,position:"relative",overflow:"hidden",...s}}>{glow&&<div style={{position:"absolute",top:-40,right:-40,width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${glow}15,transparent 70%)`,pointerEvents:"none"}}/>}<div style={{position:"relative"}}>{children}</div></div>);
const ProgressBar=({value,max,color="#d4a843",h=6})=>(<div style={{width:"100%",background:"#1a2535",borderRadius:99,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(max>0?(value/max)*100:0,100)}%`,background:`linear-gradient(90deg,${color},${color}cc)`,height:"100%",borderRadius:99,transition:"width .8s cubic-bezier(.4,0,.2,1)"}}/></div>);
const StatBox=({label,value,sub,color="#d4a843",icon})=>(<div style={{padding:"16px 20px",background:"#0a0f18",borderRadius:10,border:"1px solid #1a2535",flex:1,minWidth:150}}><div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:1.2,textTransform:"uppercase",fontFamily:"'Outfit',sans-serif",marginBottom:6}}>{icon} {label}</div><div style={{fontSize:22,fontWeight:800,color,fontFamily:"'Cormorant Garamond',serif"}}>{value}</div>{sub&&<div style={{fontSize:11,color:"#4a5568",marginTop:2}}>{sub}</div>}</div>);
const AddBtn=({onClick,label})=>(<button onClick={onClick} style={{padding:"8px 16px",borderRadius:8,border:"1px dashed #2a3a4a",background:"transparent",color:"#d4a843",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",marginTop:8,transition:"all .2s",letterSpacing:.5}} onMouseEnter={e=>{e.target.style.background="#d4a84310";e.target.style.borderColor="#d4a843"}} onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.borderColor="#2a3a4a"}}>+ {label}</button>);
const DelBtn=({onClick})=>(<button onClick={onClick} style={{padding:"2px 8px",borderRadius:4,border:"none",background:"#f8717120",color:"#f87171",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>✕</button>);
const StatusSelect=({value,onChange})=>{const colors={"Not Started":"#64748b","In Progress":"#fbbf24",Done:"#4ade80",Blocked:"#f87171"};return(<select value={value} onChange={e=>onChange(e.target.value)} style={{padding:"5px 8px",borderRadius:6,border:`1px solid ${colors[value]}40`,background:"#0a0f18",color:colors[value],fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none"}}>{Object.keys(colors).map(s=><option key={s}>{s}</option>)}</select>);};

export default function App(){
  const[tab,setTab]=useState("dashboard");
  const[cur,setCur]=useState("RON");
  const[rates,setRates]=useState(DEFAULT_RATES);
  const[salaryGBP,setSalaryGBP]=useState(INIT_SALARY_GBP);
  const[expenses,setExpenses]=useState(INIT_EXPENSES.map(e=>({...e})));
  const[debts,setDebts]=useState(INIT_DEBTS.map(d=>({...d,schedule:[...d.schedule]})));
  const[extraIncome,setExtraIncome]=useState(Array(10).fill(null).map(()=>[0,0,0,0]));
  const[customIncome,setCustomIncome]=useState([]);
  const[savings,setSavings]=useState([...INIT_SAVINGS]);
  const[debtPaid,setDebtPaid]=useState({});
  const[owedList,setOwedList]=useState(OWED.map(o=>({...o})));
  const[owedStatus,setOwedStatus]=useState({});
  const[actionStatus,setActionStatus]=useState({});
  const[customActions,setCustomActions]=useState([]);
  const[selMonth,setSelMonth]=useState(0);
  const[customMonthlyExp,setCustomMonthlyExp]=useState(Array(10).fill(null).map(()=>[]));

  const salaryRON=useMemo(()=>salaryGBP*rates.GBP,[salaryGBP,rates]);
  const totalFixed=useMemo(()=>expenses.reduce((s,e)=>s+e.amount,0),[expenses]);
  const f=useCallback((v)=>fmtN(v,cur,rates),[cur,rates]);
  const monthlyExtra=useCallback((i)=>(extraIncome[i]||[0,0,0,0]).reduce((a,b)=>a+b,0)+customIncome.reduce((s,ci)=>s+(ci.amounts[i]||0),0),[extraIncome,customIncome]);
  const monthlyIncome=useCallback((i)=>salaryRON+monthlyExtra(i),[salaryRON,monthlyExtra]);
  const monthlyCustomExp=useCallback((i)=>(customMonthlyExp[i]||[]).reduce((s,e)=>s+e.amount,0),[customMonthlyExp]);
  const totalMonthlyExp=useCallback((i)=>totalFixed+monthlyCustomExp(i),[totalFixed,monthlyCustomExp]);

  const monthlyDebt=useCallback((i)=>debts.reduce((s,d)=>s+(debtPaid[`${d.id}-${i}`]?0:d.schedule[i]),0),[debts,debtPaid]);
  const totalDebtOrig=useMemo(()=>debts.reduce((s,d)=>s+d.total,0),[debts]);
  const totalDebtPaidSoFar=useMemo(()=>debts.reduce((s,d)=>s+d.schedule.reduce((a,v,mi)=>a+(debtPaid[`${d.id}-${mi}`]?v:0),0),0),[debts,debtPaid]);
  const totalDebtRemaining=totalDebtOrig-totalDebtPaidSoFar;
  const monthlyNet=useCallback((i)=>monthlyIncome(i)-totalMonthlyExp(i)-monthlyDebt(i)-savings[i],[monthlyIncome,totalMonthlyExp,monthlyDebt,savings]);
  const cumSaved=useCallback((i)=>{let t=0;for(let j=0;j<=i;j++)t+=savings[j];return t;},[savings]);
  const annualIncome=useMemo(()=>Array(10).fill(0).reduce((s,_,i)=>s+monthlyIncome(i),0),[monthlyIncome]);
  const annualSavings=useMemo(()=>savings.reduce((a,b)=>a+b,0),[savings]);
  const totalOwed=useMemo(()=>owedList.reduce((s,o)=>s+o.amount,0),[owedList]);
  const collectedOwed=useMemo(()=>owedList.reduce((s,o)=>s+(owedStatus[o.id]==="Collected"?o.amount:owedStatus[o.id]==="Partial"?o.amount*.5:0),0),[owedList,owedStatus]);
  const allActions=useMemo(()=>[...ACTIONS,...customActions],[customActions]);
  const doneActions=useMemo(()=>Object.values(actionStatus).filter(s=>s==="Done").length,[actionStatus]);

  const updateExp=(id,field,val)=>setExpenses(p=>p.map(e=>e.id===id?{...e,[field]:val}:e));
  const addExpense=()=>setExpenses(p=>[...p,{id:"exp_"+uid(),name:"New Expense",amount:0}]);
  const delExpense=(id)=>setExpenses(p=>p.filter(e=>e.id!==id));
  const updateDebt=(id,field,val)=>setDebts(p=>p.map(d=>d.id===id?{...d,[field]:val}:d));
  const updateDebtSchedule=(id,mi,val)=>setDebts(p=>p.map(d=>{if(d.id!==id)return d;const ns=[...d.schedule];ns[mi]=val;return{...d,schedule:ns,total:ns.reduce((a,b)=>a+b,0)};}));
  const addDebt=()=>setDebts(p=>[...p,{id:"debt_"+uid(),name:"New Debt",total:0,schedule:Array(10).fill(0),deadline:"TBD"}]);
  const delDebt=(id)=>setDebts(p=>p.filter(d=>d.id!==id));
  const toggleDebtPaid=(did,mi)=>setDebtPaid(p=>({...p,[`${did}-${mi}`]:!p[`${did}-${mi}`]}));
  const updateExtra=(mi,si,val)=>setExtraIncome(p=>{const n=p.map(r=>[...r]);n[mi][si]=val;return n;});
  const addCustomIncome=()=>setCustomIncome(p=>[...p,{id:"ci_"+uid(),name:"New Stream",amounts:Array(10).fill(0)}]);
  const updateCustomIncomeName=(id,name)=>setCustomIncome(p=>p.map(c=>c.id===id?{...c,name}:c));
  const updateCustomIncomeAmt=(id,mi,val)=>setCustomIncome(p=>p.map(c=>{if(c.id!==id)return c;const a=[...c.amounts];a[mi]=val;return{...c,amounts:a};}));
  const delCustomIncome=(id)=>setCustomIncome(p=>p.filter(c=>c.id!==id));
  const updateSaving=(mi,val)=>setSavings(p=>{const n=[...p];n[mi]=val;return n;});
  const updateOwed=(id,field,val)=>setOwedList(p=>p.map(o=>o.id===id?{...o,[field]:val}:o));
  const addOwed=()=>setOwedList(p=>[...p,{id:"owed_"+uid(),name:"New Person",amount:0}]);
  const delOwed=(id)=>setOwedList(p=>p.filter(o=>o.id!==id));
  const addMonthlyExp=(mi)=>setCustomMonthlyExp(p=>{const n=p.map(a=>[...a]);n[mi]=[...n[mi],{id:"me_"+uid(),name:"New Item",amount:0}];return n;});
  const updateMonthlyExp=(mi,id,field,val)=>setCustomMonthlyExp(p=>{const n=p.map(a=>a.map(e=>({...e})));n[mi]=n[mi].map(e=>e.id===id?{...e,[field]:val}:e);return n;});
  const delMonthlyExp=(mi,id)=>setCustomMonthlyExp(p=>{const n=p.map(a=>[...a]);n[mi]=n[mi].filter(e=>e.id!==id);return n;});
  const addAction=(phase)=>setCustomActions(p=>[...p,{id:100+uid(),task:"New Task",cat:"Admin",dl:"TBD",phase,p:"🟡"}]);

  const tabs=[{id:"dashboard",label:"Dashboard",icon:"◈"},{id:"monthly",label:"Monthly",icon:"◉"},{id:"income",label:"Income",icon:"◆"},{id:"debts",label:"Debts",icon:"◇"},{id:"savings",label:"Savings",icon:"◈"},{id:"actions",label:"Actions",icon:"◉"},{id:"settings",label:"Settings",icon:"◆"},{id:"advice",label:"Advice",icon:"◇"}];

  return(<div style={{minHeight:"100vh",background:"#080c14",color:"#e2e0d8",fontFamily:"'Outfit','Segoe UI',sans-serif"}}>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#0a0f18}::-webkit-scrollbar-thumb{background:#2a3a4a;border-radius:3px}input[type=number]::-webkit-inner-spin-button{opacity:0}input:focus,select:focus{border-color:#d4a843!important;box-shadow:0 0 0 2px #d4a84320!important}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fadeUp{animation:fadeUp .5s ease-out forwards}table{border-collapse:collapse;width:100%}td,th{font-family:'Outfit',sans-serif}`}</style>

    {/* HEADER */}
    <div style={{background:"linear-gradient(135deg,#0a0f18,#111827 50%,#0d1520)",borderBottom:"1px solid #1a2535",padding:"24px 32px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,right:0,width:400,height:200,background:"radial-gradient(ellipse at top right,#d4a84308,transparent 60%)",pointerEvents:"none"}}/>
      <div style={{maxWidth:1400,margin:"0 auto",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#d4a843",letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>Annual Budget Planner</div>
            <h1 style={{margin:0,fontSize:32,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#f0ece4",letterSpacing:-.5}}>Financial Year 2026</h1>
          </div>
          <div style={{display:"flex",gap:4,background:"#0a0f18",borderRadius:8,padding:3,border:"1px solid #1a2535"}}>
            {["RON","EUR","USD","GBP"].map(c=>(<button key={c} onClick={()=>setCur(c)} style={{padding:"6px 14px",borderRadius:6,border:"none",cursor:"pointer",fontSize:11,fontWeight:800,fontFamily:"'Outfit',sans-serif",letterSpacing:1,background:cur===c?"linear-gradient(135deg,#d4a843,#b8942f)":"transparent",color:cur===c?"#080c14":"#64748b",transition:"all .2s"}}>{c}</button>))}
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
          <StatBox icon="◈" label="Monthly Income" value={f(salaryRON)} color="#4ade80"/>
          <StatBox icon="◇" label="Fixed Expenses" value={f(totalFixed)} color="#f87171"/>
          <StatBox icon="◆" label="Debt Remaining" value={f(totalDebtRemaining)} sub={`${totalDebtOrig>0?((totalDebtPaidSoFar/totalDebtOrig)*100).toFixed(0):0}% cleared`} color="#fbbf24"/>
          <StatBox icon="◈" label="Annual Savings" value={f(annualSavings)} color="#d4a843"/>
        </div>
      </div>
    </div>

    {/* NAV */}
    <div style={{background:"#0a0f18",borderBottom:"1px solid #1a2535",padding:"0 32px",position:"sticky",top:0,zIndex:10}}>
      <div style={{maxWidth:1400,margin:"0 auto",display:"flex",gap:2,overflowX:"auto",padding:"8px 0"}}>
        {tabs.map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",background:tab===t.id?"#d4a84318":"transparent",color:tab===t.id?"#d4a843":"#64748b",borderBottom:tab===t.id?"2px solid #d4a843":"2px solid transparent",transition:"all .2s"}}><span style={{marginRight:6,opacity:.6}}>{t.icon}</span>{t.label}</button>))}
      </div>
    </div>

    <div style={{maxWidth:1400,margin:"0 auto",padding:"24px 32px 60px"}}>

    {/* ═══ DASHBOARD ═══ */}
    {tab==="dashboard"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#d4a843"><SectionHead icon="◈" gold>Monthly Overview</SectionHead>
        <div style={{overflowX:"auto"}}><table><thead><tr><Cell head>Category</Cell>{MO.map(m=><Cell head align="right" key={m}>{m}</Cell>)}<Cell head align="right" style={{color:"#d4a843"}}>ANNUAL</Cell></tr></thead>
        <tbody>
          <tr><Cell bold green>💰 Income</Cell>{MO.map((_,i)=><Cell align="right" green bold key={i}>{f(monthlyIncome(i))}</Cell>)}<Cell align="right" gold bold>{f(annualIncome)}</Cell></tr>
          <tr><Cell muted>Expenses</Cell>{MO.map((_,i)=><Cell align="right" muted key={i}>{f(totalMonthlyExp(i))}</Cell>)}<Cell align="right" muted>{f(Array(10).fill(0).reduce((s,_,i)=>s+totalMonthlyExp(i),0))}</Cell></tr>
          <tr><Cell bold red>🔴 Debt</Cell>{MO.map((_,i)=><Cell align="right" red bold key={i}>{monthlyDebt(i)>0?f(monthlyDebt(i)):"—"}</Cell>)}<Cell align="right" red bold>{f(debts.reduce((s,d)=>s+d.schedule.reduce((a,v,mi)=>a+(debtPaid[`${d.id}-${mi}`]?0:v),0),0))}</Cell></tr>
          <tr><Cell bold style={{color:"#c084fc"}}>💎 Savings</Cell>{MO.map((_,i)=><Cell align="right" key={i} style={{color:"#c084fc"}}>{savings[i]>0?f(savings[i]):"—"}</Cell>)}<Cell align="right" style={{color:"#c084fc",fontWeight:700}}>{f(annualSavings)}</Cell></tr>
          <tr style={{background:"#d4a84308"}}><Cell bold gold>◈ Net Balance</Cell>{MO.map((_,i)=>{const n=monthlyNet(i);return<Cell align="right" key={i} bold style={{color:n>=0?"#4ade80":"#f87171"}}>{f(n)}</Cell>;})}<Cell align="right" gold bold>{f(Array(10).fill(0).reduce((s,_,i)=>s+monthlyNet(i),0))}</Cell></tr>
        </tbody></table></div>
      </Panel>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:20}}>
        <Panel glow="#f87171"><SectionHead icon="◇">Debt Elimination</SectionHead>
          <div style={{textAlign:"center",margin:"8px 0 20px"}}><div style={{fontSize:36,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#f87171"}}>{f(totalDebtRemaining)}</div><div style={{fontSize:11,color:"#64748b"}}>remaining of {f(totalDebtOrig)}</div><div style={{margin:"12px auto 0",maxWidth:300}}><ProgressBar value={totalDebtPaidSoFar} max={totalDebtOrig} color="#4ade80" h={8}/></div></div>
          {debts.map(d=>{const paid=d.schedule.reduce((a,v,mi)=>a+(debtPaid[`${d.id}-${mi}`]?v:0),0);const pp=d.total>0?(paid/d.total)*100:0;return(<div key={d.id} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}><span style={{fontWeight:600}}>{d.name}</span><span style={{color:pp>=100?"#4ade80":"#f87171",fontWeight:700}}>{pp>=100?"✓ PAID":f(d.total-paid)}</span></div><ProgressBar value={paid} max={d.total} color={pp>=100?"#4ade80":"#fbbf24"} h={4}/></div>);})}
        </Panel>
        <Panel glow="#4ade80"><SectionHead icon="◆">Money Owed to You</SectionHead>
          <div style={{textAlign:"center",margin:"8px 0 16px"}}><div style={{fontSize:36,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#4ade80"}}>{f(totalOwed)}</div></div>
          {owedList.map(o=>(<div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1a2535",gap:8}}>
            <div style={{flex:1}}><input type="text" value={o.name} onChange={e=>updateOwed(o.id,"name",e.target.value)} style={{background:"transparent",border:"none",color:"#e2e0d8",fontWeight:700,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",width:"100%"}}/><div><input type="number" value={o.amount} onChange={e=>updateOwed(o.id,"amount",Number(e.target.value)||0)} style={{background:"transparent",border:"none",color:"#64748b",fontSize:12,fontFamily:"'Outfit',sans-serif",outline:"none",width:100}}/></div></div>
            <select value={owedStatus[o.id]||"Pending"} onChange={e=>setOwedStatus(p=>({...p,[o.id]:e.target.value}))} style={{padding:"5px 10px",borderRadius:6,border:"1px solid #2a3a4a",background:"#0a0f18",fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:"pointer",outline:"none",color:(owedStatus[o.id]||"Pending")==="Collected"?"#4ade80":"#fbbf24"}}><option>Pending</option><option>Partial</option><option>Collected</option></select>
            <DelBtn onClick={()=>delOwed(o.id)}/>
          </div>))}
          <AddBtn onClick={addOwed} label="Add Person"/>
        </Panel>
      </div>
    </div>)}

    {/* ═══ MONTHLY ═══ */}
    {tab==="monthly"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{MONTHS.map((m,i)=>(<button key={m} onClick={()=>setSelMonth(i)} style={{padding:"8px 18px",borderRadius:8,border:"1px solid",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Outfit',sans-serif",borderColor:selMonth===i?"#d4a843":"#1a2535",background:selMonth===i?"#d4a84318":"#0a0f18",color:selMonth===i?"#d4a843":"#64748b"}}>{MO[i]}</button>))}</div>
      <Panel glow="#d4a843"><SectionHead icon="◉" gold>{MONTHS[selMonth]} 2026</SectionHead>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
          {[{l:"Income",v:monthlyIncome(selMonth),c:"#4ade80"},{l:"Expenses",v:totalMonthlyExp(selMonth),c:"#64748b"},{l:"Debt",v:monthlyDebt(selMonth),c:"#f87171"},{l:"Savings",v:savings[selMonth],c:"#c084fc"},{l:"Net",v:monthlyNet(selMonth),c:monthlyNet(selMonth)>=0?"#4ade80":"#f87171"}].map((s,i)=>(<div key={i} style={{flex:1,minWidth:120,padding:"14px 16px",background:"#0a0f18",borderRadius:8,borderLeft:`3px solid ${s.c}`}}><div style={{fontSize:10,fontWeight:700,color:"#64748b",letterSpacing:1,textTransform:"uppercase"}}>{s.l}</div><div style={{fontSize:22,fontWeight:800,color:s.c,fontFamily:"'Cormorant Garamond',serif",marginTop:4}}>{f(s.v)}</div></div>))}
        </div>

        {/* Expenses - editable */}
        <h4 style={{margin:"0 0 8px",fontSize:12,fontWeight:700,color:"#64748b",letterSpacing:1,textTransform:"uppercase"}}>Fixed Expenses (edit in Settings)</h4>
        <table><tbody>
          {expenses.map((e,i)=>(<tr key={e.id} style={{background:i%2===0?"#0a0f1880":"transparent"}}><Cell>{e.name}</Cell><Cell align="right" bold>{f(e.amount)}</Cell></tr>))}
        </tbody></table>

        {/* Custom monthly expenses */}
        <h4 style={{margin:"20px 0 8px",fontSize:12,fontWeight:700,color:"#fbbf24",letterSpacing:1,textTransform:"uppercase"}}>Extra Expenses — {MONTHS[selMonth]} Only</h4>
        <table><tbody>
          {(customMonthlyExp[selMonth]||[]).map((e,i)=>(<tr key={e.id} style={{background:i%2===0?"#0a0f1880":"transparent"}}>
            <ETCell value={e.name} onChange={v=>updateMonthlyExp(selMonth,e.id,"name",v)}/>
            <ECell value={e.amount} onChange={v=>updateMonthlyExp(selMonth,e.id,"amount",v)} color="#fbbf24" bold/>
            <td style={{padding:4,borderBottom:"1px solid #1e2a3a"}}><DelBtn onClick={()=>delMonthlyExp(selMonth,e.id)}/></td>
          </tr>))}
          <tr style={{background:"#fbbf2410"}}><Cell bold style={{color:"#fbbf24"}}>Total Extra</Cell><Cell align="right" bold style={{color:"#fbbf24"}}>{f(monthlyCustomExp(selMonth))}</Cell><td style={{borderBottom:"1px solid #1e2a3a"}}/></tr>
        </tbody></table>
        <AddBtn onClick={()=>addMonthlyExp(selMonth)} label={`Add ${MONTHS[selMonth]} Expense`}/>

        {/* Debts this month */}
        <h4 style={{margin:"20px 0 8px",fontSize:12,fontWeight:700,color:"#f87171",letterSpacing:1,textTransform:"uppercase"}}>Debt Payments — {MONTHS[selMonth]}</h4>
        {debts.filter(d=>d.schedule[selMonth]>0).length===0?<div style={{padding:16,background:"#4ade8010",borderRadius:8,textAlign:"center",color:"#4ade80",fontWeight:700}}>🎉 No debt payments this month!</div>
        :<table><tbody>{debts.filter(d=>d.schedule[selMonth]>0).map((d,i)=>{const ip=debtPaid[`${d.id}-${selMonth}`];return(<tr key={d.id} style={{background:i%2===0?"#f8717108":"transparent",opacity:ip?.4:1}}><Cell style={{textDecoration:ip?"line-through":"none"}}>{d.name}</Cell><Cell align="right" red bold>{f(d.schedule[selMonth])}</Cell><Cell align="center"><button onClick={()=>toggleDebtPaid(d.id,selMonth)} style={{padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Outfit',sans-serif",border:"none",background:ip?"#4ade8030":"#f8717130",color:ip?"#4ade80":"#f87171"}}>{ip?"✓ PAID":"MARK PAID"}</button></Cell></tr>);})}
        <tr style={{background:"#f8717115"}}><Cell bold red>Total</Cell><Cell align="right" red bold>{f(monthlyDebt(selMonth))}</Cell><Cell/></tr></tbody></table>}
      </Panel>
    </div>)}

    {/* ═══ INCOME ═══ */}
    {tab==="income"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#4ade80"><SectionHead icon="◆" gold>Income Streams — Fully Editable</SectionHead>
        <div style={{overflowX:"auto"}}><table><thead><tr><Cell head>Source</Cell>{MO.map(m=><Cell head align="center" key={m}>{m}</Cell>)}<Cell head align="right" style={{color:"#d4a843"}}>TOTAL</Cell><Cell head/></tr></thead>
        <tbody>
          <tr style={{background:"#4ade8008"}}><Cell bold green>💰 Salary</Cell>{MO.map((_,i)=><Cell align="center" green key={i}>{f(salaryRON)}</Cell>)}<Cell align="right" green bold>{f(salaryRON*10)}</Cell><Cell/></tr>
          {["💼 2nd Job","🚀 Business","🔧 Side Hustles","📥 Collections"].map((label,si)=>(<tr key={si} style={{background:si%2===0?"#0a0f1880":"transparent"}}><Cell bold style={{color:["#c084fc","#fbbf24","#06b6d4","#60a5fa"][si]}}>{label}</Cell>{MO.map((_,mi)=>(<ECell key={mi} value={(extraIncome[mi]||[0,0,0,0])[si]} onChange={v=>updateExtra(mi,si,v)} color={["#c084fc","#fbbf24","#06b6d4","#60a5fa"][si]}/>))}<Cell align="right" bold>{f(extraIncome.reduce((s,r)=>s+(r[si]||0),0))}</Cell><Cell/></tr>))}
          {customIncome.map(ci=>(<tr key={ci.id} style={{background:"#0a0f1880"}}><ETCell value={ci.name} onChange={v=>updateCustomIncomeName(ci.id,v)}/>{MO.map((_,mi)=>(<ECell key={mi} value={ci.amounts[mi]||0} onChange={v=>updateCustomIncomeAmt(ci.id,mi,v)} color="#d4a843"/>))}<Cell align="right" bold>{f(ci.amounts.reduce((a,b)=>a+b,0))}</Cell><td style={{padding:4,borderBottom:"1px solid #1e2a3a"}}><DelBtn onClick={()=>delCustomIncome(ci.id)}/></td></tr>))}
          <tr style={{background:"#d4a84310"}}><Cell bold gold>◈ TOTAL</Cell>{MO.map((_,i)=><Cell align="center" gold bold key={i}>{f(monthlyIncome(i))}</Cell>)}<Cell align="right" gold bold>{f(annualIncome)}</Cell><Cell/></tr>
        </tbody></table></div>
        <AddBtn onClick={addCustomIncome} label="Add Income Stream"/>
      </Panel>
    </div>)}

    {/* ═══ DEBTS ═══ */}
    {tab==="debts"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#f87171"><SectionHead icon="◇">Debt Repayment — Fully Editable</SectionHead>
        <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}><StatBox icon="◇" label="Original" value={f(totalDebtOrig)} color="#f87171"/><StatBox icon="◈" label="Paid" value={f(totalDebtPaidSoFar)} color="#4ade80"/><StatBox icon="◆" label="Remaining" value={f(totalDebtRemaining)} color="#fbbf24"/></div>
        <div style={{overflowX:"auto"}}><table><thead><tr><Cell head>Creditor</Cell><Cell head align="right">Total</Cell>{MO.map(m=><Cell head align="center" key={m}>{m}</Cell>)}<Cell head>Deadline</Cell><Cell head/></tr></thead>
        <tbody>{debts.map((d,i)=>{const paid=d.schedule.reduce((a,v,mi)=>a+(debtPaid[`${d.id}-${mi}`]?v:0),0);const done=paid>=d.total&&d.total>0;return(<tr key={d.id} style={{background:done?"#4ade8008":i%2===0?"#f8717105":"transparent"}}>
          <ETCell value={d.name} onChange={v=>updateDebt(d.id,"name",v)}/>
          <Cell align="right" red bold>{f(d.total)}</Cell>
          {d.schedule.map((v,mi)=>{const ip=debtPaid[`${d.id}-${mi}`];return(<td key={mi} style={{padding:"4px 2px",textAlign:"center",borderBottom:"1px solid #1e2a3a"}}>{v>0?(<button onClick={()=>toggleDebtPaid(d.id,mi)} style={{padding:"4px 6px",borderRadius:5,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,fontFamily:"'Outfit',sans-serif",minWidth:50,background:ip?"#4ade8025":"#1a2535",color:ip?"#4ade80":"#60a5fa"}}>{ip?"✓":f(v)}</button>):(<input type="number" value={v} onChange={e=>updateDebtSchedule(d.id,mi,Number(e.target.value)||0)} style={{width:50,padding:"4px",borderRadius:4,border:"1px solid #2a3a4a",background:"transparent",color:"#64748b",fontSize:11,textAlign:"center",fontFamily:"'Outfit',sans-serif",outline:"none"}}/>)}</td>);})}
          <ETCell value={d.deadline} onChange={v=>updateDebt(d.id,"deadline",v)}/>
          <td style={{padding:4,borderBottom:"1px solid #1e2a3a"}}><DelBtn onClick={()=>delDebt(d.id)}/></td>
        </tr>);})}
        <tr style={{background:"#f8717115"}}><Cell bold red>TOTAL</Cell><Cell align="right" red bold>{f(totalDebtOrig)}</Cell>{MO.map((_,i)=>{const v=debts.reduce((s,d)=>s+d.schedule[i],0);return<Cell key={i} align="center" red bold>{v>0?f(v):"—"}</Cell>;})}
        <Cell/><Cell/></tr>
        </tbody></table></div>
        <AddBtn onClick={addDebt} label="Add New Debt"/>
      </Panel>
      <Panel><SectionHead icon="◈">Elimination Timeline</SectionHead>
        {MO.map((m,i)=>{const cum=debts.reduce((s,d)=>{let t=0;for(let j=0;j<=i;j++)t+=d.schedule[j];return s+t;},0);const pct=totalDebtOrig>0?(cum/totalDebtOrig)*100:0;return(<div key={m} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><span style={{width:36,fontSize:11,fontWeight:700,color:"#64748b"}}>{m}</span><div style={{flex:1}}><ProgressBar value={cum} max={totalDebtOrig} color={pct>=100?"#4ade80":"#d4a843"} h={8}/></div><span style={{width:50,fontSize:12,fontWeight:700,textAlign:"right",color:pct>=100?"#4ade80":"#d4a843"}}>{pct.toFixed(0)}%</span></div>);})}
      </Panel>
      <Panel style={{opacity:.6}}><SectionHead icon="◇">Future Debts — 2027+</SectionHead>{FUTURE_DEBTS.map((d,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:13,color:"#64748b",borderBottom:"1px solid #1a2535"}}><span>{d.name}</span><span>{typeof d.amount==="number"?f(d.amount):d.amount}</span></div>))}</Panel>
    </div>)}

    {/* ═══ SAVINGS ═══ */}
    {tab==="savings"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#c084fc"><SectionHead icon="◈" gold>Savings — Editable Targets</SectionHead>
        <div style={{textAlign:"center",margin:"8px 0 24px"}}><div style={{fontSize:48,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#d4a843"}}>{f(annualSavings)}</div><div style={{fontSize:12,color:"#64748b"}}>Annual target</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10}}>{MONTHS.map((m,i)=>(<div key={m} style={{padding:16,borderRadius:10,textAlign:"center",background:savings[i]>0?"#d4a84308":"#0a0f18",border:`1px solid ${savings[i]>0?"#d4a84330":"#1a2535"}`}}><div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:8}}>{MO[i]}</div><input type="number" value={savings[i]} onChange={e=>updateSaving(i,Number(e.target.value)||0)} style={{width:80,padding:"5px 8px",borderRadius:6,border:"1px solid #d4a84350",background:"#d4a84312",color:"#d4a843",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",textAlign:"right",outline:"none"}}/><div style={{fontSize:10,color:"#4a5568",marginTop:6}}>Cum: {f(cumSaved(i))}</div></div>))}</div>
      </Panel>
      <Panel><SectionHead icon="◆">Cumulative Growth</SectionHead>
        <div style={{display:"flex",alignItems:"flex-end",height:180,gap:8,padding:"0 4px"}}>{MONTHS.map((m,i)=>{const cum=cumSaved(i);const mx=cumSaved(9);return(<div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%"}}><div style={{fontSize:9,fontWeight:700,color:"#d4a843",marginBottom:4}}>{f(cum)}</div><div style={{width:"100%",background:"linear-gradient(180deg,#d4a843,#b8942f80)",borderRadius:"6px 6px 0 0",height:`${mx>0?(cum/mx)*75:0}%`,minHeight:cum>0?4:0,transition:"height .6s cubic-bezier(.4,0,.2,1)"}}/><span style={{fontSize:10,fontWeight:700,color:"#64748b",marginTop:6}}>{MO[i]}</span></div>);})}</div>
      </Panel>
      <Panel><SectionHead icon="◇">Major Planned Expenses</SectionHead><table><thead><tr><Cell head>Expense</Cell><Cell head align="right">Cost</Cell><Cell head>Target</Cell></tr></thead><tbody>{MAJOR_NEEDS.map((n,i)=>{const cost=n.eur?n.eur*rates.EUR:n.ron;return(<tr key={i} style={{background:i%2===0?"#0a0f1860":"transparent"}}><Cell bold>{n.name}</Cell><Cell align="right" gold>{f(cost)}</Cell><Cell muted>{n.target}</Cell></tr>);})}</tbody></table></Panel>
    </div>)}

    {/* ═══ ACTIONS ═══ */}
    {tab==="actions"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#d4a843"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><SectionHead icon="◉" gold>Action Plan</SectionHead><div style={{fontSize:28,fontWeight:800,fontFamily:"'Cormorant Garamond',serif",color:"#d4a843"}}>{doneActions}/{allActions.length}</div></div><ProgressBar value={doneActions} max={allActions.length} color="#d4a843" h={10}/></Panel>
      {[{phase:1,title:"Phase 1 · Immediate",c:"#f87171"},{phase:2,title:"Phase 2 · Mid-Year",c:"#fbbf24"},{phase:3,title:"Phase 3 · Freedom",c:"#4ade80"}].map(p=>(<Panel key={p.phase}><h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:p.c}}>{p.title}</h3>
        {allActions.filter(a=>a.phase===p.phase).map(a=>{const st=actionStatus[a.id]||"Not Started";const cs=catStyle[a.cat]||catStyle.Admin;return(<div key={a.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:"1px solid #1a2535",flexWrap:"wrap"}}><span style={{fontSize:14,width:24,textAlign:"center"}}>{a.p}</span><div style={{flex:1,minWidth:200}}><div style={{fontSize:13,fontWeight:600,opacity:st==="Done"?.4:1,textDecoration:st==="Done"?"line-through":"none"}}>{a.task}</div><div style={{display:"flex",gap:6,marginTop:5}}><Badge bg={cs.bg} tx={cs.tx}>{a.cat}</Badge><Badge bg="#1a2535" tx="#64748b">{a.dl}</Badge></div></div><StatusSelect value={st} onChange={v=>setActionStatus(prev=>({...prev,[a.id]:v}))}/></div>);})}
        <AddBtn onClick={()=>addAction(p.phase)} label="Add Task"/>
      </Panel>))}
    </div>)}

    {/* ═══ SETTINGS ═══ */}
    {tab==="settings"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      <Panel glow="#d4a843"><SectionHead icon="◆" gold>Settings & Exchange Rates</SectionHead>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:20}}>
          <div><h4 style={{margin:"0 0 12px",fontSize:12,fontWeight:700,color:"#d4a843",letterSpacing:1,textTransform:"uppercase"}}>Exchange Rates</h4>{[["EUR",rates.EUR],["USD",rates.USD],["GBP",rates.GBP]].map(([c,v])=>(<div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a2535"}}><span style={{fontWeight:600}}>1 {c} =</span><div style={{display:"flex",alignItems:"center",gap:4}}><input type="number" value={v} onChange={e=>setRates(p=>({...p,[c]:Number(e.target.value)||1}))} style={{width:90,padding:"5px 8px",borderRadius:6,border:"1px solid #d4a84350",background:"#d4a84312",color:"#d4a843",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",textAlign:"right",outline:"none"}}/><span style={{fontSize:12,color:"#64748b"}}>RON</span></div></div>))}</div>
          <div><h4 style={{margin:"0 0 12px",fontSize:12,fontWeight:700,color:"#d4a843",letterSpacing:1,textTransform:"uppercase"}}>Primary Income</h4><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a2535"}}><span style={{fontWeight:600}}>Salary (GBP)</span><input type="number" value={salaryGBP} onChange={e=>setSalaryGBP(Number(e.target.value)||0)} style={{width:100,padding:"5px 8px",borderRadius:6,border:"1px solid #d4a84350",background:"#d4a84312",color:"#d4a843",fontSize:13,fontWeight:700,fontFamily:"'Outfit',sans-serif",textAlign:"right",outline:"none"}}/></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0"}}><span style={{fontWeight:600}}>= RON</span><span style={{fontWeight:800,color:"#4ade80",fontSize:16}}>{fmtN(salaryRON,"RON",rates)}</span></div></div>
        </div>
      </Panel>
      <Panel><SectionHead icon="◇">Monthly Fixed Expenses — Editable</SectionHead>
        <table><thead><tr><Cell head>Expense</Cell><Cell head align="right">Amount (RON)</Cell><Cell head align="right">{cur}</Cell><Cell head/></tr></thead><tbody>
        {expenses.map((e,i)=>(<tr key={e.id} style={{background:i%2===0?"#0a0f1860":"transparent"}}>
          <ETCell value={e.name} onChange={v=>updateExp(e.id,"name",v)}/>
          <ECell value={e.amount} onChange={v=>updateExp(e.id,"amount",v)} color="#d4a843" bold/>
          <Cell align="right" muted>{f(e.amount)}</Cell>
          <td style={{padding:4,borderBottom:"1px solid #1e2a3a"}}><DelBtn onClick={()=>delExpense(e.id)}/></td>
        </tr>))}
        <tr style={{background:"#f8717110"}}><Cell bold red>TOTAL</Cell><Cell align="right" red bold>{fmtN(totalFixed,"RON",rates)}</Cell><Cell align="right" red bold>{f(totalFixed)}</Cell><Cell/></tr>
        <tr style={{background:"#4ade8010"}}><Cell bold green>AVAILABLE</Cell><Cell align="right" green bold>{fmtN(salaryRON-totalFixed,"RON",rates)}</Cell><Cell align="right" green bold>{f(salaryRON-totalFixed)}</Cell><Cell/></tr>
        </tbody></table>
        <AddBtn onClick={addExpense} label="Add Expense"/>
      </Panel>
    </div>)}

    {/* ═══ ADVICE ═══ */}
    {tab==="advice"&&(<div className="fadeUp" style={{display:"flex",flexDirection:"column",gap:20}}>
      {[{t:"⚠️ Crunch Months",c:"#f87171",items:["March: 5,269 RON debt vs ~5,196 available — tiny 73 gap.","May: 5,550 RON debt — 354 gap covered by April's surplus.","Key: Don't spend April's surplus. It funds May."]},{t:"◈ Debt Strategy",c:"#d4a843",items:["March: Clear 5 debts — Awede, A, Vivian, PhD, Omotolani 1/2.","April: 5 payments. Stay disciplined.","May: David 4,500. After this, only Vivian remains.","July: Final payment. DEBT-FREE."]},{t:"💼 Income Streams",c:"#c084fc",items:["2nd Job at 2,000/mo: Debt-free by June.","Business (May/Jun): Reinvest 3 months, then draw 1,000+.","Collections: Emelda's 3,240 = one full month of debt."]},{t:"🎓 Work Permit & School",c:"#fbbf24",items:["Work Permit (€500 ≈ 2,547 RON): Fund from June surplus.","School Fees (33,105): At 2,000/mo = ~17 months.","Priority: Debt → Emergency → Permit → School."]},{t:"◈ Financial Freedom",c:"#4ade80",items:["Step 1 (Mar–Jul): Eliminate all 14,954 RON debt.","Step 2 (Aug–Dec): Build emergency fund.","Step 3 (2027): Grow to 3-month fund.","Step 4: Start investing. Golden Rule: Pay yourself first."]}].map((s,i)=>(<Panel key={i} glow={s.c}><h3 style={{margin:"0 0 16px",fontSize:17,fontWeight:700,color:s.c,fontFamily:"'Cormorant Garamond',serif"}}>{s.t}</h3>{s.items.map((item,j)=>(<div key={j} style={{padding:"8px 0 8px 16px",borderLeft:`2px solid ${s.c}30`,marginBottom:6,fontSize:13,lineHeight:1.7,color:"#c8c4bc"}}>{item}</div>))}</Panel>))}
    </div>)}

    </div>
    <div style={{textAlign:"center",padding:"20px 32px 32px",borderTop:"1px solid #1a2535"}}><div style={{fontSize:10,color:"#3a3a3a",letterSpacing:2,textTransform:"uppercase"}}>Annual Budget Planner 2026</div></div>
  </div>);
}
