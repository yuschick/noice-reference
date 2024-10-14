import { gql } from '@apollo/client';
import { Nullable, StringUtils } from '@noice-com/utils';
import { useMemo } from 'react';
import { generatePath, useParams } from 'react-router';

import { Routes } from '@common/route';
import { WidgetId } from '@common/widget';
import { PopoutContext, encodeContext } from '@common/widget-popout';
import { ExternalPopoutProfileFragment } from '@gen';

gql`
  fragment ExternalPopoutProfile on ProfileProfile {
    userId
    account {
      email
    }
  }
`;

interface Props {
  widgetId: WidgetId;
  profile: Nullable<ExternalPopoutProfileFragment>;
}

export function useExternalPopoutUrl({ widgetId, profile }: Props): URL {
  const { channelName } = useParams();

  const url = useMemo(() => {
    const popoutContext: PopoutContext = { email: profile?.account?.email };
    const context = encodeContext(popoutContext) || '';
    const params = new URLSearchParams({ context });

    const url = window.location.origin;

    return new URL(
      `${url}${generatePath(Routes.Popout, {
        channelName: channelName ?? '',
      })}/${StringUtils.stringToKebabCase(widgetId)}?${params}`,
    );
  }, [channelName, profile?.account?.email, widgetId]);

  return url;
}
