import {MEDIA_B64} from '../embedded/index.js';

function b64ToArrayBuffer(value){
  const raw=atob(value);
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  return bytes.buffer;
}

const LEGACY_VOICE_NAMES=['voice1.m4a','voice4.m4a','voice7.m4a','voice8.m4a'];
const looksLikeAudio=entry=>{
  const mime=(entry.mime||'').toLowerCase();
  const name=(entry.name||'').toLowerCase();
  return mime.startsWith('audio/') || /\.(m4a|mp4|aac|opus|ogg|webm|mp3|wav)$/.test(name);
};

export async function loadBundle(){
  const buf=b64ToArrayBuffer(MEDIA_B64);
  const dv=new DataView(buf);
  const headerLength=dv.getUint32(0,true);
  const header=JSON.parse(new TextDecoder().decode(buf.slice(4,4+headerLength)));
  const start=4+headerLength;
  const urls={};
  const audioUrls=[];

  for(const entry of header.entries){
    const blob=new Blob([
      buf.slice(start+entry.offset,start+entry.offset+entry.length)
    ],{type:entry.mime||'application/octet-stream'});
    const url=URL.createObjectURL(blob);
    urls[entry.name]=url;
    if(looksLikeAudio(entry)) audioUrls.push({name:entry.name,url,mime:entry.mime||blob.type});
  }

  // Older archive voice cards used friendly names while the packed binary can
  // retain original WhatsApp filenames. Keep exact matches first, then alias
  // the first four packed audio entries in their original selected order.
  LEGACY_VOICE_NAMES.forEach((name,index)=>{
    if(!urls[name] && audioUrls[index]) urls[name]=audioUrls[index].url;
  });

  return {header,urls,audioUrls};
}
