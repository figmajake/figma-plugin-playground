(() => {
  // src/demos/colorTheme.ts
  var THEME_CLASSES = [
    "lightmode",
    "darkmode",
    "highcontrast",
    "figjam",
    "NONE"
  ];
  function colorTheme() {
    figma.showUI(`
    ${spoofingCdnOrInjectedFigmaCss()}

    <style>
    body {
      background: var(--figma-token-background-color);
      color: var(--figma-token-text-color);
    }
    </style>
    <p>
      Hello, World!
      <br>
      I am a plugin that has no idea what theme you are using, 
      but is using the right custom property tokens so things "just work." 
      <br>
      Thanks, Figma!
    </p>
    
    ${spoofingFigmaAddingClassNameInsideTheIframe()}
  `);
    const messages = THEME_CLASSES.map((theme) => ({
      type: "figma.theme.update",
      theme
    }));
    let i = 0;
    const loop = () => {
      const message = messages[i % messages.length];
      figma.ui.postMessage(message);
      i++;
    };
    loop();
    setInterval(loop, 1e3);
  }
  function spoofingCdnOrInjectedFigmaCss() {
    return `
<style>
:root {
  --figma-token-background-color: #FFF;
  --figma-token-text-color: #000;
}
:root.lightmode {
  --figma-token-background-color: #F00;
  --figma-token-text-color: #000;
}
:root.darkmode {
  --figma-token-background-color: #000;
  --figma-token-text-color: #F00;
}
:root.highcontrast {
  --figma-token-background-color: #0F0;
  --figma-token-text-color: #000;
}
:root.figjam {
  --figma-token-background-color: #F0F;
  --figma-token-text-color: #FFF;
}
</style>
`;
  }
  function spoofingFigmaAddingClassNameInsideTheIframe() {
    return `
<script>
const themes = ${JSON.stringify(THEME_CLASSES)};
window.onmessage = async ({ data: { pluginMessage: { type, theme } } }) => {
  if (type === "figma.theme.update") {
    document.documentElement.classList.remove(...themes);
    document.documentElement.classList.add(theme);
  }
};
<\/script>
`;
  }
  var FIGMA_COLOR_THEME = {
    figmaTokenBackgroundColor: "var(--figma-token-background-color)",
    figmaTokenTextColor: "var(--figma-token-text-color)"
  };
  FIGMA_COLOR_THEME.figmaTokenBackgroundColor;

  // src/demos/index.ts
  var { closePlugin, currentPage, notify } = figma;

  // src/code.ts
  colorTheme();
})();
