import { ArgTypes } from '@storybook/addons';

type ArgVisibility = {
  table: {
    disable: boolean;
  };
};
export const disableArg = (): ArgVisibility => ({
  table: {
    disable: true,
  },
});

export const disableArgs = <T, K extends keyof T = keyof T>(
  disabledArgs: K | K[],
  argTypes: ArgTypes = {},
): ArgTypes => {
  const result = { ...argTypes };
  const remove =
    typeof disabledArgs === 'string'
      ? [disabledArgs as string]
      : (disabledArgs as string[]).slice();
  remove.forEach((arg: string) => (result[arg] = disableArg()));
  return result;
};

export const ignoreGraphQLProps = (): ArgTypes => {
  return {
    __typename: disableArg(),
  };
};

function* idGenFn(): Generator<number> {
  let index = 0;

  while (true) {
    yield index++;
  }
}

const idGen = idGenFn();

export const getNewId = (): number => idGen.next().value;

export const relativeTimeString = (ms = 0) => new Date(Date.now() + ms).toISOString();
