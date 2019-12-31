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
    this.renderer.setSize(width, height, false);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 2));

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 1, 2);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    this.controls.target = new THREE.Vector3(0, 0.6, 0);

    this.loader = new GLTFLoader();

    this.waitingModel = null;
    this.loader.load("models/waiting.glb", gltf => {
      this.waitingModel = gltf;
      this.scene.add(gltf.scene);
      this.animationMixer = new THREE.AnimationMixer(gltf.scene);
      this.animationMixer.clipAction(gltf.animations[0]).play();
    });

    this.resultModels = [];
    const resultModelNames = ["A", "B", "C", "D", "E"];
    for (let name of resultModelNames) {
      this.loader.load(`./models/${name}.glb`, gltf => {
        this.scene.add(gltf.scene);
        this.resultModels.push(gltf);
      });
    }
  }

  render() {
    const { waiting, seed } = this.store.state;

    if (this.waitingModel) {
      this.waitingModel.scene.visible = waiting;
    }

    for (let model of this.resultModels) {
      model.scene.visible = false;
    }

    if (!waiting && this.resultModels.length > 1) {
      const i = parseInt(seed) % this.resultModels.length;
      const model = this.resultModels[i];
      model.scene.visible = true;
    }

    if (this.animationMixer) {
      this.animationMixer.update(this.clock.getDelta());
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}
