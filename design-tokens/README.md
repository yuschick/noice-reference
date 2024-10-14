# @noice-com/design-tokens

This package contains the 'single source of truth' for our design token system. Tokens are defined within the [yaml config](./design-tokens.yml), and then compiled into [css](./gen/brand.css) and [ts](./gen/brand.ts) so they are usable both on the web and in React Native.

## tldr; usage

1. Edit [design-tokens.yml](./design-tokens.yml)
    - Use `kebab-case` for variable names.
    - Variables should not be defined in the top-level.
    - To make a reference to another variable, use `var({group-name}.{var-name})`.
    - Check out [examples.yml](./examples.yml) for more examples.
2. Build via yarn.

```sh
$ yarn # if you haven't....
$ yarn build
```

## Defining Variables

Variables are defined in typical YAML format, with schemas defined to help with validation and intellisense where possible. There are also some helpers and built-in syntaxes that compile out to dynamic values.

### Token Config Structure

This parser expects the config to be structured in the following way:

- Top-level definitions are 'categories' of variables
- 'Category' children/properties are variables.

When compiling, it will group all variables with their category for the target languages, so it is important to keep this in mind. For example, given the following config:

```yml
color:
  primary-main: "#f00" # quotes needed because of `#`

font:
  size: 24px
  weight: 400
```

The parser will output:

```css
/* gen/brand.css */
:root {
  --noi-color-primary-main: #f00;

  --noi-font-size: 24px;
  --noi-font-weight: 400;
}
```
```ts
// gen/brand.ts
export const color = {
  primaryMain: '#f00',
};

export const font = {
  size: 24,
  weight: 400,
};
```

### Primitives

```yml
# Colors are basically passed through as-is, and are read as strings.
# CSS they do not get processed, TS they MIGHT get converted to other formats.
color:
  hex: "#f00"     # Needs quotes because '#' starts a comment in yml
  rgba: rgba(255, 0, 0, 0.1)
  # ... etc ...

# Numbers get processed slightly depending on units and platform.
# CSS they are mostly left as-is
# TS we try to use the 'raw value' as much as possible, based on what is usable.
number-units:
  number: 400         # Normal numbers are passed through directly.
  percent: 100%       # Treated as a string and passed through directly
  pixels: 24px        # px turns it into a string; 'px' gets removed for TS.
  rem: .125rem
  get-rem: getRem(16) # getRem can be added on like normal. Number value used for TS.
  # ... etc ...
```

### Referencing other variables

```yml
# You can reference other variables using a modified `var()` syntax.
# In CSS this will turn into a normal CSS variable usage, in TS the
# referenced variable value will be injected in-place.
#
# Syntax:
# var({group-name}-{variable-name})

color:
  main: "#f00"
  text-main: var(color.main)
```

Output:

```css
--noi-color-main: #f00;
--noi-color-text-main: var(--noi-color-main);
```
```ts
export const color = {
  main: '#f00',
  textMain: '#f00',
} as const;
```

### Complex values

```yml
  # Embeds raw CSS into the variable. Use this for things
  # the compiler doesn't support. Ignored for TS.
  #
  # NOTE! Variables must be written in compiled form since
  # this does not get parsed or processed.
  #
  # CSS Output:
  # --noi-expressions-raw-css: color-mix(
  #   in srgb,
  #   var(--noi-primitives-quoted-string) 5%,
  #   transparent
  # );
  raw-css:
    type: css
    css: |
      color-mix(
        in srgb,
        var(--noi-primitives-quoted-string) 5%,
        transparent
      )

  # Create a variable representing a gradient.
  # Currently ignored by TS.
  #
  # CSS Output:
  # --noi-expressions-gradient: linear-gradient(
  #   90deg,
  #   var(--noi-primitives-quoted-string) 0%,
  #   #ff0 100%
  # );
  gradient:
    type: gradient
    direction: 90deg
    steps:
      - color: var(primitives.quoted-string)
        position: 0%
      - color: "#ff0"
        position: 100%

  # Creates a variable using `calc()`. Minimal processing for CSS,
  # pre-calculated for TS if possible, ignored if not.
  #
  # CSS Output:
  # --noi-expressions-calculated-val: calc(var(--noi-primitives-number) + 20);
  calculated-val:
    type: calc
    calc: var(primitives.number) + 20
```

### Conditional Values

There is only one pre-defined property in the config, which is `conditional-values`. Any variables defined here will be compiled to have a secondary value based on a given CSS statement. This is only used for CSS at the moment.

```yaml
layout:
  direction-modifier: 1

conditional-values:
  layout:
    direction-modifier:
      value: -1
      statement: '&[dir="rtl"]'
```

Output:

```css
--noi-layout-direction-modifier: 1;

&[dir="rtl"] {
  --noi-layout-direction-modifier: -1;
}
```

## Schemas

JSON schemas for YAML validation can be found in [schemas/](./schemas/), and are written in standard json-schema format.

## Adding to the generator

@todo :(
