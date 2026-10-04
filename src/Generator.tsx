import {useState} from 'react';
import {Sparkles,Upload,ArrowUp,ArrowDown,Trash2,Download,RefreshCw,Eye,Loader2} from 'lucide-react';
import {standards,subjects,topics,mockBank,parseExcel,downloadTemplate,generate,savePaper,loadPapers,downloadDocx,Q} from './services/api';

const inp='w-full border rounded-lg px-3 py-2 text-sm bg-white';
const L=({t,children}:any)=><label className="block text-sm font-medium text-slate-600">{t}{children}</label>;
export default function Generator(){
 const [std,setStd]=useState('10');const [subject,setSubject]=useState('Mathematics');const [exam,setExam]=useState('Quarterly Examination');
 const [duration,setDuration]=useState('2 Hours');const [marks,setMarks]=useState(50);
 const [counts,setCounts]=useState<Record<number,number>>({1:10,2:10,3:0,5:4});
 const [difficulty,setDifficulty]=useState('Mixed');const [topic,setTopic]=useState('');const [random,setRandom]=useState(true);const [key,setKey]=useState(true);
 const [bank,setBank]=useState<Q[]|null>(null);const [file,setFile]=useState('');
 const [qs,setQs]=useState<Q[]|null>(null);const [err,setErr]=useState('');const [ok,setOk]=useState('');const [busy,setBusy]=useState(false);const [showKey,setShowKey]=useState(false);const [add,setAdd]=useState('');
 const total=Object.entries(counts).reduce((s,[m,n])=>s+Number(m)*n,0),nq=Object.values(counts).reduce((a,b)=>a+b,0);
 const meta={exam,std:standards.find(s=>s.id===std)!.name,subject,duration,marks};
 const source=()=>bank??mockBank(std,subject);
 async function up(f?:File){if(!f)return;try{setBank(await parseExcel(f));setFile(f.name);setErr('')}catch(e:any){setErr(e.message)}}
 async function run(){setErr('');setOk('');
  if(!exam.trim())return setErr('Please enter an exam name.');
  if(nq<1)return setErr('Add at least one question.');
  if(total!==marks)return setErr(`The distribution adds up to ${total} marks but Maximum Marks is ${marks}.`);
  setBusy(true);await new Promise(r=>setTimeout(r,1200));
  try{const r=generate(source(),std,subject,{counts,difficulty,topic,random});setQs(r);setShowKey(false);
   savePaper({id:Date.now(),meta,qs:r,key,date:new Date().toLocaleDateString()});setOk('Question paper generated successfully!')}catch(e:any){setErr(e.message)}setBusy(false)}
 const move=(i:number,d:number)=>{const a=[...qs!];[a[i],a[i+d]]=[a[i+d],a[i]];setQs(a)};
 const avail=qs?source().filter(q=>q.standard===std&&q.subject===subject&&!qs.some(x=>x.question===q.question)):[];
 return <div className="space-y-6"><div><h1 className="text-3xl font-bold">Question Paper Generator</h1><p className="text-slate-500">Create customized examination papers from your question bank.</p></div>
  <section className="bg-white rounded-2xl p-6 shadow-sm grid sm:grid-cols-3 gap-4"><h2 className="sm:col-span-3 font-semibold">Step 1 · Examination Details</h2>
   <L t="Standard"><select className={inp} value={std} onChange={e=>{setStd(e.target.value);setSubject(subjects[e.target.value][0])}}>{standards.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></L>
   <L t="Subject"><select className={inp} value={subject} onChange={e=>setSubject(e.target.value)}>{subjects[std].map(s=><option key={s}>{s}</option>)}</select></L>
   <L t="Exam Name"><input className={inp} value={exam} onChange={e=>setExam(e.target.value)}/></L>
   <L t="Duration"><select className={inp} value={duration} onChange={e=>setDuration(e.target.value)}>{['1 Hour','1.5 Hours','2 Hours','3 Hours'].map(d=><option key={d}>{d}</option>)}</select></L>
   <L t="Maximum Marks"><input type="number" className={inp} value={marks} onChange={e=>setMarks(+e.target.value)}/></L>
   <L t="Question bank (Excel)"><div className="flex gap-2 items-center"><label className="flex items-center gap-1 border rounded-lg px-3 py-2 text-sm cursor-pointer bg-white"><Upload size={14}/>Upload<input type="file" accept=".xlsx,.xls" hidden onChange={e=>up(e.target.files?.[0])}/></label><button className="text-xs text-indigo-600 underline" onClick={downloadTemplate}>Sample .xlsx</button></div><span className="text-xs text-slate-400">{file||'Using built-in mock bank'}</span></L></section>
  <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4"><h2 className="font-semibold">Step 2 · Question Preferences</h2>
   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{[1,2,3,5].map(m=><div key={m} className="rounded-xl bg-indigo-50 p-3"><div className="text-xs text-indigo-700 font-medium">{m}-mark questions</div><input type="number" min={0} className={inp+' mt-1'} value={counts[m]} onChange={e=>setCounts({...counts,[m]:Math.max(0,+e.target.value)})}/></div>)}</div>
   <div className={`text-sm font-medium ${total===marks?'text-emerald-600':'text-amber-600'}`}>{nq} questions · {total} / {marks} marks</div>
   <div className="grid sm:grid-cols-2 gap-4"><L t="Difficulty"><select className={inp} value={difficulty} onChange={e=>setDifficulty(e.target.value)}>{['Mixed','Easy','Medium','Hard'].map(d=><option key={d}>{d}</option>)}</select></L>
    <L t="Topic (optional)"><select className={inp} value={topic} onChange={e=>setTopic(e.target.value)}><option value="">All topics</option>{topics.map(t=><option key={t}>{t}</option>)}</select></L></div>
   <div className="flex gap-6 text-sm"><label><input type="checkbox" checked={random} onChange={e=>setRandom(e.target.checked)}/> Random selection</label><label><input type="checkbox" checked={key} onChange={e=>setKey(e.target.checked)}/> Include answer key</label></div>
   <p className="text-xs text-slate-400">Question type follows marks: 1 = MCQ, 2–3 = Short Answer, 5 = Long Answer.</p></section>
  {err&&<div className="bg-red-50 text-red-700 rounded-lg p-3 text-sm">{err}</div>}{ok&&<div className="bg-emerald-50 text-emerald-700 rounded-lg p-3 text-sm">{ok}</div>}
  <button onClick={run} disabled={busy} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-700 to-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:opacity-90">{busy?<><Loader2 className="animate-spin"/>Preparing your examination paper…</>:<><Sparkles/>Generate Question Paper</>}</button>
  {qs&&<section className="space-y-3"><div className="flex flex-wrap gap-2">
    <button onClick={()=>downloadDocx(meta,qs,key)} className="flex gap-1 items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"><Download size={14}/>Download Word (.docx)</button>
    <button onClick={run} className="flex gap-1 items-center border bg-white px-4 py-2 rounded-lg text-sm"><RefreshCw size={14}/>Regenerate</button>
    <button onClick={()=>setShowKey(!showKey)} className="flex gap-1 items-center border bg-white px-4 py-2 rounded-lg text-sm"><Eye size={14}/>{showKey?'Hide':'Preview'} Answer Key</button>
    <select className="border rounded-lg px-2 text-sm bg-white" value={add} onChange={e=>{const q=avail.find(x=>x.id===e.target.value);if(q)setQs([...qs,q]);setAdd('')}}><option value="">+ Add question from bank…</option>{avail.slice(0,40).map(q=><option key={q.id} value={q.id}>[{q.marks}m] {q.question.slice(0,50)}</option>)}</select></div>
   <div className="bg-white shadow-xl mx-auto max-w-3xl p-10 sm:p-14 font-serif text-[15px] leading-relaxed">
    <div className="text-center"><h2 className="text-2xl font-bold">SCHOOL NAME</h2><div className="font-bold">{exam.toUpperCase()} – {new Date().getFullYear()}</div><div>Class: {meta.std} &nbsp; Subject: {subject}</div><div>Duration: {duration} &nbsp; Maximum Marks: {marks}</div></div>
    <h3 className="font-bold mt-4">General Instructions</h3><ol className="list-decimal ml-6"><li>Answer all questions.</li><li>Read each question carefully.</li><li>Marks are indicated against each question.</li></ol>
    {[1,2,3,5].map(m=>{const g=qs.filter(q=>q.marks===m);return g.length?<div key={m}><h3 className="font-bold mt-5 border-b">{{1:'SECTION A – Multiple Choice Questions',2:'SECTION B – Short Answer Questions',3:'SECTION C – Short Answer (3 Marks)',5:'SECTION D – Long Answer Questions'}[m]}</h3>
     {g.map(q=>{const i=qs.indexOf(q);return <div key={q.id} className="mt-3 flex gap-2"><div className="flex-1"><b>{i+1}.</b> {q.question} <i className="text-slate-500">[{m}]</i>{q.options.length>0&&<div className="grid grid-cols-2 ml-5">{q.options.map((o,k)=><span key={k}>{'ABCD'[k]}) {o}</span>)}</div>}{showKey&&<div className="text-emerald-700 text-sm">Answer: {q.answer}</div>}</div>
      <div className="flex font-sans text-slate-400"><button onClick={()=>i>0&&move(i,-1)}><ArrowUp size={14}/></button><button onClick={()=>i<qs.length-1&&move(i,1)}><ArrowDown size={14}/></button><button onClick={()=>setQs(qs.filter(x=>x!==q))}><Trash2 size={14}/></button></div></div>})}</div>:null})}
    <div className="text-center text-xs text-slate-400 mt-8 border-t pt-2">{meta.std} · {subject} · Page 1</div></div></section>}</div>}

export function Papers(){const p=loadPapers();
 return <div className="space-y-4"><h1 className="text-3xl font-bold">Generated Papers</h1>
  {!p.length?<div className="bg-white rounded-2xl p-12 text-center text-slate-500">No papers generated yet.</div>:<div className="bg-white rounded-2xl shadow-sm divide-y">{p.map(x=><div key={x.id} className="p-4 flex flex-wrap items-center gap-3 text-sm"><div className="flex-1"><b>{x.meta.exam}</b><div className="text-slate-500">{x.meta.std} · {x.meta.subject} · {x.qs.length} questions · {x.date}</div></div>
   <button onClick={()=>downloadDocx(x.meta,x.qs,x.key)} className="flex gap-1 items-center bg-indigo-600 text-white px-3 py-1.5 rounded-lg"><Download size={14}/>.docx</button></div>)}</div>}</div>}
