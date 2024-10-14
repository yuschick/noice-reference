import { Carousel } from './Carousel';

const MockCarousel = () => {
  return (
    <div style={{ width: '50vw' }}>
      <Carousel
        displayCount={3}
        slidesCount={6}
        title="Storybook carousel"
      >
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <Carousel.Slide
            index={i}
            key={i}
            style={{
              height: 120,
              background: 'blue',
              width: '100%',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              }}
            >
              Slide {i + 1}
            </div>
          </Carousel.Slide>
        ))}
      </Carousel>
    </div>
  );
};

export default {
  title: 'Carousel',
  component: MockCarousel,
  argTypes: {},
};

export const Default = {
  args: {},
};
