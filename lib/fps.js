(function() {
  'use strict';

  class FPSCounter {
    constructor(targetFPS = 60, updateInterval = 250) { // update every 250ms
      this.targetFPS = targetFPS;
      this.updateInterval = updateInterval;
      this.frames = 0;
      this.lastTime = performance.now();
      this.lastUpdate = this.lastTime;
      this.fps = 0;
      this.el = this.create();
      this.start();
    }

    create() {
      const e = document.createElement('div');
      e.style.position = 'fixed';
      e.style.top = '10px';
      e.style.right = '10px';
      e.style.zIndex = '999999';
      e.style.background = 'rgba(0,0,0,0.7)';
      e.style.color = '#fff';
      e.style.padding = '5px 10px';
      e.style.fontFamily = 'monospace';
      e.style.fontSize = '14px';
      e.style.borderRadius = '5px';
      e.style.pointerEvents = 'none';
      document.body.appendChild(e);
      return e;
    }

    getColor(fps) {
      if (fps >= this.targetFPS * 0.9) return '#00FF00'; // green
      if (fps >= this.targetFPS * 0.7) return '#FFFF00'; // yellow
      return '#FF0000'; // red
    }

    update() {
      this.frames++;
      const now = performance.now();
      const delta = now - this.lastUpdate;

      if (delta >= this.updateInterval) {
        const elapsed = now - this.lastTime;
        this.fps = Math.round((this.frames * 1000) / elapsed);
        this.frames = 0;
        this.lastTime = now;
        this.lastUpdate = now;
        this.render();
      }
    }

    render() {
      this.el.textContent = `FPS: ${this.fps}`;
      this.el.style.color = this.getColor(this.fps);
    }

    start() {
      const loop = () => {
        this.update();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  new FPSCounter();
})();
