import { findGlobals } from '../utils';

const TEST_STRING =
  '{{globals.lastScoringPlayer|Last Scoring Player}} foo {{globals.somethingElse}}';

it('should find globals from str', () => {
  const matches = findGlobals(TEST_STRING);
  expect(JSON.stringify(matches)).toEqual(
    JSON.stringify([
      [
        '{{globals.lastScoringPlayer|Last Scoring Player}}',
        'lastScoringPlayer',
        'Last Scoring Player',
      ],
      ['{{globals.somethingElse}}', 'somethingElse', undefined],
    ]),
  );
});
