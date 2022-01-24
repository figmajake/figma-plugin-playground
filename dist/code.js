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

  // src/demos/helpers.ts
  function fillWithImageUrl(url, node) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        if (!("fills" in node)) {
          return reject("Unfillable node");
        }
        figma.showUI(`<script>
      (async () => {
        try {
          const image = new Image();
          image.src = "${url}";
          image.crossOrigin = "Anonymous";

          image.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              const reader = new FileReader();
              reader.onload = () => {
                parent.postMessage({ 
                  pluginMessage: {
                    type: "success",
                    data: new Uint8Array(reader.result) 
                  }
                }, "*")
              }
              reader.onerror = () => {
                throw new Error("Could not read image from blob");
              }
              reader.readAsArrayBuffer(blob);
            });
          };

          image.onerror = () => {
            throw new Error(\`Could not load image url "${url}"\`);
          }
        } catch({ message }) {
          parent.postMessage({ pluginMessage: { type: "error", data: message } }, "*");
        }
      })();
      <\/script>`, { visible: false });
        figma.ui.onmessage = (message) => __async(this, null, function* () {
          if (message.type === "success") {
            const value = message.data;
            const image = figma.createImage(value);
            const fills = [
              { type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" }
            ];
            node.fills = fills;
            resolve(fills);
          } else {
            reject(Error(message.data));
          }
        });
      });
    });
  }

  // src/demos/colorTheme.ts
  var FIGMA_COLOR_THEME = {
    figmaTokenBackgroundColor: "var(--figma-token-background-color)",
    figmaTokenTextColor: "var(--figma-token-text-color)"
  };
  FIGMA_COLOR_THEME.figmaTokenBackgroundColor;

  // src/demos/index.ts
  var { closePlugin, currentPage, notify } = figma;
  function runFillWithImageUrl() {
    return __async(this, null, function* () {
      const { selection } = currentPage;
      const item = selection[0];
      try {
        if (selection.length !== 1 || !item || !("fills" in item)) {
          throw new Error("Select one fillable item");
        }
        yield fillWithImageUrl("https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80", item);
        closePlugin();
      } catch (error) {
        notify(error.message, { error: true });
        closePlugin();
      }
    });
  }

  // src/code.ts
  runFillWithImageUrl();
})();
