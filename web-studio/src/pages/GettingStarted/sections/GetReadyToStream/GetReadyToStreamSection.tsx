import {
  Anchor,
  ButtonLink,
  NoiceSocialMediaLinks,
  useAnalytics,
} from '@noice-com/common-ui';
import { useParams } from 'react-router';

import { OnboardingStepProps } from '../../types';

import styles from './GetReadyToStreamSection.module.css';

import { useChannelContext } from '@common/channel';
import { Routes } from '@common/route';
import { EditStreamKey } from '@common/settings';

export const GetReadyToStreamSection = ({
  onCompleted,
  section: sectionProp,
}: OnboardingStepProps) => {
  const section = `${sectionProp}-get-ready-to-stream`;
  const { channelName } = useParams();
  const { channelId } = useChannelContext();
  const { trackAnchorClick } = useAnalytics();

  return (
    <>
      <div className={styles.block}>
        <div>Nearly there!</div>
        <div>
          If you are exclusively streaming to Noice, set your streaming service in OBS to
          Noice RTMP in{' '}
          <span className={styles.muted}>
            Settings &gt; Stream &gt; Service &gt; Noice RTMP
          </span>{' '}
          and enter your stream key.
        </div>
      </div>
      <EditStreamKey
        channelId={channelId}
        hideNewStreamKeyGenerationButton
      />
      <div>
        If you are simulcasting (streaming to multiple platforms), check our guide{' '}
        <Anchor
          href="https://support.noice.com/hc/en-us/articles/21097858829981-How-to-Simulcast"
          showExternalLinkIcon
          onClick={(e) => {
            trackAnchorClick(e, section);
          }}
        >
          here
        </Anchor>
        .
      </div>
      <div className={styles.block}>
        <div>Here are some tips to help you with your first stream:</div>
        <ul className={styles.list}>
          <li>
            By default your channel is &lsquo;unlisted&lsquo; - only accessible with the
            direct channel link
          </li>
          <li>Test your stream and review it in Stream Manager</li>
          <li>
            Once you are happy with your setup, you can change your channel visibility at
            any time (also while being live) and set a title for your stream in{' '}
            <Anchor
              href={`/${channelName}${Routes.SettingsStream}`}
              onClick={(e) => {
                trackAnchorClick(e, section);
              }}
            >
              Stream Settings
            </Anchor>
          </li>
          <li>
            You can personalize your channel in{' '}
            <Anchor
              href={`/${channelName}${Routes.SettingsChannelDetails}`}
              onClick={(e) => {
                trackAnchorClick(e, section);
              }}
            >
              Channel Settings
            </Anchor>
          </li>
        </ul>
        <div>You’re all set and ready to stream on Noice!</div>
        <div className={styles.footer}>
          <ButtonLink
            fit="content"
            size="sm"
            to={`/${channelName}${Routes.StreamManager}`}
            variant="cta"
            onClick={(e) => {
              trackAnchorClick(e, section);
              onCompleted();
            }}
          >
            Take me to stream manager
          </ButtonLink>
          <ButtonLink
            fit="content"
            level="secondary"
            size="sm"
            to={NoiceSocialMediaLinks.Discord}
          >
            Contact support
          </ButtonLink>
        </div>
      </div>
    </>
  );
};
