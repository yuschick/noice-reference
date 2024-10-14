import { StoryFn } from '@storybook/react';

import { Breadcrumbs, BreadcrumbsProps } from './Breadcrumbs';
import { BreadcrumbsItem } from './BreadcrumbsItem';

export default {
  component: Breadcrumbs,
};

const Template: StoryFn<BreadcrumbsProps> = (args) => (
  <Breadcrumbs {...args}>
    <BreadcrumbsItem
      isCurrentPage={false}
      to="#"
    >
      Page 1
    </BreadcrumbsItem>
    <BreadcrumbsItem
      isCurrentPage={false}
      to="#"
    >
      Page 2
    </BreadcrumbsItem>
    <BreadcrumbsItem isCurrentPage>Current Page</BreadcrumbsItem>
  </Breadcrumbs>
);

export const Default = {
  render: Template,
  args: {},
};

export const Loading = {
  render: Template,

  args: {
    isLoading: true,
  },
};
