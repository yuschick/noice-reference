import { StyleSheet } from 'react-native';

import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';

export const AgeRestrictedView = () => {
  return (
    <PageLayout
      container="view"
      style={s.container}
      withHeader={false}
    >
      <Typography
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        uppercase
      >
        Age restricted
      </Typography>
      <Gutter height={16} />
      <Typography
        color="textSecondary"
        textAlign="center"
      >
        Our age policy doesn’t allow you to sign-up
      </Typography>
    </PageLayout>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
