import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {motion,MotionConfig} from 'framer-motion';
import {BookOpen,FileText,GraduationCap,Menu,X,Sparkles,Lightbulb,Users,TrendingUp,Cog,Check,ArrowRight,Mail} from 'lucide-react';
import {APP_URL,CONTACT_EMAIL} from './config';

const grad='bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent';
const btn='inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400';
const primary=`${btn} bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50`;
const ghost=`${btn} border border-white/20 text-white hover:bg-white/10`;
function AppLink({className,children}:any){return /^https?:/.test(APP_URL)?<a href={APP_URL} className={className}>{children}</a>:<Link to={APP_URL} className={className}>{children}</Link>}
const R=({children,d=0,className=''}:any)=><motion.div className={className} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:d}}>{children}</motion.div>;
const Logo=()=><a href="#home" className="flex items-center gap-2.5" aria-label="JSSquared home"><span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 grid place-items-center text-white font-extrabold text-sm">JSS²</span><span className="leading-none"><b className="block text-white text-lg tracking-tight">JSSquared</b><span className="text-[10px] tracking-[.2em] text-blue-300">EDTECH SOLUTIONS</span></span></a>;
const links=[['Home','#home'],['Solutions','#solutions'],['About Us','#about'],['Contact','#contact']];

function Navbar(){const [sc,setSc]=useState(false);const [open,setOpen]=useState(false);
 useEffect(()=>{const f=()=>setSc(scrollY>20);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[]);
 return <header className={`fixed top-0 inset-x-0 z-50 transition ${sc||open?'bg-slate-950/85 backdrop-blur-lg border-b border-white/10':'bg-transparent'}`}>
  <div className="max-w-6xl mx-auto h-18 py-3 px-5 flex items-center justify-between"><Logo/>
   <nav className="hidden md:flex items-center gap-8" aria-label="Main">{links.map(([l,h])=><a key={l} href={h} className="text-sm text-slate-300 hover:text-white relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-violet-400 after:transition-all">{l}</a>)}<AppLink className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition">Login</AppLink></nav>
   <button className="md:hidden text-white" aria-label="Toggle menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
  {open&&<nav className="md:hidden px-5 pb-4 flex flex-col gap-3" aria-label="Mobile">{links.map(([l,h])=><a key={l} href={h} onClick={()=>setOpen(false)} className="text-slate-200 py-1">{l}</a>)}<AppLink className="text-center py-2 rounded-lg font-semibold text-white bg-violet-600">Login</AppLink></nav>}</header>}

function DashboardPreview({large=false}:{large?:boolean}){const bars=[4,7,5,9,12,10];
 return <div className="rounded-2xl bg-slate-100 shadow-2xl shadow-indigo-950/60 ring-1 ring-white/20 overflow-hidden text-slate-800 select-none" aria-hidden="true">
  <div className="flex items-center gap-1.5 px-3 py-2 bg-white border-b"><i className="w-2.5 h-2.5 rounded-full bg-red-400"/><i className="w-2.5 h-2.5 rounded-full bg-amber-400"/><i className="w-2.5 h-2.5 rounded-full bg-emerald-400"/><span className="ml-3 text-[10px] text-slate-400">EduPaper – Smart Examination Suite</span></div>
  <div className="flex"><div className="w-12 bg-gradient-to-b from-slate-950 to-indigo-950 py-3 flex flex-col items-center gap-3 text-slate-400"><GraduationCap size={16} className="text-indigo-300"/><BookOpen size={14}/><FileText size={14}/></div>
   <div className={`flex-1 p-4 space-y-3 ${large?'sm:p-6':''}`}><div><div className="font-bold text-sm">Welcome back, Teacher!</div><div className="text-[10px] text-slate-500">Manage question banks and create examination papers effortlessly.</div></div>
    <div className="grid grid-cols-2 gap-2">{[['Total Question Papers','48'],['Available Subjects','9']].map(([l,v])=><div key={l} className="bg-white rounded-lg p-2.5"><div className="text-lg font-bold text-indigo-700">{v}</div><div className="text-[9px] text-slate-500">{l}</div></div>)}</div>
    <div className="grid grid-cols-2 gap-2">{[[BookOpen,'Question Bank'],[FileText,'Question Paper Generator']].map(([I,t]:any)=><div key={t} className="rounded-lg p-2.5 text-white bg-gradient-to-br from-slate-900 to-indigo-600"><I size={14}/><div className="text-[10px] font-semibold mt-1">{t}</div></div>)}</div>
    <div className="grid grid-cols-2 gap-2"><div className="bg-white rounded-lg p-2.5"><div className="text-[9px] font-semibold mb-1">Papers generated</div><div className="flex items-end gap-1 h-12">{bars.map((v,i)=><div key={i} className="flex-1 rounded-t bg-gradient-to-t from-indigo-700 to-indigo-400" style={{height:v*4}}/>)}</div></div>
     <div className="bg-white rounded-lg p-2.5 text-[9px] text-slate-600 space-y-1"><div className="font-semibold">Recent activity</div><div>Generated Quarterly Exam</div><div>Viewed 10th Maths 2023</div></div></div></div></div></div>}

function Hero(){return <section id="home" className="relative overflow-hidden bg-slate-950 pt-32 pb-24 scroll-mt-20">
  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-700/30 blur-[120px]"/><div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-violet-700/30 blur-[120px]"/>
  <div className="relative max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">
   <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
    <span className="inline-block px-3 py-1 rounded-full text-xs text-blue-200 bg-white/10 border border-white/15">JSSquared | Education Technology Solutions</span>
    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-5 leading-[1.1] tracking-tight">Transforming Education with <span className={grad}>Smarter Digital</span> Solutions.</h1>
    <p className="text-slate-300 mt-5 text-lg max-w-xl">At JSSquared, we empower educational institutions with innovative technology that simplifies academic workflows, modernizes assessments, and creates better digital learning experiences.</p>
    <div className="flex flex-wrap gap-3 mt-8"><AppLink className={primary}>Explore EduPaper Demo <ArrowRight size={18}/></AppLink><a href="#solutions" className={ghost}>Discover Our Solutions</a></div>
    <p className="text-sm text-slate-400 mt-6">Technology designed for schools, teachers, and tomorrow's learners.</p></motion.div>
   <motion.div className="relative" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{duration:.7,delay:.2}}>
    <motion.div animate={{y:[0,-10,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}><DashboardPreview/></motion.div>
    <motion.div animate={{y:[0,8,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}} className="absolute -bottom-4 -left-4 sm:-left-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm"><Sparkles size={16} className="text-violet-300"/>Smart Examination Management</motion.div></motion.div></div></section>}

const sols=[[BookOpen,'Digital Question Bank','Organize previous-year question papers by standard, subject, and academic year. Give students and teachers quick access to structured academic resources.',['Organized question paper library','Standard and subject-based filtering','Previous-year PDF access','Centralized academic resources'],true],
 [FileText,'Smart Exam Paper Generator','Help teachers prepare examination papers efficiently by selecting random questions from structured question banks.',['Randomized question selection','Custom examination configuration','Multiple question types','Downloadable Word documents'],true],
 [GraduationCap,'Digital Academic Workflows','Modernize academic resource management with intuitive digital workflows that reduce repetitive manual tasks.',['Centralized academic content','Efficient resource management','Simple teacher workflows','Scalable digital architecture'],false]] as any[];
const Head=({t,s,dark=false}:any)=><R className="text-center max-w-2xl mx-auto mb-12"><h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${dark?'text-white':'text-slate-900'}`}>{t}</h2><p className={`mt-3 ${dark?'text-slate-300':'text-slate-600'}`}>{s}</p></R>;
function Solutions(){return <section id="solutions" className="py-24 bg-white scroll-mt-16"><div className="max-w-6xl mx-auto px-5"><Head t="Technology That Simplifies Education" s="Purpose-built digital solutions that help educational institutions modernize the way they manage academic operations."/>
  <div className="grid md:grid-cols-3 gap-6">{sols.map(([I,t,d,f,ep],i)=><R key={t} d={i*.1}><div className="h-full rounded-2xl p-7 border border-slate-200 bg-gradient-to-b from-white to-slate-50 hover:-translate-y-1.5 hover:shadow-xl hover:border-indigo-300 transition">
   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 grid place-items-center text-white"><I/></div>
   <h3 className="font-bold text-lg mt-4 text-slate-900">{t}</h3>{ep&&<span className="text-[11px] font-medium text-indigo-600">Part of EduPaper</span>}
   <p className="text-sm text-slate-600 mt-2">{d}</p><ul className="mt-4 space-y-2">{f.map((x:string)=><li key={x} className="flex gap-2 text-sm text-slate-700"><Check size={16} className="text-indigo-600 shrink-0 mt-0.5"/>{x}</li>)}</ul></div></R>)}</div></div></section>}

function Product(){return <section id="product" className="py-24 bg-gradient-to-br from-indigo-50 via-slate-100 to-violet-50 scroll-mt-16"><div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-14 items-center">
  <R><span className="text-xs font-semibold tracking-[.2em] text-indigo-600">OUR FLAGSHIP PRODUCT</span><h2 className="text-4xl font-bold text-slate-900 mt-2">Meet EduPaper</h2>
   <p className="text-slate-600 mt-3">An intelligent examination management platform designed to simplify question bank access and automate question paper preparation.</p>
   <ul className="mt-6 space-y-3">{['Browse previous-year question papers','Access PDF resources instantly','Generate randomized question papers','Customize examination formats','Export ready-to-use Word documents'].map(x=><li key={x} className="flex gap-3 text-slate-700"><span className="w-6 h-6 rounded-full bg-indigo-600 text-white grid place-items-center shrink-0"><Check size={14}/></span>{x}</li>)}</ul>
   <AppLink className={`${primary} mt-8`}>Launch EduPaper <ArrowRight size={18}/></AppLink></R>
  <R d={.15} className="relative"><div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-violet-500 blur-3xl opacity-30"/><div className="relative"><DashboardPreview large/>
   <span className="absolute -top-3 -right-2 px-3 py-1.5 rounded-lg bg-white shadow-lg text-xs font-medium text-indigo-700 flex gap-1 items-center"><FileText size={12}/>Export to Word</span>
   <span className="absolute -bottom-3 left-6 px-3 py-1.5 rounded-lg bg-white shadow-lg text-xs font-medium text-indigo-700 flex gap-1 items-center"><BookOpen size={12}/>PDF Question Bank</span></div></R></div></section>}

const why=[[Lightbulb,'Innovation First','Bringing modern technology into everyday educational workflows.'],[Users,'Teacher-Centric Design','Designing simple, intuitive experiences that reduce administrative complexity.'],[TrendingUp,'Scalable Solutions','Building flexible digital platforms that can grow with institutional needs.'],[Cog,'Practical Automation','Reducing repetitive manual tasks through efficient digital workflows.']] as any[];
function Why(){return <section id="about" className="py-24 bg-white scroll-mt-16"><div className="max-w-6xl mx-auto px-5"><Head t="Why Choose JSSquared?" s="Building practical technology that creates meaningful impact in education."/>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">{why.map(([I,t,d],i)=><R key={t} d={i*.08}><I className="text-indigo-600" size={28}/><h3 className="font-semibold text-slate-900 mt-3">{t}</h3><p className="text-sm text-slate-600 mt-1">{d}</p></R>)}</div></div></section>}

function CTA(){return <section id="contact" className="px-5 pb-24 bg-white scroll-mt-16"><R className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-800 to-violet-600 px-8 py-16 text-center">
  <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10"/><div className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-blue-400/20 blur-2xl"/>
  <div className="relative"><h2 className="text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">Ready to Experience Smarter Examination Management?</h2>
   <p className="text-indigo-100 mt-4 max-w-xl mx-auto">Discover how JSSquared's EduPaper platform can simplify question bank access and examination preparation for your institution.</p>
   <div className="flex flex-wrap justify-center gap-3 mt-8"><AppLink className={`${btn} bg-white text-indigo-900 hover:shadow-xl`}>Explore EduPaper</AppLink><a href={`mailto:${CONTACT_EMAIL}`} className={ghost}><Mail size={18}/>Contact JSSquared</a></div></div></R></section>}

function Footer(){return <footer className="bg-slate-950 text-slate-400 pt-14 pb-8"><div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-10">
  <div><Logo/><p className="text-slate-200 mt-4 text-sm font-medium">Empowering Education Through Intelligent Technology.</p><p className="text-sm mt-2">JSSquared builds digital solutions that help educational institutions simplify academic workflows and modernize assessments.</p></div>
  <nav aria-label="Footer"><h4 className="text-white font-semibold mb-3 text-sm">Navigate</h4><ul className="space-y-2 text-sm">{links.map(([l,h])=><li key={l}><a href={h} className="hover:text-white">{l}</a></li>)}<li><AppLink className="hover:text-white">EduPaper Demo</AppLink></li></ul></nav>
  <div><h4 className="text-white font-semibold mb-3 text-sm">Contact</h4><a href={`mailto:${CONTACT_EMAIL}`} className="text-sm hover:text-white">{CONTACT_EMAIL}</a></div></div>
  <div className="max-w-6xl mx-auto px-5 mt-10 pt-6 border-t border-white/10 text-xs">© 2026 JSSquared. All rights reserved.</div></footer>}

export default function Landing(){return <MotionConfig reducedMotion="user"><div className="font-sans"><Navbar/><main><Hero/><Solutions/><Product/><Why/><CTA/></main><Footer/></div></MotionConfig>}
