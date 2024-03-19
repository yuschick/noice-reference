import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Image } from './Image';
import styles from './Image.stories.module.css';
import {
  imageFit,
  imageLoadingType,
  imagePriority,
  imageQuality,
  Props,
} from './Image.types';

const meta: Meta<typeof Image> = {
  title: 'Image',
  component: Image,
  tags: ['autodocs'],
  args: {},
  argTypes: {
    fallbackSrc: {
      control: { type: 'text' },
      description: 'A fallback image to use if the main image fails to load.',
    },
    fit: {
      control: { type: 'select' },
      description:
        'Define how the image is resized to fit its container. This property maps to the CSS `object-fit` property.',
      options: imageFit,
    },
    loadingType: {
      control: { type: 'select' },
      defaultValue: 'shine',
      description:
        'Define the style of loading, either a silent loading or an animated shine.',
      options: imageLoadingType,
    },
    onError: {
      control: { type: 'function' },
      description: 'A callback function to run if the image fails to load.',
    },
    onLoad: {
      control: { type: 'function' },
      description: 'A callback function to run if the image successfully loads.',
    },
    priority: {
      control: { type: 'select' },
      defaultValue: 'auto',
      description:
        'Where `fetchPriority` is supported, tell the browser how the image loading should be prioritized.',
      options: imagePriority,
    },
    quality: {
      control: { type: 'select' },
      defaultValue: 'high',
      description:
        'When fetching images from the CDN, define the quality to pass to the CDN to optimize the image. This is only used if the `src` is available on the CDN.',
      options: imageQuality,
    },
    waitForSrc: {
      control: { type: 'number' },
      defaultValue: 3000,
      description:
        'Control how long we wait for a `src` before showing the failure state.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A base-level component which supports lazy loading, fallbacks, loading state while awaiting a `src`, event callbacks and multiple `<source>` elements. Size the `Image` with a `height` and `width`, a `className` to be applied to the wrapping `picture` element or a combination of both.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/640/360',
    width: 640,
  },
  parameters: {
    docs: {
      description: {
        story: 'A default image that is sized with the `height` and `width` props.',
      },
    },
  },
};

export const FitCover: Story = {
  args: {
    fit: 'cover',
    height: 200,
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `fit="cover"` to fill the image container while maintaining the aspect ratio.',
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <section style={{ display: 'flex', gap: '1rem' }}>
        <Image
          src="https://picsum.photos/640/360"
          {...args}
        />
        <Image
          src="https://picsum.photos/400/200"
          {...args}
        />
        <Image
          src="https://picsum.photos/100/500"
          {...args}
        />
      </section>
    );
  },
};

export const FitContain: Story = {
  args: {
    fit: 'contain',
    height: 200,
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `fit="contain"` to fit the image within its container while maintaining the aspect ratio.',
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <section style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ backgroundColor: 'var(--noi-color-status-error-main)' }}>
          <Image
            src="https://picsum.photos/640/360"
            {...args}
          />
        </div>
        <div style={{ backgroundColor: 'var(--noi-color-status-error-main)' }}>
          <Image
            src="https://picsum.photos/400/200"
            {...args}
          />
        </div>
        <div style={{ backgroundColor: 'var(--noi-color-status-error-main)' }}>
          <Image
            src="https://picsum.photos/250/500"
            {...args}
          />
        </div>
      </section>
    );
  },
};

function RenderDelayedSrcLoading(props?: Partial<Props>) {
  const [tempSrc, setTempSrc] = useState<string>();

  setTimeout(() => {
    setTempSrc('https://picsum.photos/640/360');
  }, props?.waitForSrc || 3000 - 1000);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '640px' }}>
      <Image
        alt=""
        className={styles.testImage}
        loadingType={props?.loadingType}
        src={tempSrc}
        waitForSrc={props?.waitForSrc}
      />
    </div>
  );
}

export const LoadingBeforeSrc: Story = {
  args: {
    src: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sometimes we do not have the `src` until a query is completed. The `Image` will display a loading state until the `src` is populated and will continue showing the loading state while the `src` loads. In this example, the `src` is left undefined for 10 seconds before being set.<br/><strong>Note:</strong> A `height` and `width` or `className` with these styles defined are required for the loading state to display correctly.',
      },
    },
  },
  render: () => RenderDelayedSrcLoading(),
};

export const FallbackSrc: Story = {
  args: {
    height: 200,
    fallbackSrc: 'https://picsum.photos/200/200',
    src: 'image.jpg',
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the initial `src` fails to load, optionally display a fallback image.',
      },
    },
  },
};

export const WaitForSrc: Story = {
  args: {
    src: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'By default, the `Image` will wait for a `src` value for 3 seconds before showing the failure state. This can be overridden with the `waitForSrc` prop. In this example, the `src` is left undefined for 10 seconds before being set.',
      },
    },
  },
  render: () => RenderDelayedSrcLoading({ waitForSrc: 10000 }),
};

export const LoadingTypeNone: Story = {
  args: {
    loadingType: 'none',
    src: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'By default, the `Image` will show a "shine" loading state. This can be overridden with the `loadingType` prop. In this example, we use the "none" loading state while waiting for the `src`.',
      },
    },
  },
  render: () => RenderDelayedSrcLoading({ loadingType: 'none', waitForSrc: 10000 }),
};

export const Sources: Story = {
  args: {
    src: 'https://picsum.photos/200/200',
    sources: [
      {
        srcSet: 'https://picsum.photos/800/400',
        media: '(min-width: 800px)',
      },
      {
        srcSet: 'https://picsum.photos/700/350',
        media: '(min-width: 700px)',
      },
      {
        srcSet: 'https://picsum.photos/600/300',
        media: '(max-width: 700px)',
      },
    ],
    width: '100%',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Provide multiple sources to support controlled art direction with responsive image sizes and formats. Test this by resizing the browser window.',
      },
    },
  },
  render: ({ ...args }) => {
    return (
      <div style={{ padding: '1rem' }}>
        <Image
          className={styles.mh}
          {...args}
        />
      </div>
    );
  },
};

export const OnError: Story = {
  args: {
    alt: 'Example of a broken image.',
    height: 200,
    src: 'image.jpg',
    /* eslint-disable-next-line */
    onError: () => console.log("Image failed!"),
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the `src` fails to load, trigger the `onError` callback.<br/><strong>Note:</strong> While in the error state, the base `img` has an opacity of 0, ensuring it remains visible to assistive technologies.',
      },
    },
  },
};

export const OnLoad: Story = {
  args: {
    height: 200,
    src: 'https://picsum.photos/200/200',
    /* eslint-disable-next-line */
    onLoad: () => console.log("Image loaded!"),
    width: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Trigger the `onLoad` callback when the image successfully loads.',
      },
    },
  },
};
