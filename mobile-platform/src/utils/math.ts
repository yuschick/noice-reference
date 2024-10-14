// @noice-com/utils already contains number formatter for compact numbers,
// however, React Native has a missing support for `Intl.NumberFormat` with `notation: 'compact'`. so this is a workaround for that.
export const compactNumberFormatter = (number: number): string => {
  if (number < 1000) {
    return number.toString();
  }

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(('' + number).length / 3);
  let shortValue: string | number = parseFloat(
    (suffixNum !== 0 ? number / Math.pow(1000, suffixNum) : number).toPrecision(2),
  );
  if (shortValue % 1 !== 0) {
    shortValue = shortValue.toFixed(1);
  }
  return shortValue + suffixes[suffixNum];
};

export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  const x = centerX + radius * Math.cos(angleInRadians);
  const y = centerY + radius * Math.sin(angleInRadians);

  return { x, y };
};

export const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) => {
  const { x: startX, y: startY } = polarToCartesian(x, y, radius, endAngle);
  const { x: endX, y: endY } = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    startX,
    startY,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    endX,
    endY,
  ].join(' ');

  return d;
};
