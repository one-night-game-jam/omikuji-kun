import "https://unpkg.com/three@0.112.1/build/three.min.js";
import "https://unpkg.com/three@0.112.1/examples/js/controls/OrbitControls.js";
import "https://unpkg.com/three@0.112.1/examples/js/loaders/GLTFLoader.js";
import { MODEL_NAMES, getModelIndex } from "./store.js";

export class Scene {
  constructor(canvas, store) {
    this.store = store;

    this.canvas = canvas;
    const { width, height } = this.canvas.getBoundingClientRect();

    this.raycaster = new THREE.Raycaster();

    this.clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setClearColor(0xf8f8f8, 1);
    this.renderer.setSize(width, height, false);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0.25, 1, 0.5);
    this.scene.add(directionalLight);

    const box = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 6, 6),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        wireframe: true
      })
    );
    this.scene.add(box);
    box.position.set(0, 1, 0);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.set(0, 2, 4);

    this.controls = new THREE.OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 10;
    this.controls.target = new THREE.Vector3(0, 1, 0);

    this.loader = new THREE.GLTFLoader();

    this.waitingModel = null;
    this.loader.load("models/waiting.glb", gltf => {
      this.waitingModel = gltf;
      this.scene.add(gltf.scene);
      this.animationMixer = new THREE.AnimationMixer(gltf.scene);
      this.animationMixer.clipAction(gltf.animations[0]).play();
    });

    this.resultModels = [];
    for (let i = 0; i < MODEL_NAMES.length; i++) {
      this.loader.load(`./models/${MODEL_NAMES[i]}.glb`, gltf => {
        this.scene.add(gltf.scene);
        this.resultModels[i] = gltf;
      });
    }

    this.canvas.addEventListener("click", e => {
      const {
        top,
        left,
        width,
        height
      } = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      const mouse = new THREE.Vector2(
        (x / width) * 2 - 1,
        -(y / height) * 2 + 1
      );
      this.handleClick(mouse);
    });

    this.canvas.addEventListener("touchstart", e => {
      const {
        top,
        left,
        width,
        height
      } = e.currentTarget.getBoundingClientRect();
      const x = e.touches[0].clientX - left;
      const y = e.touches[0].clientY - top;
      const mouse = new THREE.Vector2(
        (x / width) * 2 - 1,
        -(y / height) * 2 + 1
      );
      this.handleClick(mouse);
    });

    this.store.subscribe((state, prevState) => {
      if (state.running && !prevState.running) {
        if (!this.animationMixer) return;
        this.animationMixer.setTime(0);
        this.animationMixer.stopAllAction();
        this.animationMixer = undefined;
      }

      if (!state.running && prevState.running) {
        const gltf = this.resultModels[getModelIndex(state)];
        const animation = gltf.animations[0];
        if (!animation) return;

        this.animationMixer = new THREE.AnimationMixer(gltf.scene);
        this.animationMixer.clipAction(animation).play();
      }
    });
  }

  handleClick(mouse) {
    const { showTitle } = this.store.state;

    this.raycaster.setFromCamera(mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length === 0) return;

    if (showTitle) {
      this.start();
      return;
    }

    if (!showTitle) {
      this.shake();
    }
  }

  start() {
    this.dispatch({
      showTitle: false
    });
  }

  shake() {
    this.dispatch({
      waiting: false,
      running: true,
      power: 50 + 50 * Math.random()
    });
  }

  dispatch(state) {
    this.store.dispatch(state);
  }

  render() {
    const { waiting } = this.store.state;

    if (this.waitingModel) {
      this.waitingModel.scene.visible = waiting;
    }

    for (let model of this.resultModels) {
      if (model) {
        model.scene.visible = false;
      }
    }
    if (!waiting && this.resultModels.length > 1) {
      const model = this.resultModels[getModelIndex(this.store.state)];
      if (model) {
        model.scene.visible = true;
      }
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
