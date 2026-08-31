import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import htm from 'htm';
import {motion, AnimatePresence} from 'framer-motion';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {PHOTOS, VIDEOS, VOICES, chapters} from './data/archive.js';
import {STICKER_ATLAS} from './data/stickerAtlas.js';
import {loadBundle} from './lib/media.js';
import {ThreeHero, Reveal, VoiceCard, bp} from './components/Experience.js';

const html = htm.bind(React.createElement);
gsap.registerPlugin(ScrollTrigger);

const moments = [
  {title:'One day without texting',quote:'“Boar ayirikum.”',note:'A tiny answer that said the routine had become part of the day.'},
  {title:'What became valuable',quote:'“Ellaam valuable ahnu… njn egna onnum araduthum parayare illa… rathri okke erunn msg ayakulle athoke valuable ahnu.”',note:'Sharing things not usually shared with others — and those late-night messages.'},
  {title:'After a long night',quote:'“Oronn paranjtt poya pne egna urangum.”',note:'Some conversations stayed in the mind even after the chat stopped.'},
  {title:'The mood check',quote:'“Mood sheri ayille?” · “Eppm ntha preshnm para.” · “Urpp ahnu?”',note:'Not grand words. Just noticing when something felt off.'},
  {title:'A very small flex',quote:'“Ninte fav.”',note:'Remembering a favourite without needing an explanation.'},
  {title:'The recurring series',quote:'“Kazhicho?” · “Poi kazhikk.”',note:'Repeated until food actually happened. Somehow one of the longest-running plots.'}
];

const topStickers = [
  {uses:301,label:'the undefeated one'},
  {uses:37,label:'hide-the-face energy'},
  {uses:35,label:'tiny blanket reaction'},
  {uses:35,label:'maximum side-eye'},
  {uses:30,label:'laughing through it'},
  {uses:28,label:'serious tiny face'}
];
const stickerPos=i=>({backgroundImage:`url(${STICKER_ATLAS})`,backgroundSize:'300% 200%',backgroundPosition:`${(i%3)*50}% ${i<3?0:100}%`});

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

  const pg=bundle?.header?.photoGrid;
  const sg=bundle?.header?.stickerGrid;
  const vg=bundle?.header?.videoGrid;
  const photoList=useMemo(()=>PHOTOS.map((p,i)=>({...p,i})).filter(p=>filter==='All'||p.sender===filter),[filter]);

  return html`<div>
    <nav className="nav"><div className="mark"><span className="heart">♥</span> for aishuuu</div><div className="navlinks"><a href="#voices">voices</a><a href="#vault">media</a><a href="#moments">moments</a></div></nav>

    <header className="hero"><${ThreeHero}/><div className="vignette"></div><${motion.div} className="heroCopy" initial=${{opacity:0,y:22}} animate=${{opacity:1,y:0}} transition=${{duration:1}}><div className="eyebrow"><i className="dot"></i> made from the real archive</div><h1>for<br/><span>Aishuuu.</span></h1><p>Not a photo dump. A small cinematic universe made from the messages that survived the export, the complete visual memory pack, six chosen voice moments, and the stickers that became a language of their own.</p><a className="heroCta" href="#signal">enter our archive ↓</a></${motion.div}><div className="sideDate">MAY — AUG · 2026</div></header>

    <main>
      <section id="signal" className="section"><div className="wrap"><${Reveal}><div className="kicker">01 · our signal</div><h2 className="display">The numbers are ridiculous.<br/><em>The ordinary moments are better.</em></h2><p className="lead">We talked. A lot. Some of it mattered. Some of it was complete nonsense. Both became part of the same story.</p></${Reveal}>
        <div className="stats">${[['60,617','preserved messages'],['>60,617','actual conversation'],['7,717','voice notes in archive'],['91','continuous days']].map((x,i)=>html`<${motion.div} className="stat" initial=${{opacity:0,y:20}} whileInView=${{opacity:1,y:0}} viewport=${{once:true}} transition=${{delay:i*.07}}><b>${x[0]}</b><span>${x[1]}</span></${motion.div}>`)}</div>
        <p className="lead archiveNote">60,617 is the exported, preserved count — not a claim about every message ever sent. Disappearing messages had already vanished before export, so the real lifetime conversation is larger than 60,617. The exact missing total cannot be recovered from this archive.</p>
        <div className="split"><div><strong>33,781</strong><small>Musku preserved messages</small></div><div className="splitLine"><i></i><b></b></div><div><strong>26,836</strong><small>Aishu preserved messages</small></div></div>
      </div></section>

      <section className="section"><div className="wrap"><${Reveal}><div className="kicker">02 · three frames</div><h2 className="display">A few favourites first.<br/><em>Then the whole archive.</em></h2><p className="lead">Three selected frames stay up front for the feeling. The complete exported photo set is still available below in the media vault.</p></${Reveal}>
        ${bundle?html`<div className="portraits">${['pink day','soft yellow','blue frame'].map((label,i)=>html`<${motion.div} className="portrait" data-label=${label} style=${{backgroundImage:`url(${bundle.urls['featured.webp']})`,backgroundSize:'300% 100%',backgroundPosition:`${i*50}% 50%`}} whileHover=${{y:-8}}></${motion.div}>`)}</div>`:html`<p className="lead">Loading the memory pack…</p>`}
      </div></section>

      <section ref=${timeline} className="timelineShell"><div ref=${track} className="timelineTrack">${chapters.map(c=>html`<article className="chapter"><div><div className="num">${c[0]}</div><time>${c[1]}</time></div><div><h3>${c[2]}</h3><p>${c[3]}</p></div></article>`)}</div></section>

      <section id="voices" className="section"><div className="wrap"><${Reveal}><div className="kicker">04 · six voices we kept</div><h2 className="display">Four from the archive.<br/><em>Two you added later.</em></h2><p className="lead">Nothing was replaced: four context-selected Aishu voice memories from the archive, plus the two mandatory candid Aug 30 voices.</p></${Reveal}><div className="voiceGrid">${VOICES.map(v=>html`<${VoiceCard} v=${v} assets=${bundle?.urls||{}}/>`)}</div></div></section>

      <section className="mediaBand"><div className="wrap"><div className="mediaNumbers">${[['395','archived photos'],['41','video memories'],['1,203','WebP / sticker sends'],['6','selected voice memories']].map(x=>html`<div className="mediaN"><b>${x[0]}</b><span>${x[1]}</span></div>`)}</div></div></section>

      <section id="vault" className="section"><div className="wrap"><div className="vaultHeader"><${Reveal}><div className="kicker">05 · complete media vault</div><h2 className="display">All 395 photos.<br/><em>Back in the archive.</em></h2><p className="lead">The full exported photo set is mapped here through the optimized memory atlas. Browse all of it, filter by sender, and open any frame larger.</p></${Reveal}><div className="filter">${['All','Aishu','Musku'].map(x=>html`<button className=${filter===x?'active':''} onClick=${()=>{setFilter(x);setShow(72)}}>${x}</button>`)}</div></div>
        ${bundle&&pg?html`<div className="photoGrid">${photoList.slice(0,show).map(p=>html`<button className="photoTile" onClick=${()=>setSelected(p)} style=${{backgroundImage:`url(${bundle.urls['photos.webp']})`,...bp(p.i,pg.cols,pg.rows)}}><span className="photoMeta">${p.sender} · ${p.date?new Date(p.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):''}</span></button>`)}</div>${show<photoList.length?html`<button className="more" onClick=${()=>setShow(s=>Math.min(s+96,photoList.length))}>open more memories · ${show}/${photoList.length}</button>`:null}`:html`<p className="lead">Loading all 395 photos…</p>`}

        <div className="kicker" style=${{marginTop:'80px'}}>06 · motion vault</div><h2 className="display">41 video memories,<br/><em>remembered in frames.</em></h2><p className="lead">Every video memory in the archive is represented by its generated poster frame, so the motion part of the archive is not missing from the story.</p>
        ${bundle&&vg?html`<div className="videoGrid">${VIDEOS.map((v,i)=>html`<div className="videoCard" style=${{backgroundImage:`url(${bundle.urls['videos.webp']})`,...bp(i,vg.cols,vg.rows)}}><small>${v.date?new Date(v.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}):'video'}</small></div>`)}</div>`:html`<p className="lead">Loading video memories…</p>`}

        <div className="stickerDoor" onClick=${()=>setStickers(!stickers)}><div><b>1,203 sticker / WebP moments ✦</b><span>open the full optimized sticker-media layer from the archive</span></div><strong>${stickers?'−':'+'}</strong></div>
        ${stickers&&bundle&&sg?html`<div className="stickerWall">${Array.from({length:sg.count},(_,i)=>html`<div className="sticker" style=${{backgroundImage:`url(${bundle.urls['stickers.webp']})`,...bp(i,sg.cols,sg.rows)}}></div>`)}</div>`:null}
      </div></section>

      <section id="stickers" className="section stickerSection"><div className="wrap"><${Reveal}><div className="kicker">07 · recurring reaction language</div><h2 className="display">From 1,203 sends,<br/><em>these kept coming back.</em></h2><p className="lead">The full sticker layer is available above; these are the six most repeated exact sticker files, kept as a quick little hall of fame.</p></${Reveal}>
        <div className="topStickerGrid">${topStickers.map((s,i)=>html`<${motion.article} className="stickerPick" initial=${{opacity:0,y:18}} whileInView=${{opacity:1,y:0}} viewport=${{once:true}} transition=${{delay:i*.055}} whileHover=${{y:-7,rotate:i%2?1.2:-1.2}}><div className="stickerRank">#${i+1}</div><div className="stickerVisual" style=${stickerPos(i)} role="img" aria-label=${`Recurring sticker ${i+1}`}></div><div className="stickerCount">${s.uses}×</div><small>${s.label}</small></${motion.article}>`)}</div>
      </div></section>

      <section id="moments" className="ordinary section"><div className="wrap"><${Reveal}><div className="kicker">08 · things worth keeping</div><h2 className="display">Happy. Caring. Emotional.<br/><em>And completely ordinary.</em></h2><p className="lead">Real little moments from the chat — not a prediction, just pieces of the connection that were worth remembering.</p></${Reveal}>
        <div className="chatStage"><div className="bubble">Evda</div><div className="bubble r">Ivde 😭</div><div className="bubble">Kazhicho</div><div className="bubble r">Illa</div><div className="bubble em">Poi kazhiyada</div><div className="chatNote">repeat until food actually happens</div></div>
        <div className="voiceGrid">${moments.map(m=>html`<article className="voice"><div className="kicker">${m.title}</div><div className="quote"><p>${m.quote}</p><span>${m.note}</span></div></article>`)}</div>
      </div></section>

      <section id="quiet" className="quiet"><div className="quietCard"><div className="kicker">the quiet part</div><h2>Glad you’re here.</h2><p>This website does not need an answer from you. No pressure, no prediction, no hidden question inside a button. It is only a small place for ordinary things that became memorable.</p><div className="finalLine">Whatever the future is, let it arrive without forcing it. 🤍</div></div></section>
    </main>

    <footer><span>60,617 preserved messages · actual conversation larger because disappearing messages are not recoverable</span><span>•</span><span>Aishu × Musku · 2026</span></footer>

    <${AnimatePresence}>${selected&&bundle&&pg?html`<${motion.div} className="lightbox" initial=${{opacity:0}} animate=${{opacity:1}} exit=${{opacity:0}} onClick=${()=>setSelected(null)}><button className="close" onClick=${()=>setSelected(null)}>×</button><${motion.div} className="lightPhoto" initial=${{scale:.92}} animate=${{scale:1}} style=${{backgroundImage:`url(${bundle.urls['photos.webp']})`,...bp(selected.i,pg.cols,pg.rows)}} onClick=${e=>e.stopPropagation()}></${motion.div}><div className="lightMeta">${selected.sender} · ${selected.date?new Date(selected.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}):''}</div></${motion.div}>`:null}</${AnimatePresence}>
  </div>`;
}
