const THEME_CLASSES = [
  "lightmode",
  "darkmode",
  "highcontrast",
  "figjam",
  "NONE",
];

export function colorTheme() {
  figma.showUI(`
    ${spoofingCdnOrInjectedFigmaCss()}

    <style>
    body {
      background: #F00;
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
      theme,
    }));
    const message = messages[i % messages.length];
    figma.ui.postMessage(message);
    i++;
  };
  loop();
  setInterval(loop, 1500);
}

/**
 * This is spoofing a UA or CDN hosted Figma stylesheet.
 * It is maintained by Figma, and has tokens / classnames for all supported themes.
 */
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

/**
 * This is spoofing Figma code that would update the plugin UI when the user theme changes.
 */
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
</script>
`;
}

/**
 * Future, could also povide these custom property references in a
 * typed and documented theme object.
 */

interface FigmaColorTheme {
  /**
   * A color used at the root level on backgrounds. Furthest back color.
   * https://figma.com
   */
  figmaTokenBackgroundColor: "var(--figma-token-background-color)";
  /**
   * Default text color. to be used on background color.
   */
  figmaTokenTextColor: "var(--figma-token-text-color)";
}

const FIGMA_COLOR_THEME: FigmaColorTheme = {
  figmaTokenBackgroundColor: "var(--figma-token-background-color)",
  figmaTokenTextColor: "var(--figma-token-text-color)",
};

FIGMA_COLOR_THEME.figmaTokenBackgroundColor;
