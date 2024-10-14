const getRem = (value) => {
  return `${value / 16}rem`;
};

const getVarRem = (value) => {
  return `calc(${getRem(1)} * ${value})`;
};

/* Returns the logical value for a transform relative to the document `direction` property. */
const getLogicalValue = (value) => {
  return `calc(${value} * var(--noi-direction-modifier))`;
}

const hexToRgbParts = (hex, opacity = -1) => {
  if (hex.length < 4 || (hex.length > 4 && hex.length < 7) || hex.length > 7) {
    return [255, 0, 255];
  }

  let baseHex = hex.slice(1);
  // Check for shorthand
  if (baseHex.length === 3) {
    const [r1, g1, b1] = baseHex.split("");
    baseHex = r1 + r1 + g1 + g1 + b1 + b1;
  }

  const [r2, g2, b2] = baseHex.match(/[a-fA-F\d]{1,2}/g);
  const rgbParts = [parseInt(r2, 16), parseInt(g2, 16), parseInt(b2, 16)];

  if (opacity > -1) return [...rgbParts, opacity];
  return rgbParts;
};

const hexToRgb = (color, opacity = -1) => {
  const [r, g, b] = hexToRgbParts(color);
  return opacity > -1
    ? `rgba(${r}, ${g}, ${b}, ${opacity})`
    : `rgb(${r}, ${g}, ${b})`;
};

const pixelsToCardCqi = (numberInPixels) => {
  /* We use this function to translate the pixel values in figma to relative units of the card
     depending on the card container size. This is used in very similar way as getRem function
     except this gives as result cqi units.
  
     We calculate the given number in pixels relative to the "default" card width 200.
     One cqi is 1% of a query container's inline size so we basically get as a result
     relative unit to its size. */
  return `${numberInPixels / 200 * 100}cqi`;
};

const functions = {
  getLogicalValue,
  getRem,
  getVarRem,
  hexToRgba: hexToRgb,
  pixelsToCardCqi,
};

module.exports = functions;
