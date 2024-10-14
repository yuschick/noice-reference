import { WithChildren } from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import { createContext, useContext, useState } from 'react';

import { TopAction, TopLabel } from '../types';

interface Context {
  titleSuffix: Nullable<string>;
  labels: TopLabel[];
  actions: TopAction[];
  setTitleSuffix(title: Nullable<string>): void;
  setLabels(labels: TopLabel[]): void;
  setActions(actions: TopAction[]): void;
}

const TopContentContext = createContext<Nullable<Context>>(null);

export const TopContentProvider = ({ children }: WithChildren) => {
  const [titleSuffix, setTitleSuffix] = useState<Nullable<string>>(null);
  const [labels, setLabels] = useState<TopLabel[]>([]);
  const [actions, setActions] = useState<TopAction[]>([]);

  return (
    <TopContentContext.Provider
      value={{
        titleSuffix,
        labels,
        actions,
        setTitleSuffix,
        setLabels,
        setActions,
      }}
    >
      {children}
    </TopContentContext.Provider>
  );
};

export const useTopContent = (): Context => {
  const context = useContext(TopContentContext);

  if (!context) {
    throw new Error(
      'Trying to access top content from context without TopContentContext',
    );
  }

  return context;
};
