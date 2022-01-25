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
    let i = 0;
    const loop = () => {
      const messages = THEME_CLASSES.map((theme) => ({
        type: "theme.update",
        theme
      }));
      const message = messages[i % messages.length];
      figma.ui.postMessage(message);
      i++;
    };
    loop();
    setInterval(loop, 1500);
  }
  function spoofingCdnOrInjectedFigmaCss() {
    return `
<style>
:root {
  --figma-token-background-color: #FFF;
  --figma-token-text-color: #000;
}

body:not(.opting-out-of-syncing-tokens-with-figma-theme).lightmode {
  --figma-token-background-color: #F00;
  --figma-token-text-color: #000;
}
body:not(.opting-out-of-syncing-tokens-with-figma-theme).darkmode {
  --figma-token-background-color: #000;
  --figma-token-text-color: #F00;
}
body:not(.opting-out-of-syncing-tokens-with-figma-theme).highcontrast {
  --figma-token-background-color: #0F0;
  --figma-token-text-color: #000;
}
body:not(.opting-out-of-syncing-tokens-with-figma-theme).figjam {
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
  if (type === "theme.update") {
    document.body.classList.remove(...themes);
    document.body.classList.add(theme);
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
