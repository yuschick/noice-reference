# @todo

## Transpiler

- [ ] Add support for nested groups (required for better TS usage)
- [ ] Remove unnecessary build-css / build-ts files (move logic to transpilers)
  - I added these when trying to parallelize the transpilation using workers; however the overhead and delay caused by spawning the workers sort of undoes any speed boost from transpiling the CSS/TS in parallel, so I wound up getting rid of it. These files could just be moved to their respective transpilers, rather than being thrown into their own file.

## CSS output

- [ ] Preserve multi-line formatting in output CSS (for css + gradients + etc..)
- [ ] Add support for different types of gradients
- [ ] Support more complex CSS functions, like color-mix out of the box

## TS Output

- [ ] Implement calculating `calc` values at build time instead of ignoring them
- [ ] Figure out how we can support gradients in a meaningful way
