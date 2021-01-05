/**
 * 16進カラー文字列(ex. #FF0033)を16進数に変換
 * すでにnumberの場合はそのまま引数を返す
 *
 * @param strOrNum (ex. "#FF0033", "FF0033", 0xFF0033)
 */
export function toHex(strOrNum: string | number): number {
  if (typeof strOrNum === 'string') {
    if (strOrNum[0] === '#') strOrNum = strOrNum.slice(1);
    return parseInt(strOrNum, 16);
  } else {
    // is already num
    return strOrNum;
  }
}

/**
 * 指定数字を指定範囲内に収める
 * @param target
 * @param min
 * @param max
 */
export function clamp(target: number, min: number, max: number): number {
  return Math.min(Math.max(target, min), max);
}
