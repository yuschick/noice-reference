import { useAuthFlowState } from '../hooks/useAuthFlowState.hook';

import { ButtonLarge } from '@components/ButtonLarge';
import { Gutter } from '@components/Gutter';
import { PageLayout } from '@components/PageLayout';
import { Typography } from '@components/Typography';
import { UnAuthenticatedScreenProps } from '@navigators/routes';
import { IconAssets } from '@utils/icons';

export const ConnectAccountView = ({
  navigation,
  route,
}: UnAuthenticatedScreenProps<'connect-account'>) => {
  const { email } = route.params;
  const { setPendingSignInData, setConnectSSOProviderOnSignIn } = useAuthFlowState();

  const loginWithEmail = () => {
    setPendingSignInData({
      email,
    });

    navigation.navigate('verify-captcha', { nextRoute: 'verify-email' });
  };

  const connectDiscordAccount = () => {
    setConnectSSOProviderOnSignIn('discord');
    loginWithEmail();
  };

  return (
    <PageLayout>
      <Gutter height={24} />
      <Typography
        fontSize="xl"
        fontWeight="bold"
        italic
      >
        Account Exists
      </Typography>
      <Gutter height={12} />
      <Typography color="textSecondary">
        Account already exists with this email
      </Typography>
      <Typography
        color="textSecondary"
        fontWeight="semiBold"
      >
        {email}
      </Typography>
      <Gutter height={24} />
      <ButtonLarge
        analyticsActionName="CONNECT_DISCORD"
        iconElement={
          <IconAssets.Discord
            color="white"
            height={24}
            width={24}
          />
        }
        onPress={connectDiscordAccount}
      >
        Connect Discord
      </ButtonLarge>
      <Gutter height={8} />
      <ButtonLarge onPress={loginWithEmail}>Login with Email</ButtonLarge>
    </PageLayout>
  );
};
