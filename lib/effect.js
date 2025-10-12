// pixelFade.js
(function() {
  function init() {
    // Create top-layer canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'pixelCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Make it non-interactive
    canvas.style.zIndex = '9999'; // On top
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const pixelSize = 10;
    let cols, rows;
    let pixels = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / pixelSize);
      rows = Math.floor(canvas.height / pixelSize);
      initializePixels();
    }

    function randomColor() {
      return `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
    }

    function initializePixels() {
      pixels = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          pixels.push([row, col, randomColor()]);
        }
      }
      drawAllPixels();
    }

    function drawAllPixels() {
      for (const [row, col, color] of pixels) {
        ctx.fillStyle = color;
        ctx.fillRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
      }
    }

    function removePixelsFast() {
      function removeChunk() {
        for (let i = 0; i < 100 && pixels.length > 0; i++) {
          const index = Math.floor(Math.random() * pixels.length);
          const [row, col] = pixels.splice(index, 1)[0];
          ctx.clearRect(col*pixelSize, row*pixelSize, pixelSize, pixelSize);
        }
        if (pixels.length > 0) {
          requestAnimationFrame(removeChunk);
        } else {
          // Remove the canvas completely after animation
          canvas.remove();
          start3DIntro();
        }
      }
      removeChunk();
    }

    function start3DIntro() {
      console.log("3D intro starts here!");
      // Your 3D intro code goes here
    }

    resizeCanvas();
    removePixelsFast();

    window.addEventListener('resize', resizeCanvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
