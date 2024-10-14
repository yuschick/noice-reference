import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import { TermsVersion } from '@noice-com/schemas/auth/auth.pb';
import { ClientToS } from '@noice-com/utils';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonLarge } from '@components/ButtonLarge';
import { CheckBox } from '@components/CheckBox';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { links } from '@constants/links';
import { colors, typography } from '@constants/styles';
import { useAcceptTermsViewQuery, useSignTermsAgreementMutation } from '@gen/graphql';
import { useAuth } from '@hooks/useAuth.hook';
import { AuthenticatedNavigationHookProps } from '@navigators/routes';
import { openURL } from '@utils/open-url';

gql`
  query AcceptTermsView($userId: ID!) {
    profile(userId: $userId) {
      userId
      userTag
    }
  }
  mutation SignTermsAgreement($agreement: AuthTermsVersionInput!) {
    signAgreements(agreements: [$agreement]) {
      emptyTypeWorkaround
    }
  }
`;

export const AcceptTermsView = () => {
  const navigation = useNavigation<AuthenticatedNavigationHookProps>();
  const insets = useSafeAreaInsets();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { userId } = useAuth();

  const { data, loading } = useAcceptTermsViewQuery({
    ...variablesOrSkip({ userId }),
  });
  const [mutateSignAgreement] = useSignTermsAgreementMutation();

  const openTermsOfService = () => {
    openURL(links.termsOfService);
  };

  const openPrivacyPolicy = () => {
    openURL(links.privacyPolicy);
  };

  const openNoiceCommunityGuidelines = () => {
    openURL(links.communityGuidelines);
  };

  const onComplete = useCallback(async () => {
    const signedTerms: TermsVersion = {
      ...ClientToS.currentAgreement,
      signature: data?.profile?.userTag ?? '',
    };

    await mutateSignAgreement({
      variables: {
        agreement: signedTerms,
      },
      update: (cache) => {
        const id = cache.identify({ __typename: 'ProfileProfile', userId: userId });
        cache.evict({
          id,
          fieldName: 'account',
          broadcast: true,
        });
        cache.gc();
      },
    });

    navigation.navigate('home');
  }, [data, mutateSignAgreement, navigation, userId]);

  const footer = (
    <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <ButtonLarge
        analyticsActionName="ACCEPT_TERMS"
        backgroundColor="white"
        disabled={!termsAccepted || loading}
        textColor="darkMain"
        onPress={onComplete}
      >
        Continue
      </ButtonLarge>
      <Gutter height={16} />
      <TouchableOpacity onPress={openPrivacyPolicy}>
        <Typography
          color="textDarkSecondary"
          fontSize="xs"
          lineHeight="md"
          textAlign="center"
        >
          For information about how we collect and use personal information, please see
          our{' '}
          <Typography
            color="tealMain"
            fontSize="xs"
            lineHeight="md"
          >
            Privacy Policy.
          </Typography>
        </Typography>
      </TouchableOpacity>
    </View>
  );

  return (
    <PageLayout
      footer={footer}
      withHeader={false}
    >
      <Gutter height={32} />
      <Typography
        fontSize="lg"
        fontWeight="bold"
        uppercase
      >
        Please review and accept terms
      </Typography>
      <Gutter height={32} />
      {/* Terms of service */}
      <CheckBox
        checked={termsAccepted}
        textStyle={s.termText}
        onToggle={() => setTermsAccepted((prev) => !prev)}
      >
        I have read and agree to the Terms of Service, which include the Noice Community
        Guidelines. {'\n\n'}
        <TouchableOpacity onPress={openTermsOfService}>
          <Typography
            color="tealMain"
            style={s.underline}
          >
            Terms of Service.
          </Typography>
        </TouchableOpacity>
        {'\n\n'}
        <TouchableOpacity onPress={openNoiceCommunityGuidelines}>
          <Typography
            color="tealMain"
            style={s.underline}
          >
            Noice Community Guidelines.
          </Typography>
        </TouchableOpacity>
      </CheckBox>
    </PageLayout>
  );
};

const s = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    backgroundColor: colors.darkMain,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  termText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.md,
  },
});
