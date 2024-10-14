import { CoreAssets } from '@noice-com/assets-core';
import { StoryHelpers } from '@noice-com/common-ui';
import {
  ConfigItemAlignment,
  ConfigItemMessageType,
} from '@noice-com/schemas/ftue/ftue.pb';
import { StoryFn } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { FTUEComponent, FTUEComponentProps } from './FTUEComponent';

import ExampleImage from '@assets/images/background-stream.webp';

export default {
  title: 'FTUEComponent',
  component: FTUEComponent,
  argTypes: {
    anchor: StoryHelpers.disableArg(),
    imageContentUrl: StoryHelpers.disableArg(),
    videoContentUrl: StoryHelpers.disableArg(),
    hasImage: { control: 'boolean' },
    hasVideo: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<
  FTUEComponentProps & { hasImage?: boolean; hasVideo?: boolean }
> = (args) => {
  const [anchor, setAnchor] = useState<HTMLElement>();
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorRef.current) {
      setAnchor(anchorRef.current);
    }
  }, []);

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          ref={anchorRef}
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--noi-color-violet-main)',
          }}
        />
      </div>

      {anchor && (
        <FTUEComponent
          {...args}
          anchor={anchor}
          imageContentUrl={args.hasImage ? ExampleImage : undefined}
          videoContentUrl={args.hasVideo ? CoreAssets.Videos.VideoFull : undefined}
        />
      )}
    </>
  );
};

export const Default = {
  render: Template,

  args: {
    title: 'Consectetur quis',
    body: `<paragraph>Sit aute eiusmod eiusmod ad est aute et anim ullamco ullamco minim qui <color="purple">reprehenderit</color>. Et laborum enim cillum pariatur exercitation sunt pariatur. Deserunt laborum nostrud dolore tempor do anim dolore pariatur dolor in sit labore aliquip.</paragraph>
    <paragraph><link="/home">Amet labore est excepteur</link> sit enim cillum ea dolore labore. Nulla nisi commodo aute veniam cupidatat qui. <color="green">Aute culpa labore</color> aute ipsum pariatur voluptate et non id mollit ad tempor incididunt deserunt. Ex deserunt ipsum dolor commodo ullamco et eiusmod excepteur ipsum nulla id est. Eu ea eiusmod ea est occaecat elit nulla ullamco minim.</paragraph>
    <paragraph>In ut ex et pariatur dolor esse pariatur labore non deserunt. Velit sunt esse dolore labore do fugiat amet sunt occaecat sunt laboris qui. Sint nulla dolore incididunt officia elit. In deserunt consequat eu aliqua occaecat. Reprehenderit duis qui laboris excepteur ullamco sint nulla reprehenderit eiusmod sint reprehenderit mollit. Esse id sint ipsum duis esse cillum amet. Minim deserunt aute elit ex proident sint laboris mollit eiusmod fugiat eiusmod.</paragraph>`,
    alignment: ConfigItemAlignment.ALIGNMENT_TOP,
  },
};

export const Link = {
  render: Template,

  args: {
    ...Default.args,
    messageType: ConfigItemMessageType.MESSAGE_TYPE_LINK,
    link: 'https://noice.com/',
    buttonText: 'Go to some page!',
  },
};
