export function colorTheme() {
  figma.showUI(`
<style>
  /**
   * This is spoofing injected or CDN hosted Figma stylesheet.
   * It is maintained by Figma, and has tokens / classnames for all supported themes.
   */
  :root {
    --figma-token-background-color: #fff;
    --figma-token-text-color: #000;
  }
  :root.lightmode {
    --figma-token-background-color: #f00;
    --figma-token-text-color: #000;
  }
  :root.darkmode {
    --figma-token-background-color: #000;
    --figma-token-text-color: #f00;
  }
  :root.highcontrast {
    --figma-token-background-color: #0f0;
    --figma-token-text-color: #000;
  }
  :root.figjam {
    --figma-token-background-color: #f0f;
    --figma-token-text-color: #fff;
  }
</style>

<!-- BEGIN plugin author code -->
<style>
  body {
    background: var(--figma-token-background-color);
    color: var(--figma-token-text-color);
  }

  /* example custom props */
  :root {
    --shadow-blur: 12px;
  }
  :root.highcontrast {
    --shadow-blur: 0;
  }

  span {
    box-shadow: 4px 4px var(--shadow-blur) 0 var(--figma-token-text-color);
  }
</style>
<p>
  Hello, World!
  <br />
  I am a plugin that has no idea what theme you are using, but is using the
  right custom property tokens so things "just work."
  <br />
  Thanks, Figma!
  <br />
  <span>Nice!</span>
</p>
<!-- END plugin author code -->

<script>
  /**
   * This is spoofing Figma code that would update the plugin UI when the user theme changes.
   */
  const themes = ["lightmode", "darkmode", "highcontrast", "figjam", "NONE"];
  window.onmessage = async ({
    data: {
      pluginMessage: { type, theme },
    },
  }) => {
    if (type === "figma.theme.update") {
      document.documentElement.classList.remove(...themes);
      document.documentElement.classList.add(theme);
    }
  };
</script>

  `);

  // being used for the example only.
  // this is the simulating figma environment detecting a theme change and sending a message to the plugin.
  // rotating through all themes, changing every second
  const THEMES = ["lightmode", "darkmode", "highcontrast", "figjam", "NONE"];
  const messages = THEMES.map((theme) => ({
    type: "figma.theme.update",
    theme,
  }));
  let i = 0;
  const loop = () => {
    const message = messages[i % messages.length];
    figma.ui.postMessage(message);
    i++;
  };
  loop();
  setInterval(loop, 1000);
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
