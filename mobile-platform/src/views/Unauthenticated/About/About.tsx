import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { IconAssets } from '@utils/icons';

export const About = () => {
  const navigation = useNavigation();

  const closeModal = () => {
    navigation.goBack();
  };

  return (
    <PageLayout
      headerLeft={
        <TouchableOpacity onPress={closeModal}>
          <IconAssets.Close
            color="white"
            height={24}
            width={24}
          />
        </TouchableOpacity>
      }
    >
      <Gutter height={24} />
      <Typography
        fontSize="xxl"
        fontStyle="italic"
        fontWeight="extraBold"
      >
        WELCOME TO NOICE
      </Typography>
      <Gutter height={8} />
      <Typography lineHeight="xl">
        To join the waiting list, simply sign up on our Noice website on a desktop Google
        Chrome, Microsoft Edge, Opera and Brave to create an account.
      </Typography>
      <Gutter height={24} />
      <Typography lineHeight="xl">
        By participating, you&lsquo;ll be among the first to experience the streaming
        platform and help us shape its future.
      </Typography>
      <Gutter height={24} />
      <Typography lineHeight="xl">
        Your feedback and patience are invaluable as we refine the experience. So please
        share your thoughts, suggestions, and report any issues you come across.
        Let&lsquo;s make this journey together.
      </Typography>
    </PageLayout>
  );
};
