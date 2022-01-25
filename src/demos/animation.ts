export function animation() {
  figma.showUI(
    `<canvas></canvas>
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
    </script>`,
    { visible: true }
  );
  const width = 100;
  const height = 100;
  const di = 4;
  let x = 0;
  const y = height * 0.5 - di * 0.5;
  const node = figma.createRectangle();
  node.resize(width, height);
  getFrame();

  let image;

  figma.ui.onmessage = async (value: Uint8Array) => {
    image = figma.createImage(value);
    node.fills = node.fills as Paint[];
    const fills: Paint[] = node.fills.slice(
      node.fills.length - 3,
      node.fills.length
    );
    fills.push({ type: "IMAGE", imageHash: image.hash, scaleMode: "FILL" });
    node.fills = fills;
    getFrame();
  };

  function getFrame() {
    x = x > width - di ? 0 : x + 1;
    figma.ui.postMessage({
      x,
      y,
      width,
      height,
      di,
    });
  }
}
