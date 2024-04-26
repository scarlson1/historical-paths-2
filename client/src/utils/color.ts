import { Color } from 'deck.gl';

export function hexToRgbObj(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// USAGE:
// alert(hexToRgb("#0033ff").g); // "51";
// alert(hexToRgb("#03f").g); // "51";

export function getRGBAArray(
  hex: string,
  alpha: number = 255,
  fallback: Color = [255, 255, 255, alpha]
): Color {
  const rgb = hexToRgbObj(hex);
  if (!rgb) return fallback;

  console.log(rgb);
  return [rgb?.r, rgb?.g, rgb?.b, alpha];
}
