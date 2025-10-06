import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getDatabase, ref, set, onValue, update } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAFxySMA5E_RTSUYKB4i5WlDn9VMw1K1Do",
  authDomain: "drift-1e026.firebaseapp.com",
  databaseURL: "https://drift-1e026-default-rtdb.firebaseio.com",
  projectId: "drift-1e026",
  storageBucket: "drift-1e026.appspot.com",
  messagingSenderId: "741283856047",
  appId: "1:741283856047:web:65272da8838561591d5e5a",
  measurementId: "G-TS7XD8N6CM"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const PIXEL_SIZE = 10; // pixel square size

const COLORS = [
  '#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF',
  '#000000','#FFFFFF','#800080','#FFA500','#A52A2A','#008000',
  '#FFC0CB','#808080','#ADD8E6','#00FA9A'
];

class PixelCanvas {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.pixels = {};
    this.framePixels = {};
    this.selectedColor = COLORS[0];
    this.brushSize = 1;
    this.useFill = false;
    this.isDrawing = false;

    this.playerId = 'player_' + Math.random().toString(36).substr(2,9);
    this.otherCursors = {};

    this.gridCols = 100; // initial grid
    this.gridRows = 100;

    this.initUI();
    this.initEvents();
    this.initFirebase();

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.drawLoop();
  }

  // Resize canvas and extend grid to fill container
  resizeCanvas() {
    const container = document.getElementById('canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    this.gridCols = Math.ceil(containerWidth / PIXEL_SIZE);
    this.gridRows = Math.ceil(containerHeight / PIXEL_SIZE);

    this.canvas.width = this.gridCols * PIXEL_SIZE;
    this.canvas.height = this.gridRows * PIXEL_SIZE;
  }

  initUI() {
    const palette = document.getElementById('colorPalette');
    palette.innerHTML = '';
    COLORS.forEach(color => {
      const div = document.createElement('div');
      div.className = 'color';
      div.style.backgroundColor = color;
      div.addEventListener('click', () => this.selectColor(color));
      palette.appendChild(div);
    });

    document.getElementById('customColor').addEventListener('input', e => {
      this.selectColor(e.target.value);
    });

    document.querySelectorAll('#top-bar button[data-size]').forEach(btn => {
      btn.addEventListener('click', () => { 
        this.brushSize = parseInt(btn.dataset.size); 
        this.updateUIStyles();
      });
    });

    document.getElementById('fillToolBtn').addEventListener('click', () => {
      this.useFill = !this.useFill;
      this.updateUIStyles();
    });

    document.getElementById('clearBtn').addEventListener('click', () => this.clearCanvas());
    document.getElementById('saveBtn').addEventListener('click', () => this.saveCanvas());

    this.updateUIStyles();
  }

  selectColor(color) {
    this.selectedColor = color;
    document.querySelectorAll('.color').forEach(div =>
      div.classList.toggle('selected', div.style.backgroundColor === color)
    );
    this.updateUIStyles();
  }

  updateUIStyles() {
    document.querySelectorAll('#top-bar button[data-size]').forEach(btn => {
      if (parseInt(btn.dataset.size) === this.brushSize) {
        btn.style.border = `2px solid ${this.selectedColor}`;
        btn.style.backgroundColor = 'transparent';
      } else {
        btn.style.border = '';
        btn.style.backgroundColor = '';
      }
    });

    const fillBtn = document.getElementById('fillToolBtn');
    if (this.useFill) {
      fillBtn.style.border = `2px solid ${this.selectedColor}`;
      fillBtn.style.backgroundColor = 'transparent';
    } else {
      fillBtn.style.border = '';
      fillBtn.style.backgroundColor = '';
    }
  }

  clearCanvas() {
    if (!confirm('Clear canvas?')) return;
    this.pixels = {};
    this.framePixels = {};
    set(ref(database, 'pixels'), {});
  }

  saveCanvas() {
    const link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = this.canvas.toDataURL();
    link.click();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', e => {
      if (e.button === 0) {
        const { x, y } = this.screenToCanvas(e.clientX, e.clientY);
        if (this.useFill) this.floodFill(x, y);
        else {
          this.isDrawing = true;
          this.drawBrush(x, y);
        }
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDrawing) this.sendFramePixels();
      this.isDrawing = false;
    });

    this.canvas.addEventListener('mousemove', e => {
      const { x, y } = this.screenToCanvas(e.clientX, e.clientY);

      const cursorRef = ref(database, `cursors/${this.playerId}`);
      set(cursorRef, { x, y, color: this.selectedColor });

      if (this.isDrawing) this.drawBrush(x, y);
    });
  }

  screenToCanvas(sx, sy) {
    const rect = this.canvas.getBoundingClientRect();
    const x = Math.floor((sx - rect.left) / PIXEL_SIZE);
    const y = Math.floor((sy - rect.top) / PIXEL_SIZE);
    return { x, y };
  }

  drawBrush(cx, cy) {
    const half = Math.floor(this.brushSize / 2);
    for (let dx = -half; dx <= half; dx++) {
      for (let dy = -half; dy <= half; dy++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.gridCols && y >= 0 && y < this.gridRows) {
          const key = `${x}_${y}`;
          this.pixels[key] = this.selectedColor;
          this.framePixels[key] = this.selectedColor;
        }
      }
    }
  }

  sendFramePixels() {
    if (Object.keys(this.framePixels).length === 0) return;
    const updates = {};
    for (const key in this.framePixels) updates[`pixels/${key}`] = this.framePixels[key];
    update(ref(database), updates);
    this.framePixels = {};
  }

  floodFill(sx, sy) {
    const target = this.pixels[`${sx}_${sy}`] || '#FFFFFF';
    if (target === this.selectedColor) return;
    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      const key = `${x}_${y}`;
      if (this.pixels[key] === target || (!this.pixels[key] && target === '#FFFFFF')) {
        this.pixels[key] = this.selectedColor;
        this.framePixels[key] = this.selectedColor;
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => {
          const nx = x + dx, ny = y + dy;
          if(nx >=0 && nx < this.gridCols && ny >=0 && ny < this.gridRows) stack.push([nx,ny]);
        });
      }
    }
    this.sendFramePixels();
  }

  initFirebase() {
    const pixelsRef = ref(database, 'pixels');
    onValue(pixelsRef, snapshot => {
      this.pixels = snapshot.val() || {};
    });

    const cursorsRef = ref(database, 'cursors');
    onValue(cursorsRef, snapshot => {
      this.otherCursors = snapshot.val() || {};
      delete this.otherCursors[this.playerId];
    });
  }

  drawLoop() {
    requestAnimationFrame(() => this.drawLoop());

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const key in this.pixels) {
      const [x, y] = key.split('_').map(Number);
      this.ctx.fillStyle = this.pixels[key];
      this.ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }

    for (const playerId in this.otherCursors) {
      const c = this.otherCursors[playerId];
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(c.x * PIXEL_SIZE, c.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
}

new PixelCanvas();
