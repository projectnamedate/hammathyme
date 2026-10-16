// Material ramps from the Anatomy kit's 3D mode (kit/turn.mjs, T3_MATERIALS, MIT): each remaps
// the kit's tone tokens for one finish, light and dark, ordered so faces still read by facing.
// They apply only under data-finish="metal" on the figure's host.
const KEYS = ["paper", "face", "top", "shade-0", "shade-1", "shade-2", "shade-3", "lit-top", "lit-shade", "hi", "mid", "lo", "faint", "dot", "lit"];
const TUBE = ["body", "shine", "shade", "edge"];
const MATERIALS = {
  gunmetal: {
    light: ["#444a51", "#50575e", "#5f666e", "#2f3439", "#393f45", "#444a51", "#50575e", "#6d757d", "#4b5258", "#0f1113", "#1d2125", "#272b30", "#30353a", "#b0b5ba", "#000000", "#3d4349", "#6e757c", "#24282c", "#0f1113"],
    dark: ["#1d2125", "#22272b", "#2a2f34", "#15181b", "#191c20", "#1d2125", "#22272b", "#323840", "#20252a", "#a9b0b7", "#5c636a", "#3a4046", "#2a2f34", "#b8bec4", "#ffffff", "#1f2327", "#3a4046", "#111316", "#a9b0b7"],
  },
  chrome: {
    light: ["#8e959c", "#c3c8cd", "#f7f8f9", "#a2a9b0", "#6f767d", "#454b52", "#cacfd4", "#ffffff", "#bcc2c8", "#202428", "#585e65", "#878d94", "#a9afb5", "#2a2e33", "#000000", "#8b9299", "#fbfcfd", "#3c4248", "#202428"],
    dark: ["#2a2e32", "#4a5056", "#6e757c", "#2e3236", "#24272b", "#1a1d20", "#4a5056", "#848b92", "#3a3f44", "#dfe3e7", "#7c838a", "#4d5359", "#363b40", "#e4e7ea", "#ffffff", "#34393e", "#9aa1a8", "#16191b", "#dfe3e7"],
  },
  steel: {
    light: ["#b8bdc1", "#cdd1d4", "#e5e8ea", "#8f959b", "#a4aaaf", "#b8bdc1", "#cdd1d4", "#f1f3f4", "#c6cacd", "#2b2f33", "#6b7177", "#959ba1", "#aeb3b8", "#33373b", "#000000", "#b3b8bd", "#eef0f2", "#7d8389", "#2b2f33"],
    dark: ["#2c3034", "#34393d", "#3e4348", "#1f2225", "#25292c", "#2c3034", "#34393d", "#4a5056", "#33383c", "#d0d4d8", "#727980", "#4a5056", "#33383d", "#d8dce0", "#ffffff", "#30353a", "#5c6369", "#1a1d20", "#d0d4d8"],
  },
  brass: {
    light: ["#bd9646", "#d2ad5b", "#e6c87e", "#8a6a2c", "#a47f38", "#bd9646", "#d2ad5b", "#f0d796", "#c8a252", "#3f2e0e", "#765a24", "#9a7a3c", "#b08c46", "#3a2a0c", "#1f1606", "#b8913f", "#efd795", "#7d5f26", "#3f2e0e"],
    dark: ["#3d3017", "#49391c", "#574523", "#2a210f", "#332813", "#3d3017", "#49391c", "#66522b", "#45371b", "#e9cf8a", "#8e7438", "#5e4c25", "#44371c", "#e9cf8a", "#fff0c8", "#433419", "#8a6f36", "#21190b", "#e9cf8a"],
  },
  rubber: {
    light: ["#2a2b2e", "#34363a", "#46484d", "#1b1c1e", "#222326", "#2a2b2e", "#34363a", "#55575c", "#2f3134", "#070708", "#111214", "#18191b", "#1f2023", "#6a6c70", "#000000", "#27282b", "#5b5d62", "#121314", "#050506"],
    dark: ["#121213", "#161618", "#1c1c1f", "#0c0c0d", "#0f0f10", "#121213", "#161618", "#232327", "#141416", "#8c8e92", "#4a4c50", "#2c2d30", "#1f2023", "#9a9ca0", "#ffffff", "#131315", "#2b2c30", "#0a0a0b", "#8c8e92"],
  },
};

export function materialCss() {
  const block = (values) => KEYS.map((key, i) => `--anatomy-${key}:${values[i]}`).concat(TUBE.map((key, i) => `--mat-${key}:${values[KEYS.length + i]}`)).join(";");
  const rules = [];
  for (const [name, { light, dark }] of Object.entries(MATERIALS)) {
    rules.push(`.iso[data-finish="metal"] [data-mat="${name}"]{${block(dark)}}`);
    rules.push(`.iso[data-finish="metal"][data-theme="light"] [data-mat="${name}"]{${block(light)}}`);
  }
  rules.push(`.iso[data-finish="metal"] [data-mat] .tb-body{fill:var(--mat-body)}`);
  rules.push(`.iso[data-finish="metal"] [data-mat] .tb-shine{fill:var(--mat-shine)}`);
  rules.push(`.iso[data-finish="metal"] [data-mat] .tb-shade{fill:var(--mat-shade)}`);
  rules.push(`.iso[data-finish="metal"] [data-mat] .tb-edge{stroke:var(--mat-edge)}`);
  return rules.join("\n");
}

// Which finish each part wears, by item name; the first match wins. The stand and bench stay in
// the kit's greys, so the machine reads as the finished object on its ground.
const RULES = [
  [/^stand\.pedestal|^stand\.tilt/, "gunmetal"],
  [/^stand\.lamp\./, "steel"],
  [/^film\.|^lampcore\.|^lamp\.condenser\.glass|^stand\./, null],
  [/^head\.belt|^rollers\.[a-z]+$|knob$/, "rubber"],
  [/^head\.sprocket\.|^gate\./, "chrome"],
  [/^lens\.|handle$|hinge|^head\.oilcup|^head\.gearbox\.filler|^reels\.take\.clutch/, "brass"],
  [/^reels\.[a-z]+\.pack/, null],
  [/^head\.(hub|boss|shaft|pulley|stud)|^movement\.|^shutter\.|^reels\.|^rollers\./, "steel"],
  [/^head\.|^lamp\./, "gunmetal"],
];
export function materialOf(name) {
  for (const [test, material] of RULES) if (test.test(name)) return material;
  return null;
}
