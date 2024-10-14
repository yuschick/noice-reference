declare function getLogicalValue(value: string): string;
declare function getRem(value: number): string;
declare function getVarRem(value: string): string;
declare function hexToRgba(color: string, opacity: number): string;
declare function pixelsToCardCqi(valueInPixels: number): string;

export = {
  getLogicalValue,
  getRem,
  getVarRem,
  hexToRgba,
  pixelsToCardCqi,
};
