import * as THREE from "https://unpkg.com/three@0.112/build/three.module.js?module";
import { OrbitControls } from "https://unpkg.com/three@0.112/examples/jsm/controls/OrbitControls.js?module";
import { GLTFLoader } from "https://unpkg.com/three@0.112/examples/jsm/loaders/GLTFLoader.js?module";

export class Scene {
  constructor(canvas, store) {
    this.store = store;
    
    this.canvas = canvas;
    const { width, height } = this.canvas.getBoundingClientRect();

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setClearColor(0x0088ff, 1);
    this.renderer.setSize(width, height);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff));

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 3);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 10;
    this.controls.target = new THREE.Vector3(0, 1, 0);

    this.loader = new GLTFLoader();
    this.loader.load(
      "https://cdn.glitch.com/761969b3-3b64-415e-9a2c-508cc1393d58%2Fwaiting.glb?v=1577796596279",
      gltf => {
        this.scene.add(gltf.scene);
        this.mixer = new THREE.AnimationMixer(gltf.scene);
        this.mixer.clipAction(gltf.animations[0]).play();
      }
    );

    this.models = [];
    this.loader.load(
      "https://cdn.glitch.com/761969b3-3b64-415e-9a2c-508cc1393d58%2Fball.glb?v=1577794988243",
      gltf => {
        this.models.push(gltf);
      }
    );
    this.loader.load(
      "https://cdn.glitch.com/761969b3-3b64-415e-9a2c-508cc1393d58%2Fbox.glb?v=1577794986813",
      gltf => {
        this.models.push(gltf);
      }
    );
  }

  render() {
    // console.log(this.store.state);
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
