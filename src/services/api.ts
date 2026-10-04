/*
// All data access lives here. Each function is a mock; swap the body for fetch('/api/...') later.
import * as XLSX from 'xlsx';import {saveAs} from 'file-saver';
import {Document,Packer,Paragraph,TextRun,AlignmentType,PageBreak} from 'docx';
export type Q={id:string;standard:string;subject:string;topic:string;question:string;type:string;difficulty:string;marks:number;options:string[];answer:string};
export const standards=[{id:'10',name:'10th Standard'},{id:'11',name:'11th Standard (+1)'},{id:'12',name:'12th Standard (+2)'}];
export const subjects:Record<string,string[]>={'10':['Mathematics','Science','English'],'11':['Mathematics','Physics','Chemistry','Computer Science'],'12':['Mathematics','Physics','Chemistry','Biology']};
export const years=[2022,2023,2024,2025];
export const topics=['Algebra','Geometry','Mensuration','Statistics'];
// GET /api/standards, /api/subjects?standard=, /api/years?subject=  -> replace consts above.

function pdfBlob(lines:string[]){const esc=(s:string)=>s.replace(/[()\\]/g,'\\$&');
 const c='BT /F1 14 Tf 60 780 Td 22 TL '+lines.map(l=>`(${esc(l)}) Tj T*`).join(' ')+' ET';
 const o=['<</Type/Catalog/Pages 2 0 R>>','<</Type/Pages/Kids[3 0 R]/Count 1>>','<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',`<</Length ${c.length}>>\nstream\n${c}\nendstream`,'<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>'];
 let out='%PDF-1.4\n';const off:number[]=[];o.forEach((b,i)=>{off.push(out.length);out+=`${i+1} 0 obj\n${b}\nendobj\n`});
 const x=out.length;out+='xref\n0 6\n0000000000 65535 f \n'+off.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`;
 return new Blob([out],{type:'application/pdf'})}
// GET /api/papers?standard=&subject=&year= -> return {url:<file url>,name}. Mock builds a PDF in-browser; English 2025 is "missing" to demo the empty state.
export async function getPdf(std:string,subject:string,year:number){
 await new Promise(r=>setTimeout(r,500));if(subject==='English'&&year===2025)return null;
 const name=`${std}-${subject.toLowerCase().replace(/ /g,'')}-${year}.pdf`;
 const url=URL.createObjectURL(pdfBlob([`SCHOOL NAME - Annual Examination ${year}`,`Class ${std} | Subject: ${subject}`,'','Sample previous-year question paper (demo).','1. Find x if 2x + 4 = 10.','2. Find the square root of 144.','3. Area of rectangle 10 cm x 5 cm?']));
 return {url,name}}

// Built-in mock question bank. Real bank: Excel upload or GET /api/questions.
export function mockBank(std:string,subject:string):Q[]{const L='ABCD';return Array.from({length:120},(_,i)=>{
 const m=[1,1,1,1,2,2,2,3,3,5][i%10],a=2+i%5,x=3+i%7,b=1+i%9,l=4+i%8,w=2+i%5,t=topics[i%4],math=subject==='Mathematics';
 const type=m===1?'MCQ':m===5?'Long Answer':'Short Answer';let q='',opts:string[]=[],ans='';
 if(m===1){const v=[x,x+1,x+2,x+3],r=i%4;opts=math?v.map((_,k)=>String(v[(k+r)%4])):L.split('').map(c=>`Option ${c}`);q=math?`Find x if ${a}x + ${b} = ${a*x+b}.`:`Sample ${subject} MCQ ${i+1} (${t}).`;ans=math?L[opts.indexOf(String(x))]:'A'}
 else if(m===2){q=math?`Find the area of a rectangle of length ${l} cm and width ${w} cm.`:`Sample ${subject} short question ${i+1} (${t}).`;ans=math?`${l*w} cm²`:'See marking scheme'}
 else if(m===3){q=math?`Solve the equation ${a}x - ${a*x} = 0.`:`Sample ${subject} 3-mark question ${i+1} (${t}).`;ans=math?`x = ${x}`:'See marking scheme'}
 else{q=math?`Prove that the sum of the first n odd numbers is n², and verify for n = ${x}.`:`Explain in detail: ${subject} long question ${i+1} (${t}).`;ans='See marking scheme'}
 return {id:`Q${i+1}`,standard:std,subject,topic:t,question:q,type,difficulty:['Easy','Medium','Hard'][i%3],marks:m,options:opts,answer:ans}})}

// POST /api/questionbanks (multipart) -> parse server-side later. Here SheetJS parses in the browser.
export async function parseExcel(file:File):Promise<Q[]>{
 const wb=XLSX.read(await file.arrayBuffer());const rows:any[]=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
 if(!rows.length||!('Question' in rows[0])||!('Marks' in rows[0]))throw new Error('Invalid file: expected columns Question_ID, Standard, Subject, Topic, Question, Question_Type, Difficulty, Marks, Option_A–D, Correct_Answer.');
 return rows.map((r,i)=>({id:String(r.Question_ID??i),standard:String(r.Standard),subject:String(r.Subject),topic:String(r.Topic??''),question:String(r.Question),type:String(r.Question_Type),difficulty:String(r.Difficulty),marks:Number(r.Marks),options:[r.Option_A,r.Option_B,r.Option_C,r.Option_D].filter(Boolean).map(String),answer:String(r.Correct_Answer??'')}))}
export function downloadTemplate(){const q=mockBank('10','Mathematics').slice(0,10).map(q=>({Question_ID:q.id,Standard:q.standard,Subject:q.subject,Topic:q.topic,Question:q.question,Question_Type:q.type,Difficulty:q.difficulty,Marks:q.marks,Option_A:q.options[0],Option_B:q.options[1],Option_C:q.options[2],Option_D:q.options[3],Correct_Answer:q.answer}));
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(q),'Questions');XLSX.writeFile(wb,'sample-question-bank.xlsx')}

export type Prefs={counts:Record<number,number>;difficulty:string;topic:string;random:boolean};
// POST /api/papers/generate
export function generate(bank:Q[],std:string,subject:string,p:Prefs):Q[]{
 let pool=bank.filter(q=>q.standard===std&&q.subject===subject);
 if(!pool.length)throw new Error('The question bank has no questions for this standard and subject.');
 if(p.difficulty!=='Mixed')pool=pool.filter(q=>q.difficulty===p.difficulty);
 if(p.topic)pool=pool.filter(q=>q.topic===p.topic);
 const seen=new Set<string>(),out:Q[]=[];
 for(const m of [1,2,3,5]){const n=p.counts[m]||0;if(!n)continue;
  let c=pool.filter(q=>q.marks===m&&!seen.has(q.question));if(p.random)c=[...c].sort(()=>Math.random()-.5);
  if(c.length<n)throw new Error(`Only ${c.length} ${m}-mark question(s) match your filters; ${n} requested.`);
  c.slice(0,n).forEach(q=>{seen.add(q.question);out.push(q)})}
 return out}
// POST /api/papers  (save)  |  GET /api/papers
export const loadPapers=():any[]=>JSON.parse(localStorage.getItem('edupaper.papers')||'[]');
export function savePaper(p:any){localStorage.setItem('edupaper.papers',JSON.stringify([p,...loadPapers()].slice(0,50)))}

const SEC:Record<number,string>={1:'SECTION A – Multiple Choice Questions',2:'SECTION B – Short Answer Questions',3:'SECTION C – Short Answer Questions (3 Marks)',5:'SECTION D – Long Answer Questions'};
// GET /api/papers/:id/docx  -> could return a server-built file; here docx runs in the browser.
export async function downloadDocx(meta:any,qs:Q[],key:boolean){
 const P=(t:string,o:any={})=>new Paragraph({alignment:o.c?AlignmentType.CENTER:undefined,spacing:{after:o.a??120},indent:o.i?{left:o.i}:undefined,children:[new TextRun({text:t,bold:o.b,size:o.s})]});
 const ch:Paragraph[]=[P('SCHOOL NAME',{b:1,s:36,c:1}),P(`${meta.exam.toUpperCase()} – ${new Date().getFullYear()}`,{b:1,s:28,c:1}),P(`Class: ${meta.std}     Subject: ${meta.subject}`,{c:1}),P(`Duration: ${meta.duration}     Maximum Marks: ${meta.marks}`,{c:1,a:240}),P('General Instructions',{b:1}),...['Answer all questions.','Read each question carefully.','Marks are indicated against each question.'].map((t,i)=>P(`${i+1}. ${t}`,{i:300})),P('')];
 let n=0;for(const m of [1,2,3,5]){const g=qs.filter(q=>q.marks===m);if(!g.length)continue;ch.push(P(SEC[m],{b:1,s:26,a:200}));
  g.forEach(q=>{n++;ch.push(P(`${n}. ${q.question}  [${m} mark${m>1?'s':''}]`));q.options.forEach((o,k)=>ch.push(P(`${'ABCD'[k]}) ${o}`,{i:600,a:40})));ch.push(P('',{a:80}))})}
 if(key){ch.push(new Paragraph({children:[new PageBreak()]}),P('ANSWER KEY',{b:1,s:30,c:1,a:240}));
  let k=0;for(const m of [1,2,3,5])qs.filter(q=>q.marks===m).forEach(q=>{k++;ch.push(P(`${k}. ${q.answer}`))})}
 saveAs(await Packer.toBlob(new Document({sections:[{children:ch}]})),`${meta.exam.replace(/\s+/g,'_')}_${meta.subject}.docx`)}


*/

// All data access lives here. Each function is a mock; swap the body for fetch('/api/...') later.
import * as XLSX from 'xlsx';import {saveAs} from 'file-saver';
import {Document,Packer,Paragraph,TextRun,AlignmentType,PageBreak} from 'docx';
export type Q={id:string;standard:string;subject:string;topic:string;question:string;type:string;difficulty:string;marks:number;options:string[];answer:string};
export const standards=[{id:'10',name:'10th Standard'},{id:'11',name:'11th Standard (+1)'},{id:'12',name:'12th Standard (+2)'}];
export const subjects:Record<string,string[]>={'10':['Mathematics','Science','English'],'11':['Mathematics','Physics','Chemistry','Computer Science'],'12':['Mathematics','Physics','Chemistry','Biology']};
export const years=[2022,2023,2024,2025];
export const topics=['Algebra','Geometry','Mensuration','Statistics'];
// GET /api/standards, /api/subjects?standard=, /api/years?subject=  -> replace consts above.

function pdfBlob(lines:string[]){const esc=(s:string)=>s.replace(/[()\\]/g,'\\$&');
 const c='BT /F1 14 Tf 60 780 Td 22 TL '+lines.map(l=>`(${esc(l)}) Tj T*`).join(' ')+' ET';
 const o=['<</Type/Catalog/Pages 2 0 R>>','<</Type/Pages/Kids[3 0 R]/Count 1>>','<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',`<</Length ${c.length}>>\nstream\n${c}\nendstream`,'<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>'];
 let out='%PDF-1.4\n';const off:number[]=[];o.forEach((b,i)=>{off.push(out.length);out+=`${i+1} 0 obj\n${b}\nendobj\n`});
 const x=out.length;out+='xref\n0 6\n0000000000 65535 f \n'+off.map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`;
 return new Blob([out],{type:'application/pdf'})}
// GET /api/papers?standard=&subject=&year= -> return {url:<file url>,name}. Mock builds a PDF in-browser; English 2025 is "missing" to demo the empty state.
// Real PDFs live in /public/uploads. Key format: "standard|subject|year". Add one line per paper.
// Backend later: replace with GET /api/papers?standard=&subject=&year=
const PDF_MAP:Record<string,string>={
 '10|Mathematics|2022':'/uploads/10/Mathematics/Mathematics 2022.pdf',
 '10|Mathematics|2023':'/uploads/10/Mathematics/Mathematics 2023.pdf',
 '10|Mathematics|2024':'/uploads/10/Mathematics/Mathematics 2024.pdf',
};
export async function getPdf(std:string,subject:string,year:number){
 const real=PDF_MAP[`${std}|${subject}|${year}`];
 if(real)return {url:real,name:real.split('/').pop()!};
 await new Promise(r=>setTimeout(r,500));if(subject==='English'&&year===2025)return null;
 const name=`${std}-${subject.toLowerCase().replace(/ /g,'')}-${year}.pdf`;
 const url=URL.createObjectURL(pdfBlob([`SCHOOL NAME - Annual Examination ${year}`,`Class ${std} | Subject: ${subject}`,'','Sample previous-year question paper (demo).','1. Find x if 2x + 4 = 10.','2. Find the square root of 144.','3. Area of rectangle 10 cm x 5 cm?']));
 return {url,name}}

// Built-in mock question bank. Real bank: Excel upload or GET /api/questions.
export function mockBank(std:string,subject:string):Q[]{const L='ABCD';return Array.from({length:120},(_,i)=>{
 const m=[1,1,1,1,2,2,2,3,3,5][i%10],a=2+i%5,x=3+i%7,b=1+i%9,l=4+i%8,w=2+i%5,t=topics[i%4],math=subject==='Mathematics';
 const type=m===1?'MCQ':m===5?'Long Answer':'Short Answer';let q='',opts:string[]=[],ans='';
 if(m===1){const v=[x,x+1,x+2,x+3],r=i%4;opts=math?v.map((_,k)=>String(v[(k+r)%4])):L.split('').map(c=>`Option ${c}`);q=math?`Find x if ${a}x + ${b} = ${a*x+b}.`:`Sample ${subject} MCQ ${i+1} (${t}).`;ans=math?L[opts.indexOf(String(x))]:'A'}
 else if(m===2){q=math?`Find the area of a rectangle of length ${l} cm and width ${w} cm.`:`Sample ${subject} short question ${i+1} (${t}).`;ans=math?`${l*w} cm²`:'See marking scheme'}
 else if(m===3){q=math?`Solve the equation ${a}x - ${a*x} = 0.`:`Sample ${subject} 3-mark question ${i+1} (${t}).`;ans=math?`x = ${x}`:'See marking scheme'}
 else{q=math?`Prove that the sum of the first n odd numbers is n², and verify for n = ${x}.`:`Explain in detail: ${subject} long question ${i+1} (${t}).`;ans='See marking scheme'}
 return {id:`Q${i+1}`,standard:std,subject,topic:t,question:q,type,difficulty:['Easy','Medium','Hard'][i%3],marks:m,options:opts,answer:ans}})}

// POST /api/questionbanks (multipart) -> parse server-side later. Here SheetJS parses in the browser.
export async function parseExcel(file:File):Promise<Q[]>{
 const wb=XLSX.read(await file.arrayBuffer());const rows:any[]=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
 if(!rows.length||!('Question' in rows[0])||!('Marks' in rows[0]))throw new Error('Invalid file: expected columns Question_ID, Standard, Subject, Topic, Question, Question_Type, Difficulty, Marks, Option_A–D, Correct_Answer.');
 return rows.map((r,i)=>({id:String(r.Question_ID??i),standard:String(r.Standard),subject:String(r.Subject),topic:String(r.Topic??''),question:String(r.Question),type:String(r.Question_Type),difficulty:String(r.Difficulty),marks:Number(r.Marks),options:[r.Option_A,r.Option_B,r.Option_C,r.Option_D].filter(Boolean).map(String),answer:String(r.Correct_Answer??'')}))}
export function downloadTemplate(){const q=mockBank('10','Mathematics').slice(0,10).map(q=>({Question_ID:q.id,Standard:q.standard,Subject:q.subject,Topic:q.topic,Question:q.question,Question_Type:q.type,Difficulty:q.difficulty,Marks:q.marks,Option_A:q.options[0],Option_B:q.options[1],Option_C:q.options[2],Option_D:q.options[3],Correct_Answer:q.answer}));
 const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(q),'Questions');XLSX.writeFile(wb,'sample-question-bank.xlsx')}

export type Prefs={counts:Record<number,number>;difficulty:string;topic:string;random:boolean};
// POST /api/papers/generate
export function generate(bank:Q[],std:string,subject:string,p:Prefs):Q[]{
 let pool=bank.filter(q=>q.standard===std&&q.subject===subject);
 if(!pool.length)throw new Error('The question bank has no questions for this standard and subject.');
 if(p.difficulty!=='Mixed')pool=pool.filter(q=>q.difficulty===p.difficulty);
 if(p.topic)pool=pool.filter(q=>q.topic===p.topic);
 const seen=new Set<string>(),out:Q[]=[];
 for(const m of [1,2,3,5]){const n=p.counts[m]||0;if(!n)continue;
  let c=pool.filter(q=>q.marks===m&&!seen.has(q.question));if(p.random)c=[...c].sort(()=>Math.random()-.5);
  if(c.length<n)throw new Error(`Only ${c.length} ${m}-mark question(s) match your filters; ${n} requested.`);
  c.slice(0,n).forEach(q=>{seen.add(q.question);out.push(q)})}
 return out}
// POST /api/papers  (save)  |  GET /api/papers
export const loadPapers=():any[]=>JSON.parse(localStorage.getItem('edupaper.papers')||'[]');
export function savePaper(p:any){localStorage.setItem('edupaper.papers',JSON.stringify([p,...loadPapers()].slice(0,50)))}

const SEC:Record<number,string>={1:'SECTION A – Multiple Choice Questions',2:'SECTION B – Short Answer Questions',3:'SECTION C – Short Answer Questions (3 Marks)',5:'SECTION D – Long Answer Questions'};
// GET /api/papers/:id/docx  -> could return a server-built file; here docx runs in the browser.
export async function downloadDocx(meta:any,qs:Q[],key:boolean){
 const P=(t:string,o:any={})=>new Paragraph({alignment:o.c?AlignmentType.CENTER:undefined,spacing:{after:o.a??120},indent:o.i?{left:o.i}:undefined,children:[new TextRun({text:t,bold:o.b,size:o.s})]});
 const ch:Paragraph[]=[P('SCHOOL NAME',{b:1,s:36,c:1}),P(`${meta.exam.toUpperCase()} – ${new Date().getFullYear()}`,{b:1,s:28,c:1}),P(`Class: ${meta.std}     Subject: ${meta.subject}`,{c:1}),P(`Duration: ${meta.duration}     Maximum Marks: ${meta.marks}`,{c:1,a:240}),P('General Instructions',{b:1}),...['Answer all questions.','Read each question carefully.','Marks are indicated against each question.'].map((t,i)=>P(`${i+1}. ${t}`,{i:300})),P('')];
 let n=0;for(const m of [1,2,3,5]){const g=qs.filter(q=>q.marks===m);if(!g.length)continue;ch.push(P(SEC[m],{b:1,s:26,a:200}));
  g.forEach(q=>{n++;ch.push(P(`${n}. ${q.question}  [${m} mark${m>1?'s':''}]`));q.options.forEach((o,k)=>ch.push(P(`${'ABCD'[k]}) ${o}`,{i:600,a:40})));ch.push(P('',{a:80}))})}
 if(key){ch.push(new Paragraph({children:[new PageBreak()]}),P('ANSWER KEY',{b:1,s:30,c:1,a:240}));
  let k=0;for(const m of [1,2,3,5])qs.filter(q=>q.marks===m).forEach(q=>{k++;ch.push(P(`${k}. ${q.answer}`))})}
 saveAs(await Packer.toBlob(new Document({sections:[{children:ch}]})),`${meta.exam.replace(/\s+/g,'_')}_${meta.subject}.docx`)}
 