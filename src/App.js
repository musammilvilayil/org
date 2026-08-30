import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import htm from 'htm';
import {motion, AnimatePresence} from 'framer-motion';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {PHOTOS, VIDEOS, VOICES, chapters} from './data/archive.js';
import {loadBundle} from './lib/media.js';
import {ThreeHero, Reveal, VoiceCard, bp} from './components/Experience.js';

const html = htm.bind(React.createElement);
gsap.registerPlugin(ScrollTrigger);

const moments = [
  {tone:'soft',title:'One day without texting',quote:'“Boar ayirikum.”',note:'A tiny answer that said the routine had become part of the day.'},
  {tone:'warm',title:'What became valuable',quote:'“Ellaam valuable ahnu… njn egna onnum araduthum parayare illa… rathri okke erunn msg ayakulle athoke valuable ahnu.”',note:'Sharing things not usually shared with others — and the late-night messages.'},
  {tone:'night',title:'After a heavy night',quote:'“Oronn paranjtt poya pne egna urangum.”',note:'Some conversations stayed in the mind even after the chat stopped.'},
  {tone:'care',title:'The mood check',quote:'“Mood sheri ayille?” · “Eppm ntha preshnm para.” · “Urpp ahnu?”',note:'Not grand words. Just noticing when something felt off.'},
  {tone:'play',title:'A very small flex',quote:'“Ninte fav.”',note:'Remembering a favourite without needing an explanation.'},
  {tone:'food',title:'The recurring series',quote:'“Kazhicho?” · “Poi kazhikk.”',note:'Repeated until food actually happens. Somehow one of the longest-running plots.'}
];

export default function App(){
  const [bundle,setBundle]=useState(null);
  const [filter,setFilter]=useState('All');
  const [show,setShow]=useState(72);
  const [stickers,setStickers]=useState(false);
  const [selected,setSelected]=useState(null);
  const timeline=useRef();
  const track=useRef();

  useEffect(()=>{
    loadBundle().then(setBundle).catch(console.error);
    const lenis=new Lenis({duration:1.08,smoothWheel:true});
    let id;
    const raf=t=>{lenis.raf(t);id=requestAnimationFrame(raf)};
    id=requestAnimationFrame(raf);
    const move=e=>{document.documentElement.style.setProperty('--mx',e.clientX+'px');document.documentElement.style.setProperty('--my',e.clientY+'px')};
    addEventListener('pointermove',move);
    return()=>{cancelAnimationFrame(id);lenis.destroy();removeEventListener('pointermove',move)};
  },[]);

  useLayoutEffect(()=>{
    if(!timeline.current||!track.current)return;
    const mm=gsap.matchMedia();
    mm.add('(min-width: 561px)',()=>{
      const distance=()=>Math.max(0,track.current.scrollWidth-innerWidth+100);
      gsap.to(track.current,{x:()=>-distance(),ease:'none',scrollTrigger:{trigger:timeline.current,start:'top top',end:()=>'+='+(distance()+innerWidth*.6),pin:true,scrub:1,invalidateOnRefresh:true}});
    });
    return()=>mm.revert();
  },[bundle]);

  const pg=bundle?.header.photoGrid;
  const sg=bundle?.header.stickerGrid;
  const vg=bundle?.header.videoGrid;
  const photoList=useMemo(()=>PHOTOS.map((p,i)=>({...p,i})).filter(p=>filter==='All'||p.sender===filter),[filter]);

  return html`<div>
    <nav className="nav"><div className="mark"><span className="heart">♥</span> for aishuuu</div><div className="navlinks"><a href="#voices">voices</a><a href="#vault">vault</a><a href="#quiet">quiet</a></div></nav>

    <header className="hero"><${ThreeHero}/><div className="vignette"></div><${motion.div} className="heroCopy" initial=${{opacity:0,y:22}} animate=${{opacity:1,y:0}} transition=${{duration:1}}><div className="eyebrow"><i className="dot"></i> made from the real archive</div><h1>for<br/><span>Aishuuu.</span></h1><p>Not a proposal. Not a question. A cinematic little universe made from the messages that survived the export, every archived photo, motion memories, sticker chaos, and two voices that had to be here.</p><a className="heroCta" href="#signal">enter our archive ↓</a></${motion.div}><div className="sideDate">MAY — AUG · 2026</div></header>

    <main>
      <section id="signal" className="section"><div className="wrap"><${Reveal}><div className="kicker">01 · our signal</div><h2 className="display">The numbers are ridiculous.<br/><em>The reason is simple.</em></h2><p className="lead">We talked. A lot. Some of it mattered. Some of it was complete nonsense. Both became part of the same story.</p></${Reveal}>
        <div className="stats">${[['178,617+','estimated lifetime messages'],['60,617','preserved in export'],['7,717','voice notes in archive'],['91','continuous days']].map((x,i)=>html`<${motion.div} className="stat" initial=${{opacity:0,y:20}} whileInView=${{opacity:1,y:0}} viewport=${{once:true}} transition=${{delay:i*.07}}><b>${x[0]}</b><span>${x[1]}</span></${motion.div}>`)}</div>
        <p className="lead">60,617 messages are preserved in the exported archive. Disappearing messages had already vanished before export, so the lifetime conversation was larger; the exact missing total cannot be recovered from the archive alone.</p>
        <div className="split"><div><strong>33,781</strong><small>Musku preserved messages</small></div><div className="splitLine"><i></i><b></b></div><div><strong>26,836</strong><small>Aishu preserved messages</small></div></div>
      </div></section>

      <section className="section"><div className="wrap"><${Reveal}><div className="kicker">02 · three frames</div><h2 className="display">Different colours.<br/><em>Same person.</em></h2></${Reveal}>
        ${bundle?html`<div className="portraits">${['pink day','soft yellow','blue frame'].map((label,i)=>html`<${motion.div} className="portrait" data-label=${label} style=${{backgroundImage:`url(${bundle.urls['featured.webp']})`,backgroundSize:'300% 100%',backgroundPosition:`${i*50}% 50%`}} whileHover=${{y:-8}}></${motion.div}>`)}</div>`:html`<p className="lead">Loading the memory pack…</p>`}
      </div></section>

      <section ref=${timeline} className="timelineShell"><div ref=${track} className="timelineTrack">${chapters.map(c=>html`<article className="chapter"><div><div className="num">${c[0]}</div><time>${c[1]}</time></div><div><h3>${c[2]}</h3><p>${c[3]}</p></div></article>`)}</div></section>

      <section id="voices" className="section"><div className="wrap"><${Reveal}><div className="kicker">04 · two voices that had to stay</div><h2 className="display">Some moments sound<br/><em>better than they read.</em></h2><p className="lead">These two Aishu voice notes were uploaded separately and marked mandatory. They are embedded into the source build itself, so they do not depend on a missing media file or external host.</p></${Reveal}><div className="voiceGrid">${VOICES.map(v=>html`<${VoiceCard} v=${v} assets=${bundle?.urls||{}}/>`)}</div></div></section>

      <section className="mediaBand"><div className="wrap"><div className="mediaNumbers">${[['395','archived photos'],['41','video memories'],['1,203','WebP / sticker moments'],['2','mandatory voice memories']].map(x=>html`<div className="mediaN"><b>${x[0]}</b><span>${x[1]}</span></div>`)}</div></div></section>

      <section id="vault" className="section"><div className="wrap"><div className="vaultHeader"><${Reveal}><div className="kicker">05 · memory vault</div><h2 className="display">All 395 photos.<br/><em>One endless wall.</em></h2><p className="lead">Every archived photo is mapped into this wall. The site uses an optimized atlas so the whole archive can load without shipping the original 1.7 GB WhatsApp export.</p></${Reveal}><div className="filter">${['All','Aishu','Musku'].map(x=>html`<button className=${filter===x?'active':''} onClick=${()=>{setFilter(x);setShow(72)}}>${x}</button>`)}</div></div>
        ${bundle&&pg?html`<div className="photoGrid">${photoList.slice(0,show).map(p=>html`<button className="photoTile" onClick=${()=>setSelected(p)} style=${{backgroundImage:`url(${bundle.urls['photos.webp']})`,...bp(p.i,pg.cols,pg.rows)}}><span className="photoMeta">${p.sender} · ${p.date?new Date(p.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):''}</span></button>`)}</div>${show<photoList.length?html`<button className="more" onClick=${()=>setShow(s=>Math.min(s+96,photoList.length))}>open more memories · ${show}/${photoList.length}</button>`:null}`:html`<p className="lead">Loading photos…</p>`}

        <div className="kicker" style=${{marginTop:'80px'}}>06 · motion memories</div><h2 className="display">41 videos,<br/><em>remembered in frames.</em></h2>
        ${bundle&&vg?html`<div className="videoGrid">${VIDEOS.map((v,i)=>html`<div className="videoCard" style=${{backgroundImage:`url(${bundle.urls['videos.webp']})`,...bp(i,vg.cols,vg.rows)}}><small>${v.date?new Date(v.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'video'}</small></div>`)}</div>`:null}

        <div className="stickerDoor" onClick=${()=>setStickers(!stickers)}><div><b>Sticker chaos ✦</b><span>all 1,203 WebP / sticker-media moments represented from the archive</span></div><strong>${stickers?'−':'+'}</strong></div>
        ${stickers&&bundle&&sg?html`<div className="stickerWall">${Array.from({length:sg.count},(_,i)=>html`<div className="sticker" style=${{backgroundImage:`url(${bundle.urls['stickers.webp']})`,...bp(i,sg.cols,sg.rows)}}></div>`)}</div>`:null}
      </div></section>

      <section className="ordinary section"><div className="wrap"><${Reveal}><div className="kicker">07 · things worth keeping</div><h2 className="display">Happy. Emotional.<br/><em>And completely ordinary.</em></h2><p className="lead">Not proof of a future. Just real moments from the chat that felt human enough to keep.</p></${Reveal}>
        <div className="chatStage"><div className="bubble">Evda</div><div className="bubble r">Ivde 😭</div><div className="bubble">Kazhicho</div><div className="bubble r">Illa</div><div className="bubble em">Poi kazhiyada</div><div className="chatNote">repeat until food actually happens</div></div>
        <div className="voiceGrid">${moments.map(m=>html`<article className="voice"><div className="kicker">${m.title}</div><div className="quote"><p>${m.quote}</p><span>${m.note}</span></div></article>`)}</div>
      </div></section>

      <section id="quiet" className="quiet"><div className="quietCard"><div className="kicker">the quiet part</div><h2>Glad you’re here.</h2><p>This website does not need an answer from you. No pressure, no prediction, no “what are we?” hidden inside a button. It is only a small place for ordinary things that became memorable.</p><div className="finalLine">Whatever the future is, let it arrive without forcing it. 🤍</div></div></section>
    </main>

    <footer><span>60,617 preserved messages · disappearing messages not recoverable</span><span>•</span><span>Aishu × Musku · 2026</span></footer>

    <${AnimatePresence}>${selected&&bundle&&pg?html`<${motion.div} className="lightbox" initial=${{opacity:0}} animate=${{opacity:1}} exit=${{opacity:0}} onClick=${()=>setSelected(null)}><button className="close">×</button><${motion.div} className="lightPhoto" initial=${{scale:.92}} animate=${{scale:1}} style=${{backgroundImage:`url(${bundle.urls['photos.webp']})`,...bp(selected.i,pg.cols,pg.rows)}} onClick=${e=>e.stopPropagation()}></${motion.div}><div className="lightMeta">${selected.sender} · ${selected.date?new Date(selected.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):''}</div></${motion.div}>`:null}</${AnimatePresence}>
  </div>`;
}
