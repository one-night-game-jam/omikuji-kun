export class AudioPlayer {
  play(selector) {
    const el = document.querySelector(selector);
    if (el.loop && el.currentTime !== 0) return;
    el.currentTime = 0;
    el.play();
  }
  stop(selector) {
    const el = document.querySelector(selector);
    el.pause();
    el.currentTime = 0;
  }
}
