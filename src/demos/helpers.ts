interface MessageError {
  type: "error";
  data: string;
}
interface MessageSuccess<T> {
  type: "success";
  data: T;
}
type Message<T> = MessageError | MessageSuccess<T>;

export function execBrowserFunction<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    figma.showUI(
      `<script>
        (async () => {
          try {
            const data = await (${fn})();
            parent.postMessage({ pluginMessage: { type: "success", data  }}, "*");
          } catch({ message }) {
            parent.postMessage({ pluginMessage: { type: "error", data: message } }, "*");
          }
        })();
      </script>`,
      { visible: false }
    );
    figma.ui.onmessage = async (message: Message<T>) => {
      if (message.type === "success") {
        resolve(message.data);
      } else {
        reject(Error(message.data));
      }
    };
  });
}

export async function fetchJSON<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    figma.showUI(
      `<script>
      (async () => {
        try {
          const response = await fetch("${url}");
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          parent.postMessage({ pluginMessage: { type: "success", data } }, "*");
        } catch({ message }) {
          parent.postMessage({ pluginMessage: { type: "error", data: message } }, "*");
        }
      })();
      </script>`,
      { visible: false }
    );
    figma.ui.onmessage = async (message: Message<T>) => {
      if (message.type === "success") {
        resolve(message.data);
      } else {
        reject(Error(message.data));
      }
    };
  });
}

export async function fillWithImageUrl(
  url: string,
  node: SceneNode
): Promise<Paint[]> {
  return new Promise((resolve, reject) => {
    if (!("fills" in node)) {
      return reject("Unfillable node");
    }
    figma.showUI(
      `<script>
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
      </script>`,
      { visible: false }
    );
    figma.ui.onmessage = async (message: Message<Uint8Array>) => {
      if (message.type === "success") {
        const value: Uint8Array = message.data;
        const image = figma.createImage(value);
        const fills: Paint[] = [
          { type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" },
        ];
        node.fills = fills;
        resolve(fills);
      } else {
        reject(Error(message.data));
      }
    };
  });
}

// get form data
