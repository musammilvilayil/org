import React, {useEffect, useRef, useState} from 'react';
import htm from 'htm';
import {motion} from 'framer-motion';
import * as THREE from 'three';

const html = htm.bind(React.createElement);

export function ThreeHero(){const ref=useRef();useEffect(()=>{const el=ref.current;if(!el)return;const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(48,el.clientWidth/el.clientHeight,.1,100);cam.position.z=5;const r=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});r.setPixelRatio(Math.min(devicePixelRatio,1.6));r.setSize(el.clientWidth,el.clientHeight);el.appendChild(r.domElement);const geo=new THREE.TorusKnotGeometry(1.25,.34,180,24,2,3);const mat=new THREE.MeshPhysicalMaterial({color:0xdcb8ca,roughness:.28,metalness:.08,transmission:.18,transparent:true,opacity:.5});const mesh=new THREE.Mesh(geo,mat);scene.add(mesh);scene.add(new THREE.AmbientLight(0xffffff,2.1));const p1=new THREE.PointLight(0xffb6d0,35);p1.position.set(3,2,4);scene.add(p1);const p2=new THREE.PointLight(0xb9a8ff,25);p2.position.set(-3,-2,3);scene.add(p2);const stars=new THREE.BufferGeometry();const arr=new Float32Array(1800*3);for(let i=0;i<arr.length;i++)arr[i]=(Math.random()-.5)*14;stars.setAttribute('position',new THREE.BufferAttribute(arr,3));const pts=new THREE.Points(stars,new THREE.PointsMaterial({color:0xffffff,size:.012,transparent:true,opacity:.5}));scene.add(pts);let id;const tick=()=>{mesh.rotation.x+=.0017;mesh.rotation.y+=.0025;pts.rotation.y+=.00025;r.render(scene,cam);id=requestAnimationFrame(tick)};tick();const resize=()=>{cam.aspect=el.clientWidth/el.clientHeight;cam.updateProjectionMatrix();r.setSize(el.clientWidth,el.clientHeight)};addEventListener('resize',resize);return()=>{cancelAnimationFrame(id);removeEventListener('resize',resize);r.dispose();el.removeChild(r.domElement)}},[]);return html`<div ref=${ref} className="three"></div>`}
export const Reveal=({children,className=''})=>html`<${motion.div} className=${className} initial=${{opacity:0,y:28}} whileInView=${{opacity:1,y:0}} viewport=${{once:true,amount:.14}} transition=${{duration:.72,ease:[.22,1,.36,1]}}>${children}</${motion.div}>`;
export const bp=(i,cols,rows)=>({backgroundSize:`${cols*100}% ${rows*100}%`,backgroundPosition:`${(i%cols)/(cols-1)*100}% ${(Math.floor(i/cols))/(rows-1)*100}%`});

export function VoiceCard({v,assets}){
  const a=useRef();
  const [play,setPlay]=useState(false);
  const [prog,setProg]=useState(0);
  const [failed,setFailed]=useState(false);
  const source=v.src||assets[v.name]||'';

  useEffect(()=>{
    const x=a.current;
    if(!x)return;
    setPlay(false);
    setProg(0);
    setFailed(false);
    if(source){
      x.pause();
      x.load();
    }
  },[source]);

  useEffect(()=>{
    const x=a.current;if(!x)return;
    const t=()=>setProg(Number.isFinite(x.duration)&&x.duration>0?x.currentTime/x.duration:0);
    const ended=()=>setPlay(false);
    const pause=()=>setPlay(false);
    const error=()=>{setPlay(false);setFailed(true)};
    x.addEventListener('timeupdate',t);
    x.addEventListener('ended',ended);
    x.addEventListener('pause',pause);
    x.addEventListener('error',error);
    return()=>{
      x.removeEventListener('timeupdate',t);
      x.removeEventListener('ended',ended);
      x.removeEventListener('pause',pause);
      x.removeEventListener('error',error);
    };
  },[]);

  const toggle=async()=>{
    const x=a.current;
    if(!x||!source)return;
    if(!x.paused){x.pause();return;}
    try{
      setFailed(false);
      await x.play();
      setPlay(true);
    }catch(err){
      console.error('Voice playback failed',v.name,err);
      setPlay(false);
      setFailed(true);
    }
  };

  return html`<article className=${'voice '+(play?'playing ':'')+(failed?'voiceFailed':'')}>
    <audio ref=${a} src=${source||undefined} preload="metadata" playsInline/>
    <div className="voiceTop"><button className="play" onClick=${toggle} disabled=${!source} aria-label=${play?'Pause voice note':'Play voice note'}>${!source?'…':play?'Ⅱ':'▶'}</button><div><div className="voiceName">${v.label}</div><div className="voiceDate">${new Date(v.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})} · ${Math.floor(v.duration/60)}:${String(Math.round(v.duration%60)).padStart(2,'0')}</div></div></div>
    <div className="wave">${v.wave.map((h,i)=>html`<i key=${i} style=${{height:`${Math.max(10,h*100)}%`,opacity:i/(v.wave.length-1)<=prog?1:undefined}}></i>`)}</div>
    <div className="voiceCaption">${failed?'voice could not load · tap again after refresh':v.src?'uploaded Aishu voice note · candid moment':'actual Aishu voice note · context-selected from the archive'}</div>
  </article>`;
}
