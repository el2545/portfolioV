import * as THREE from './three.module.min.js';
import { paintColours, paintIndex } from './road-motion.js';
import { createBillboards, disposeBillboards } from './billboard-3d.js';

// One shared mesh per part; every car is a lit solid in map coordinates (metres).
export class Traffic3D {
  constructor(maplibre) {
    this.id = 'traffic-cars-3d'; this.type = 'custom'; this.renderingMode = '3d';
    this.maplibre = maplibre; this.vehicles = []; this.capacity = 0; this.parts = [];
    this.anchorMatrix = new THREE.Matrix4(); this.dummy = new THREE.Object3D();
    this.colours = paintColours.map(colour => new THREE.Color(colour));
  }
  onAdd(map, gl) {
    this.map = map; this.camera = new THREE.Camera(); this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const sun = new THREE.DirectionalLight(0xfff3dc, 2.7); sun.position.set(-80, -120, 180); this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0xc5dfff, 1.1); fill.position.set(60, 40, 100); this.scene.add(fill);
    this.renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl, antialias: true });
    this.renderer.autoClear = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.createParts(2048);
  }
  createParts(capacity) {
    this.disposeParts(); this.capacity = capacity;
    const material = (colour, extra = {}) => new THREE.MeshStandardMaterial({ color: colour, roughness: 0.5, metalness: 0.15, ...extra });
    const body = material('#ffffff', { roughness: 0.32, metalness: 0.35 });
    const glass = material('#1c3444', { metalness: 0.65, roughness: 0.18 });
    const tyre = material('#171b20', { roughness: 0.95 });
    const rim = material('#adbbc1', { metalness: 0.75 });
    const add = (geometry, mat, position = [0,0,0], options = {}) => {
      const mesh = new THREE.InstancedMesh(geometry, mat, capacity);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; mesh.count = 0;
      this.parts.push({ mesh, position, ...options }); this.scene.add(mesh);
    };
    add(new THREE.PlaneGeometry(2.05,5.15),new THREE.MeshBasicMaterial({color:'#000000',transparent:true,opacity:.22,depthWrite:false}),[.16,-.14,-.02]);
    const shape = new THREE.Shape();
    shape.moveTo(-0.7,-2.5); shape.lineTo(0.7,-2.5); shape.quadraticCurveTo(0.9,-2.5,0.9,-2.2);
    shape.lineTo(0.9,2.1); shape.quadraticCurveTo(0.9,2.5,0.6,2.5); shape.lineTo(-0.6,2.5);
    shape.quadraticCurveTo(-0.9,2.5,-0.9,2.1); shape.lineTo(-0.9,-2.2); shape.quadraticCurveTo(-0.9,-2.5,-0.7,-2.5);
    const chassis = new THREE.ExtrudeGeometry(shape,{depth:0.48,bevelEnabled:true,bevelThickness:0.07,bevelSize:0.05,bevelSegments:1,steps:1,curveSegments:3});
    add(chassis,body,[0,0,0.38],{paint:true});
    // Sloped windscreens and side windows between a wide sill and narrower roof.
    const vertices=[[-.81,-1.6,.87],[.81,-1.6,.87],[.81,1,.87],[-.81,1,.87],[-.67,-1.13,1.52],[.67,-1.13,1.52],[.67,.35,1.52],[-.67,.35,1.52]];
    const indices=[0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7,4,5,6,4,6,7];
    const cabin=new THREE.BufferGeometry();cabin.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));cabin.setIndex(indices);cabin.computeVertexNormals();
    add(cabin,glass);
    add(new THREE.BoxGeometry(1.39,1.5,.07),body,[0,-.39,1.55],{paint:true});
    // B-pillars, bumpers, mirrors and grilles make the silhouette readable at street scale.
    for(const x of [-.75,.75]) add(new THREE.BoxGeometry(.1,.13,.52),body,[x,-.36,1.16],{paint:true});
    for(const x of [-1,1]) add(new THREE.BoxGeometry(.22,.3,.13),body,[x,.55,1.04],{paint:true});
    add(new THREE.BoxGeometry(1.55,.12,.15),tyre,[0,2.43,.47]);
    add(new THREE.BoxGeometry(1.5,.1,.15),tyre,[0,-2.44,.48]);
    const lamp=material('#fff4d0',{emissive:'#fff1bd',emissiveIntensity:.7});
    const rear=material('#b71f19',{emissive:'#7f100b',emissiveIntensity:.45});
    for(const x of [-.6,.6]) {add(new THREE.BoxGeometry(.39,.13,.16),lamp,[x,2.39,.76]);add(new THREE.BoxGeometry(.34,.12,.17),rear,[x,-2.42,.77]);}
    for(const x of [-.91,.91]) for(const y of [-1.6,1.55]) {
      const wheel=new THREE.CylinderGeometry(.34,.34,.21,12);wheel.rotateZ(Math.PI/2);
      add(wheel,tyre,[x,y,.35],{wheel:true,front:y>0});
      const hub=new THREE.CylinderGeometry(.19,.19,.018,8);hub.rotateZ(Math.PI/2);
      add(hub,rim,[x+Math.sign(x)*.115,y,.35],{wheel:true,front:y>0});
    }
  }
  setNetwork(manifest) {
    const anchor=this.maplibre.MercatorCoordinate.fromLngLat(manifest.origin);
    this.anchorMatrix.makeTranslation(anchor.x,anchor.y,0).scale(new THREE.Vector3(manifest.scale,-manifest.scale,manifest.scale));
  }
  setBillboards(sites) {
    disposeBillboards(this.billboards);
    this.billboards = sites.length ? createBillboards(sites) : null;
    if(this.billboards)this.scene.add(this.billboards);
    this.map?.triggerRepaint();
  }
  update(vehicles) {
    if (!this.scene) return;
    if (vehicles.length > this.capacity) this.createParts(2 ** Math.ceil(Math.log2(vehicles.length)));
    this.vehicles = vehicles;
    for(let i=0;i<vehicles.length;i++) {
      const vehicle=vehicles[i],angle=vehicle.angle*Math.PI/180;
      const sin=Math.sin(angle),cos=Math.cos(angle);
      // FCD x/y is the front bumper, not the centre of the car.
      const cx=vehicle.x-sin*2.5,cy=vehicle.y-cos*2.5;
      const paint=this.colours[paintIndex(vehicle.id)];
      for(const part of this.parts) {
        const [x,y,z]=part.position;
        this.dummy.position.set(cx+x*cos+y*sin,cy-x*sin+y*cos,z+.06);
        this.dummy.rotation.set(part.wheel ? vehicle.pos / .34 : 0,0,-angle-(part.front?(vehicle.steering||0)*Math.PI/180:0),"ZYX");
        this.dummy.scale.set(1,1,1);this.dummy.updateMatrix();
        part.mesh.setMatrixAt(i,this.dummy.matrix);
        if(part.paint) part.mesh.setColorAt(i,paint);
      }
    }
    for(const part of this.parts) {
      part.mesh.count=vehicles.length;part.mesh.instanceMatrix.needsUpdate=true;
      if(part.mesh.instanceColor)part.mesh.instanceColor.needsUpdate=true;
    }
    this.map.triggerRepaint();
  }
  render(gl,args) {
    if(!this.vehicles.length && !this.billboards)return;
    this.camera.projectionMatrix.fromArray(args.defaultProjectionData.mainMatrix).multiply(this.anchorMatrix);
    this.renderer.resetState();this.renderer.render(this.scene,this.camera);this.renderer.resetState();
  }
  disposeParts() {
    const materials=new Set();
    for(const part of this.parts){this.scene.remove(part.mesh);part.mesh.geometry.dispose();materials.add(part.mesh.material);part.mesh.dispose();}
    materials.forEach(material=>material.dispose());this.parts=[];
  }
  onRemove() {disposeBillboards(this.billboards);this.disposeParts();this.renderer?.dispose();}
}
