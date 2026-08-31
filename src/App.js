import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import htm from 'htm';
import {motion} from 'framer-motion';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {VOICES, chapters} from './data/archive.js';
import {STICKER_ATLAS} from './data/stickerAtlas.js';
import {loadBundle} from './lib/media.js';
import {ThreeHero, Reveal, VoiceCard} from './components/Experience.js';

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

  return html`<div>
    <nav className="nav"><div className="mark"><span className="heart">♥</span> for aishuuu</div><div className="navlinks"><a href="#voices">voices</a><a href="#stickers">stickers</a><a href="#moments">moments</a></div></nav>

    <header className="hero"><${ThreeHero}/><div className="vignette"></div><${motion.div} className="heroCopy" initial=${{opacity:0,y:22}} animate=${{opacity:1,y:0}} transition=${{duration:1}}><div className="eyebrow"><i className="dot"></i> made from the real archive</div><h1>for<br/><span>Aishuuu.</span></h1><p>Not a photo dump. A small cinematic universe made from the messages that survived the export, six voice moments, and the stickers that somehow became a language of their own.</p><a className="heroCta" href="#signal">enter our archive ↓</a></${motion.div}><div className="sideDate">MAY — AUG · 2026</div></header>

    <main>
      <section id="signal" className="section"><div className="wrap"><${Reveal}><div className="kicker">01 · our signal</div><h2 className="display">The numbers are ridiculous.<br/><em>The ordinary moments are better.</em></h2><p className="lead">We talked. A lot. Some of it mattered. Some of it was complete nonsense. Both became part of the same story.</p></${Reveal}>
        <div className="stats">${[['160K','messages across our conversation'],['60,617','preserved in export'],['7,717','voice notes in archive'],['91','continuous days']].map((x,i)=>html`<${motion.div} className="stat" initial=${{opacity:0,y:20}} whileInView=${{opacity:1,y:0}} viewport=${{once:true}} transition=${{delay:i*.07}}><b>${x[0]}</b><span>${x[1]}</span></${motion.div}>`)}</div>
        <p className="lead archiveNote">160K is the conversation count we are using for the full chat history. The exported archive preserves 60,617 messages; disappearing messages had already vanished before export, so the preserved file is lower than the lifetime conversation count.</p>
        <div className="split"><div><strong>33,781</strong><small>Musku preserved messages</small></div><div className="splitLine"><i></i><b></b></div><div><strong>26,836</strong><small>Aishu preserved messages</small></div></div>
      </div></section>

      <section className="section"><div className="wrap"><${Reveal}><div className="kicker">02 · three frames</div><h2 className="display">A few photos are enough.<br/><em>The archive does not need a wall.</em></h2><p className="lead">Three selected frames stay here for the feeling. The rest can remain memories instead of becoming an endless gallery.</p></${Reveal}>
        ${bundle?html`<div className="portraits">${['pink day','soft yellow','blue frame'].map((label,i)=>html`<${motion.div} className="portrait" data-label=${label} style=${{backgroundImage:`url(${bundle.urls['featured.webp']})`,backgroundSize:'300% 100%',backgroundPosition:`${i*50}% 50%`}} whileHover=${{y:-8}}></${motion.div}>`)}</div>`:html`<p className="lead">Loading the memory pack…</p>`}
      </div></section>

      <section ref=${timeline} className="timelineShell"><div ref=${track} className="timelineTrack">${chapters.map(c=>html`<article className="chapter"><div><div className="num">${c[0]}</div><time>${c[1]}</time></div><div><h3>${c[2]}</h3><p>${c[3]}</p></div></article>`)}</div></section>

      <section id="voices" className="section"><div className="wrap"><${Reveal}><div className="kicker">04 · six voices we kept</div><h2 className="display">Four that were already here.<br/><em>Two new ones joined them.</em></h2><p className="lead">Nothing was replaced: four context-selected Aishu voice memories from the archive, plus the two candid Aug 30 voices you added later.</p></${Reveal}><div className="voiceGrid">${VOICES.map(v=>html`<${VoiceCard} v=${v} assets=${bundle?.urls||{}}/>`)}</div></div></section>

      <section id="stickers" className="section stickerSection"><div className="wrap"><${Reveal}><div className="kicker">05 · our reaction language</div><h2 className="display">Not all 1,203.<br/><em>Just the ones that kept coming back.</em></h2><p className="lead">The exported archive contains 1,203 WebP sticker sends. Exact-file matching found 131 unique sticker files. These are the six most repeated — ranked by how often the same sticker actually appears in the export.</p></${Reveal}>
        <div className="topStickerGrid">${topStickers.map((s,i)=>html`<${motion.article} className="stickerPick" initial=${{opacity:0,y:18}} whileInView=${{opacity:1,y:0}} viewport=${{once:true}} transition=${{delay:i*.055}} whileHover=${{y:-7,rotate:i%2?1.2:-1.2}}><div className="stickerRank">#${i+1}</div><div className="stickerVisual" style=${stickerPos(i)} role="img" aria-label=${`Recurring sticker ${i+1}`}></div><div className="stickerCount">${s.uses}×</div><small>${s.label}</small></${motion.article}>`)}</div>
        <p className="lead archiveNote">The archive also contains 395 photos and 41 video memories, but they are intentionally not dumped here. This page keeps only the pieces that add to the story.</p>
      </div></section>

      <section id="moments" className="ordinary section"><div className="wrap"><${Reveal}><div className="kicker">06 · things worth keeping</div><h2 className="display">Happy. Caring. Emotional.<br/><em>And completely ordinary.</em></h2><p className="lead">Real little moments from the chat — not a prediction, just pieces of the connection that were worth remembering.</p></${Reveal}>
        <div className="chatStage"><div className="bubble">Evda</div><div className="bubble r">Ivde 😭</div><div className="bubble">Kazhicho</div><div className="bubble r">Illa</div><div className="bubble em">Poi kazhiyada</div><div className="chatNote">repeat until food actually happens</div></div>
        <div className="voiceGrid">${moments.map(m=>html`<article className="voice"><div className="kicker">${m.title}</div><div className="quote"><p>${m.quote}</p><span>${m.note}</span></div></article>`)}</div>
      </div></section>

      <section id="quiet" className="quiet"><div className="quietCard"><div className="kicker">the quiet part</div><h2>Glad you’re here.</h2><p>This website does not need an answer from you. No pressure, no prediction, no hidden question inside a button. It is only a small place for ordinary things that became memorable.</p><div className="finalLine">Whatever the future is, let it arrive without forcing it. 🤍</div></div></section>
    </main>

    <footer><span>160K messages · 60,617 preserved in export</span><span>•</span><span>Aishu × Musku · 2026</span></footer>
  </div>`;
}
