import { gql } from '@apollo/client';
import { AnalyticsEventClientSignupStepSignupStep } from '@noice-com/schemas/analytics/analytics.pb';
import { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarSelector } from '@components/AvatarSelector/AvatarSelector';
import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { HStack } from '@components/Stack/HStack';
import { Typography } from '@components/Typography';
import { colors } from '@constants/styles';
import { AvatarSelectorOptionFragment, useAvatarSelectorViewQuery } from '@gen/graphql';
import { useMountEffect } from '@hooks/useMountEffect.hook';
import { useUpdateUserAvatar } from '@hooks/user/useUpdateUserAvatar.hook';
import { Analytics } from '@lib/Analytics';
import { InstrumentationAnalytics } from '@lib/InstrumentationAnalytics';
import { Haptic } from '@utils/haptic';
import { NoiceLogo } from '@utils/icons/registry';

gql`
  query AvatarSelectorView {
    avatars {
      avatars {
        ...AvatarSelectorOption
      }
    }
  }

  ${AvatarSelector.fragments.avatar}
`;

export const AvatarSelectorView = () => {
  const { data } = useAvatarSelectorViewQuery();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarSelectorOptionFragment>();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const { updateUserAvatar } = useUpdateUserAvatar();
  const [errorMessage, setErrorMessage] = useState<string>();

  const avatarOptions = [...(data?.avatars?.avatars ?? [])].reverse();

  const onSelectAvatar = (avatar: AvatarSelectorOptionFragment) => {
    Haptic.impactLight();
    setSelectedAvatar(avatar);
  };

  useMountEffect(() => {
    Analytics.trackEvent({
      clientSignupStep: {
        step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_AVATAR_SELECT,
      },
    });
  });

  const onContinue = async () => {
    try {
      const firstAvatar = avatarOptions[0];
      const avatarId = selectedAvatar?.id ?? firstAvatar.id;
      await updateUserAvatar(avatarId);

      // Note: currently onboarding is complete when user has selected an avatar
      // This will need to be moved incase the process ends up having more steps.
      Analytics.trackEvent({
        clientSignupStep: {
          step: AnalyticsEventClientSignupStepSignupStep.SIGNUP_STEP_COMPLETED,
        },
      });
    } catch {
      setErrorMessage(
        'Failed to update avatar. Please check your internet connection and try again.',
      );
      InstrumentationAnalytics.captureException(
        new Error('[AvatarSelectorView]: Failed to update user avatar.'),
      );
    }
  };

  const footer = (
    <View style={s.footer}>
      <LinearGradient
        colors={[colors.darkMain, `rgba(0, 0, 0, 0)`]}
        end={{ x: 0, y: 0 }}
        start={{ x: 0, y: 0.45 }}
        style={[
          {
            width: window.width,
          },
          s.footerGradient,
        ]}
      />
      <ButtonLarge
        analyticsActionName="AVATAR_SELECT"
        backgroundColor={['green500', 'teal500']}
        textColor="textDark"
        onPress={onContinue}
      >
        Continue
      </ButtonLarge>
      <Gutter height={12} />
      {!errorMessage ? (
        <Typography
          color="textLightSecondary"
          textAlign="center"
        >
          You can customize your avatar later in the avatar editor on desktop browsers.
        </Typography>
      ) : (
        <Typography
          color="redMain"
          fontWeight="medium"
          textAlign="center"
        >
          {errorMessage}
        </Typography>
      )}
      <Gutter height={Math.max(insets.bottom, 16)} />
    </View>
  );

  return (
    <PageLayout
      footer={footer}
      withHeader={false}
    >
      <Gutter height={16} />
      <HStack>
        <NoiceLogo
          height={28}
          width={28}
        />
        <Gutter width={12} />
        <Typography
          fontSize="xl"
          fontWeight="extraBold"
          italic
          uppercase
        >
          Choose avatar
        </Typography>
      </HStack>
      <Gutter height={32} />
      {!!avatarOptions?.length && (
        <AvatarSelector
          avatars={avatarOptions}
          selectedAvatarId={selectedAvatar?.id ?? avatarOptions[0].id}
          onSelect={onSelectAvatar}
        />
      )}
      <Gutter height={160} />
    </PageLayout>
  );
};

const s = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 16,
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
});
