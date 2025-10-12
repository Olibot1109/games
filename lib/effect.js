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
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
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
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      }
    }

    function removePixelsSlow() {
      function removeChunk() {
        for (let i = 0; i < 100 && pixels.length > 0; i++) {
          const index = Math.floor(Math.random() * pixels.length);
          const [row, col, color] = pixels.splice(index, 1)[0];

          // Fade pixel
          let alpha = 1;
          function fadePixel() {
            alpha -= 0.05;
            if (alpha <= 0) {
              ctx.clearRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
            } else {
              ctx.fillStyle = color.replace('rgb', 'rgba').replace(')', `,${alpha})`);
              ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
              requestAnimationFrame(fadePixel);
            }
          }
          fadePixel();
        }

        if (pixels.length > 0) {
          requestAnimationFrame(removeChunk);
        } else {
          // Wait a moment to finish fading, then remove canvas
          setTimeout(() => {
            canvas.remove();
            start3DIntro();
          }, 1000);
        }
      }
      removeChunk();
    }

    function start3DIntro() {
      console.log("3D intro starts here!");
      // Put your 3D intro code here
    }

    resizeCanvas();
    removePixelsSlow();

    window.addEventListener('resize', resizeCanvas);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
