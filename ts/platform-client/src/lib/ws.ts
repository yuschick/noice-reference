import { MatchGroupErrorCode } from '@noice-com/schemas/match/match.pb';

/**
 * Returns whether a given WS closure code is a normal/expected closure.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
 * @param {number} code The closure code.
 * @returns {boolean} If it is a normal closure.
 */
export function isNormalClosure(code: number): boolean {
  switch (code) {
    case 1000: // normal closure
    case 1001: // browser going to another page
      return true;
    default:
      return false;
  }
}

export function getMatchErrorCode(err: MatchGroupErrorCode): number {
  return Object.values(MatchGroupErrorCode).indexOf(err);
}
