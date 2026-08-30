import {MEDIA_B64} from '../embedded/index.js';

function b64ToArrayBuffer(value){
  const raw=atob(value);
  const bytes=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
  return bytes.buffer;
}

export async function loadBundle(){
  const buf=b64ToArrayBuffer(MEDIA_B64);
  const dv=new DataView(buf);
  const headerLength=dv.getUint32(0,true);
  const header=JSON.parse(new TextDecoder().decode(buf.slice(4,4+headerLength)));
  const start=4+headerLength;
  const urls={};
  for(const entry of header.entries){
    urls[entry.name]=URL.createObjectURL(new Blob([
      buf.slice(start+entry.offset,start+entry.offset+entry.length)
    ],{type:entry.mime}));
  }
  return {header,urls};
}
