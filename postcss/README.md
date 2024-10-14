# @noice-com/postcss

## Postcss plugins

This tool provides some postcss plugins for easy usage in esbuild etc.

### Autoprefixer

Makes sure that all need -moz-, -webkit- etc versions are added to match browser support

- Postcss functions - check below

### Postcss functions

#### getRem

getRem function makes given (pixel value) to rem values

```css
padding: getRem(48) getRem(56);
```

### Postcss nested

allows nesting in .css files

```css
.parent {
  .child {
    // styles
  }
}
```

### Postcss mixins

helper mixins for repeating css styles, like labels or visually hidden things

###Postcss custom media

helper for breaking points

```css
.component {
  @media (--breakpoint-large) {
    // styles
  }
}
```

## CSS variables

Offers common colors, font sizes etc. to be used. Import variables to your project

```ts
import "@noice-com/design-tokens/gen/brand.css";
```

and all common variables are in use

```css
.button {
  background-color: var(--red-main);
}
```

## Stylelint

Adds linting rules for css files

Create following .stylelintrc file to our project

```
{
  "extends": [
    "@noice-com/postcss/stylelint"
  ]
}
```
