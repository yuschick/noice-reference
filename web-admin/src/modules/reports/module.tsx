import { BiCamera } from 'react-icons/bi';

import { VideoReport } from './VideoReport/VideoReport';

import { Module } from '@common/module';

export const reportModule: Module = {
  isExcludedFromNavigation: true,
  id: 'reports',
  title: 'Reports',
  pages: [
    {
      id: 'video',
      title: 'Video reports',
      icon: BiCamera,
      description: 'Reported videos',
      component: <VideoReport />,
    },
  ],
};
