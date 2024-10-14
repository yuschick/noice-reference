import { LayoutBox } from './LayoutBox';

export default {
  title: 'Layout/LayoutBox',
  component: LayoutBox,
};

export const Default = {
  args: {
    children: 'Some content here',
  },
};

export const MoreContent = {
  args: {
    children: (
      <>
        <div>first set of content</div>
        <div>second set of content</div>
      </>
    ),
  },
};
