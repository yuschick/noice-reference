import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';

export const OpenBetaView = () => {
  return (
    <PageLayout title="Welcome to Noice">
      <Gutter height={16} />
      <Typography lineHeight="xl">
        Get ready to dive into Noice. By participating, you&apos;ll be among the first to
        experience the game and help us shape its future.
      </Typography>
      <Gutter height={32} />
      <Typography
        fontSize="lg"
        fontWeight="bold"
      >
        What is open beta about?
      </Typography>
      <Gutter height={16} />
      <Typography lineHeight="xl">
        You may encounter bugs, incomplete features, and changes as we continue to refine
        and expand the platform.
      </Typography>
      <Gutter height={8} />
      <Typography lineHeight="xl">
        Your feedback and patience are invaluable as we refine the experience. So please
        share your thoughts, suggestions, and report any issues you come across.
        Let&apos;s make this journey together.
      </Typography>
    </PageLayout>
  );
};
