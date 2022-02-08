(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/demos/animation.ts
  function animation() {
    figma.showUI(`<canvas></canvas>
    <script>
      const canvas = document.querySelector("canvas");
      const context = canvas.getContext("2d");
      window.onmessage = async (event) => {
        requestAnimationFrame(() => {
          const { x, y, width, height, di } = event.data.pluginMessage;
          canvas.width = width;
          canvas.height = height;
          context.fillStyle = "red";
          context.fillRect(0, 0, width, height);
          context.fillStyle = "black";
          context.fillRect(x, y, di, di);
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onload = () => {
              parent.postMessage({ 
                pluginMessage: new Uint8Array(reader.result) 
              }, "*");
            }
            reader.readAsArrayBuffer(blob);
          });
        })
      }
    <\/script>`, { visible: true });
    const width = 100;
    const height = 100;
    const di = 4;
    let x = 0;
    const y = height * 0.5 - di * 0.5;
    const node = figma.createRectangle();
    node.resize(width, height);
    getFrame();
    let image;
    figma.ui.onmessage = (value) => __async(this, null, function* () {
      image = figma.createImage(value);
      node.fills = node.fills;
      const fills = node.fills.slice(node.fills.length - 3, node.fills.length);
      fills.push({ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" });
      node.fills = fills;
      getFrame();
    });
    function getFrame() {
      x = x > width - di ? 0 : x + 1;
      figma.ui.postMessage({
        x,
        y,
        width,
        height,
        di
      });
    }
  }

  // src/demos/colorTheme.ts
  var FIGMA_COLOR_THEME = {
    figmaTokenBackgroundColor: "var(--figma-token-background-color)",
    figmaTokenTextColor: "var(--figma-token-text-color)"
  };
  FIGMA_COLOR_THEME.figmaTokenBackgroundColor;

  // src/demos/index.ts
  var { closePlugin, currentPage, notify } = figma;

  // src/code.ts
  animation();
})();
