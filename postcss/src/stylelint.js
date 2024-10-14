module.exports = {
  extends: ["stylelint-config-recommended", "stylelint-config-rational-order"],
  plugins: [
    "stylelint-high-performance-animation",
    "stylelint-plugin-logical-css",
    "stylelint-plugin-defensive-css",
  ],
  rules: {
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["getLogicalValue", "getRem", "hexToRgba", "getVarRem", "pixelsToCardCqi"],
      },
    ],
    "rule-empty-line-before": [
      "always",
      { except: ["first-nested", "after-single-line-comment"] },
    ],
    "max-nesting-depth": 2,
    "no-unknown-animations": true,
    "declaration-property-value-allowed-list": {
      "/color/": [
        "/var\\(--_.*\\)/",
        "/var\\(--noi-color.*\\)/",
        "/var\\(--noi-gradient-.*\\)/",
        "transparent",
        "inherit",
        "currentColor",
      ],
      border: [
        "/var\\(--_.*\\)/",
        "/var\\(--noi-color.*\\)/",
        "/transparent/",
        "/inherit/",
        "none",
      ],
      "font-size": ["/var\\(--_.*\\)/", "/var\\(--noi-font-size.*\\)/", "/pixelsToCardCqi\\(\\d+\\)/", "/.*cqi/"],
      "font-weight": ["/var\\(--_.*\\)/", "/var\\(--noi-font-weight.*\\)/"],
      "line-height": ["inherit", "/var\\(--_.*\\)/", "/var\\(--noi-line-height.*\\)/", "/pixelsToCardCqi\\(\\d+\\)/"],
      "letter-spacing": ["inherit", "/var\\(--_.*\\)/", "/var\\(--noi-letter-spacing.*\\)/", "/.*em/", "/pixelsToCardCqi\\(\\d+\\)/"],
      "z-index": ["/var\\(--_.*\\)/", "/var\\(--noi-z-index.*\\)/"],
    },
    "declaration-property-value-disallowed-list": {
      "/.*/": ["/rgb/"],
    },
    "at-rule-no-unknown": [true, { ignoreAtRules: ["define-mixin", "mixin"] }],
    "unit-allowed-list": [
      ["rem", "ms", "%", "deg", "vw", "vh", "fr", "dvh", "vi", "vb", "cqi", "lh"],
      {
        ignoreProperties: {
          em: ["letter-spacing"],
          px: ["/border-*/", "box-shadow", "backdrop-filter", "filter"],
        },
      },
    ],
    "declaration-block-no-duplicate-properties": true,
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
    "plugin/no-low-performance-animation-properties": [
      true,
      {
        ignoreProperties: [
          "color",
          "background-color",
          "border-color",
          "border",
        ],
        severity: "warning",
      },
    ],
    "selector-class-pattern": [
      "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message: "Expected custom property name to be kebab-case",
      },
    ],
    "plugin/use-logical-properties-and-values": [
      true,
      {
        severity: "warning",
        ignore: ["overflow-y", "overflow-x", "caption-side", "float", "clear"],
      },
    ],
    /* Enable the following when support increases: https://caniuse.com/mdn-css_types_length_viewport_percentage_units_dynamic */
    "plugin/use-logical-units": null,
    "plugin/use-defensive-css": [
      true,
      {
        severity: "warning",
        "background-repeat": true,
        "flex-wrapping": true,
        "vendor-prefix-grouping": true,
        "accidental-hover": true
      },
    ],
    /* We have to disable the default one, as we have getRem function in use */
    "media-query-no-invalid": null,
    "media-feature-name-no-unknown": true,
  },
};
