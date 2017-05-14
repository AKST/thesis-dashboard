import { shuffle } from 'ui/utils/array'

// TODO improve effiency
//
//    performance at the moment N^3 + N
export function pallet(intensities) {
  const result = []

  for (const r of shuffle(intensities)) {
    if (typeof r !== 'string') throw new TypeError('item must be strings');
    for (const g of shuffle(intensities)) {
      if (r === g) continue;
      for (const b of shuffle(intensities)) {
        if (b === g || b === r) continue;
        result.push(`#${r+r}${g+g}${b+b}`);
      }
    }
  }

  return shuffle(result);
}
