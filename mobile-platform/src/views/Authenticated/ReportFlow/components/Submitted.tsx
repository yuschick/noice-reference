import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { Typography } from '@components/Typography';

export const Submitted = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Typography
        fontSize="xxl"
        fontWeight="extraBold"
        uppercase
      >
        Thank you
      </Typography>
      <Gutter height={24} />
      <Typography lineHeight="lg">
        We’ve received your report and it is now being reviewed.
      </Typography>
      <Gutter height={24} />
      <Typography
        fontSize="lg"
        fontWeight="bold"
      >
        What happens next?
      </Typography>
      <Gutter height={8} />
      <Typography lineHeight="xl">
        We will look through your report, which may include human review, and take action
        as appropriate. Once it is processed, we will let you know whether or not we found
        the behavior you reported to be against our guidelines.
      </Typography>
      <Gutter height={24} />
      <ButtonLarge
        backgroundColor="whiteMain"
        textColor="textDark"
        onPress={() => navigation.goBack()}
      >
        Close
      </ButtonLarge>
    </View>
  );
};
