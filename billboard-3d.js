import * as THREE from './three.module.min.js';

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
    const ctx=canvas.getContext('2d');const digital=site.kind==='dooh';
    ctx.fillStyle=digital?'#123f49':'#ead9b6';ctx.fillRect(0,0,800,600);
    ctx.fillStyle=digital?'#81d0c8':'#855428';ctx.fillRect(45,44,90,12);
    ctx.font='bold 58px sans-serif';ctx.fillText(site.id,680,90);
    ctx.font='bold 118px sans-serif';ctx.fillText(digital?'DOOH':'OOH',45,260);
    // Identical colour across slots: the sequence never impersonates traffic signals.
    for(let i=0;i<(digital?6:1);i++) {ctx.fillStyle=digital?'#81d0c8':'#855428';ctx.fillRect(45+i*119,410,digital?98:710,70);}
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
    const front=add(new THREE.PlaneGeometry(4,3),face,0,-.151,5.6);front.rotation.x=Math.PI/2;
    const back=add(new THREE.PlaneGeometry(4,3),face,0,.151,5.6);back.rotation.set(Math.PI/2,Math.PI,0);
    group.add(board);
  }
  return group;
}
export function disposeBillboards(group) {
  if(!group)return;
  const geometries=new Set(),materials=new Set(),textures=new Set();
  group.traverse(object=>{if(object.isMesh){geometries.add(object.geometry);materials.add(object.material);if(object.material.map)textures.add(object.material.map);}});
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  group.removeFromParent();
}
