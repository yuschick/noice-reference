import { channelModule } from './channel/module';
import { platformModule } from './platform/module';
import { reportModule } from './reports/module';
import { searchModule } from './search/module';
import { userModule } from './users/module';

import { Module } from '@common/module';

export const modules: Module[] = [
  userModule,
  channelModule,
  platformModule,
  reportModule,
  searchModule,
];
