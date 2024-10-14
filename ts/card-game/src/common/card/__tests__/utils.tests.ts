import {
  getCorrectTargetValuesByGlobals,
  normalizeTargetValues,
  parseGlobals,
} from '../utils';

import { GameLogicTargetValue } from '@game-gen';

const GLOBALS = [
  { name: 'lastScoringPlayer', stringValue: 'Ronaldo' },
  { name: 'goalDifference', intValue: 2 },
  { name: 'gameMode', stringValue: 'casual' },
];

const DESCRIPTION =
  '{{globals.lastScoringPlayer|Last Scoring Player}} scores {{globals.somethingElse|awesome}} goal next';
const DESCRIPTION_WITH_CUSTOM_KEYS =
  'Goal difference of {{globals.goalDifference|X}} becomes {{goalDifferenceTarget}} within {{timeout}}s';

// eslint-disable-next-line @typescript-eslint/naming-convention
const TARGET_VALUES: GameLogicTargetValue[] = [
  { label: 'goalDifferenceTarget', value: 3 },
  {
    label: 'timeout',
    value: 10,
    selector: {
      attribute: 'gameMode',
      value: { value: 'competitive', __typename: 'StringType' },
    },
  },
  {
    label: 'timeout',
    value: 20,
    selector: {
      attribute: 'gameMode',
      value: { value: 'casual', __typename: 'StringType' },
    },
  },
  {
    label: 'timeout',
    value: 15,
    selector: {
      attribute: 'gameMode',
      value: {
        emptyTypeWorkaround: true,
        __typename: 'GameLogicTargetValueSelectorDefaultValue',
      },
    },
  },
  { label: 'something', value: 5 },
  { label: 'else', value: 3 },
];

it('should parse globals from description', () => {
  const parsed = parseGlobals(DESCRIPTION, GLOBALS);
  expect(parsed).toEqual('Ronaldo scores awesome goal next');
});

it('should parse globals to default values when no globals provided', () => {
  const parsed = parseGlobals(DESCRIPTION, []);
  expect(parsed).toEqual('Last Scoring Player scores awesome goal next');
});

it('should parse globals but leave other custom keys unparsed', () => {
  const parsed = parseGlobals(DESCRIPTION_WITH_CUSTOM_KEYS, GLOBALS);
  expect(parsed).toEqual(
    'Goal difference of 2 becomes {{goalDifferenceTarget}} within {{timeout}}s',
  );
});

it('should select correct targetValues by globals', () => {
  const correctTargetValues = getCorrectTargetValuesByGlobals(TARGET_VALUES, GLOBALS);
  expect(correctTargetValues).toEqual([
    { label: 'goalDifferenceTarget', value: 3 },
    {
      label: 'timeout',
      value: 20,
      selector: {
        attribute: 'gameMode',
        value: { value: 'casual', __typename: 'StringType' },
      },
    },
    { label: 'something', value: 5 },
    { label: 'else', value: 3 },
  ]);
});

it('should use default targetValue if no globals', () => {
  const correctTargetValues = getCorrectTargetValuesByGlobals(TARGET_VALUES, []);
  expect(correctTargetValues).toEqual([
    { label: 'goalDifferenceTarget', value: 3 },
    {
      label: 'timeout',
      value: 15,
      selector: {
        attribute: 'gameMode',
        value: {
          emptyTypeWorkaround: true,
          __typename: 'GameLogicTargetValueSelectorDefaultValue',
        },
      },
    },
    { label: 'something', value: 5 },
    { label: 'else', value: 3 },
  ]);
});

it('should use first targetValue if no globals or default value', () => {
  const targetValuesWithoutDefaults = TARGET_VALUES.filter(
    (tv) =>
      !(tv.selector?.value?.__typename === 'GameLogicTargetValueSelectorDefaultValue'),
  );
  const correctTargetValues = getCorrectTargetValuesByGlobals(
    targetValuesWithoutDefaults,
    [],
  );
  expect(correctTargetValues).toEqual([
    { label: 'goalDifferenceTarget', value: 3 },
    {
      label: 'timeout',
      value: 10,
      selector: {
        attribute: 'gameMode',
        value: { value: 'competitive', __typename: 'StringType' },
      },
    },
    { label: 'something', value: 5 },
    { label: 'else', value: 3 },
  ]);
});

it('should normalize targetValues', () => {
  const normalized = normalizeTargetValues([
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'GameLogicTargetValueSelectorDefaultValue',
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'StringType',
          stringValue: 'string',
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'IntType',
          intValue: 3,
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'BooleanType',
          booleanValue: false,
        },
      },
    },
  ]);
  expect(normalized).toEqual([
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'GameLogicTargetValueSelectorDefaultValue',
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'StringType',
          stringValue: 'string',
          value: 'string',
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'IntType',
          intValue: 3,
          value: 3,
        },
      },
    },
    {
      __typename: 'GameLogicTargetValue',
      label: 'foo',
      value: 5,
      selector: {
        __typename: 'GameLogicTargetValueSelector',
        attribute: 'bar',
        value: {
          __typename: 'BooleanType',
          booleanValue: false,
          value: false,
        },
      },
    },
  ]);
});
