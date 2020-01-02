window.AudioContext = window.AudioContext || window.webkitAudioContext;

const fetchArrayBuffer = async path => {
  const res = await fetch(path);
  return await res.arrayBuffer();
};

export class AudioPlayer {
  constructor(store) {
    this.ctx = new AudioContext();
    this.files = {};
    this.loadFiles();

    store.subscribe((state, prevState) => {
      if (state.waiting && !state.running) {
        this.play("title");
      }
      if (state.power > prevState.power) {
        this.stop("title");
        this.stop("result");
        if (!this.isPlaying("garagara")) {
          this.play("garagara");
        }
      }
      if (!state.running && prevState.running) {
        this.play("result");
      }
    });
  }

  async loadFiles() {
    this.files = {
      garagara: {
        arrayBuffer: await fetchArrayBuffer("./sounds/Garagara.mp3"),
        loop: false
      },
      result: { arrayBuffer: await fetchArrayBuffer("./sounds/Result.mp3") },
      title: { arrayBuffer: await fetchArrayBuffer("./sounds/Title.mp3") }
    };
  }

  resumeContext() {
    this.ctx.createBufferSource().start();
    this.ctx.resume();
  }

  async play(name) {
    const file = this.files[name];
    if (!file) return;

    if (!file.audioBuffer) {
      file.audioBuffer = await new Promise((resolve, reject) => {
        this.ctx.decodeAudioData(file.arrayBuffer, resolve, reject);
      });
    }

    const bufferSource = this.ctx.createBufferSource();
    bufferSource.buffer = file.audioBuffer;
    bufferSource.loop = file.loop;
    bufferSource.connect(this.ctx.destination);
    bufferSource.start();

    file.bufferSource = bufferSource;
    file.lastPlayedAt = Date.now();
  }

  isPlaying(name) {
    const file = this.files[name];
    if (!file) return;
    if (!file.audioBuffer) return;
    if (!file.lastPlayedAt) return;

    return file.lastPlayedAt + file.audioBuffer.duration * 1000 > Date.now();
  }

  stop(name) {
    const file = this.files[name];
    if (!file) return;

    const bufferSource = this.files[name].bufferSource;
    if (!bufferSource) return;
    bufferSource.stop();

    this.files[name].bufferSource = null;
    this.files[name].lastPlayedAt = null;
  }
}
