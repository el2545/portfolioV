import * as THREE from './three.module.min.js';
import { drawCampaign, campaignSlot } from './campaign-art.js';

export function createBillboards(sites) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({color:'#344852',metalness:.7,roughness:.4});
  const concrete = new THREE.MeshStandardMaterial({color:'#b1aea3',roughness:1});
  for (const site of sites) {
    const board = new THREE.Group(); board.position.set(...site.position,0); board.rotation.z = -site.angle*Math.PI/180;
    const add = (geometry,material,x,y,z) => { const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);board.add(mesh);return mesh; };
    add(new THREE.BoxGeometry(1.3,1.3,.35),concrete,0,0,.175);
    add(new THREE.BoxGeometry(.32,.32,4.4),metal,0,0,2.4);
    add(new THREE.BoxGeometry(4.25,.28,3.25),metal,0,0,5.6);
    // Text is a texture on a physical 4 x 3 m face, with a separate rear panel.
    const canvas=document.createElement('canvas');canvas.width=800;canvas.height=600;
    drawCampaign(canvas,site.kind,0);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
    board.userData={canvas,texture,kind:site.kind,slot:-1};
    const front=add(new THREE.PlaneGeometry(4,3),face,0,-.151,5.6);front.rotation.x=Math.PI/2;
    const back=add(new THREE.PlaneGeometry(4,3),face,0,.151,5.6);back.rotation.set(Math.PI/2,Math.PI,0);
    group.add(board);
  }
  return group;
}
export function updateBillboardTime(group,time) {
  if(!group)return;
  for(const board of group.children){const data=board.userData,slot=campaignSlot(time);if(data.kind==='dooh'&&data.slot!==slot){drawCampaign(data.canvas,data.kind,time);data.texture.needsUpdate=true;data.slot=slot;}}
}
export function disposeBillboards(group) {
  if(!group)return;
  const geometries=new Set(),materials=new Set(),textures=new Set();
  group.traverse(object=>{if(object.isMesh){geometries.add(object.geometry);materials.add(object.material);if(object.material.map)textures.add(object.material.map);}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  group.removeFromParent();
}
