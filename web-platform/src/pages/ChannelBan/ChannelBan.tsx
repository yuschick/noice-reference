import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  Button,
  CommonUtils,
  ButtonLink,
  NoiceLogo,
  ChannelLogo,
} from '@noice-com/common-ui';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { generatePath, useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { NotFound } from '../NotFound/NotFound';

import styles from './ChannelBan.module.css';
import { ChannelBanAppealForm } from './ChannelBanAppealForm/ChannelBanAppealForm';

import { Routes } from '@common/route';
import { useChannelBanQuery } from '@gen';

gql`
  query ChannelBan($channelId: ID!) {
    channel(id: $channelId) {
      ...ChannelLogoChannel
      name
      userBanStatus {
        banned
        violation
        description
        appeal {
          status
          ...ChannelBanFormBanAppealInfo
        }
      }
    }

    channelModerationSettings(channelId: $channelId) {
      channelId
      banAppealsEnabled
    }
  }

  ${ChannelBanAppealForm.fragments.entry}
  ${ChannelLogo.fragments.entry}
`;

export function ChannelBan() {
  const [formIsOpen, setFormIsOpen] = useState(false);

  const navigate = useNavigate();
  const { channelId } = useParams();

  const { data } = useChannelBanQuery({
    ...variablesOrSkip({ channelId }),
  });

  const showAppealForm = data?.channelModerationSettings?.banAppealsEnabled;

  useEffect(() => {
    // There is not yet data
    if (!data) {
      return;
    }

    // There is no channel for the channel id, so navigate to home
    if (!data.channel) {
      navigate(Routes.Home, { replace: true });
      return;
    }

    // User is not banned from this channel, so redirect to channel page
    if (!data.channel.userBanStatus.banned) {
      navigate(generatePath(Routes.Channel, { channelName: data.channel.name }), {
        replace: true,
      });
    }
  }, [data, navigate]);

  const title = 'You are banned from this channel';

  const onDismiss = useCallback(() => {
    navigate(Routes.Home);
  }, [navigate]);

  if (!channelId) {
    return <NotFound />;
  }

  return (
    <DialogOverlay
      isOpen
      onDismiss={onDismiss}
    >
      <DialogContent
        aria-label={title}
        className={styles.banWrapper}
      >
        <Helmet>
          <title>{title}</title>
        </Helmet>

        <header className={styles.banHeader}>
          <Link
            aria-label="Return to home"
            to={Routes.Home}
          >
            <NoiceLogo
              className={styles.banNoiceLogo}
              theme="light"
              variant="horizontal"
            />
          </Link>

          <ButtonLink to={Routes.Home}>Return to home</ButtonLink>
        </header>
        <main className={styles.banMainWrapper}>
          <h1 className={styles.banHeading}>{title}</h1>
          <p className={styles.banDescription}>
            You are unable to view this channel until a moderator unbans you.
          </p>
          <section className={classNames(styles.banSectionWrapper, styles.horizontal)}>
            <div
              className={classNames(
                styles.banSectionContentWrapper,
                styles.banSectionHighlight,
              )}
            >
              {data?.channel && <ChannelLogo channel={data.channel} />}
            </div>
            <div className={styles.banSectionInnerWrapper}>
              <div>
                <span className={styles.banSectionHeading}>Channel Name</span>
                <div
                  className={styles.banSectionValue}
                  translate="no"
                >
                  {data?.channel?.name}
                </div>
              </div>
            </div>
          </section>

          <section className={classNames(styles.banSectionWrapper, styles.vertical)}>
            <div
              className={classNames(
                styles.banSectionContentWrapper,
                styles.banSectionHighlight,
              )}
            >
              Reason for ban
            </div>

            <div className={styles.banSectionContentWrapper}>
              {!!data?.channel?.userBanStatus?.violation && (
                <span className={styles.banSectionHeading}>
                  {CommonUtils.getChannelViolationText(
                    data.channel.userBanStatus.violation,
                  )}
                </span>
              )}
              {!!data?.channel?.userBanStatus?.description && (
                <div>
                  <span className={styles.banSectionHeading}>Moderator note</span>
                  <div className={styles.banSectionValue}>
                    {data.channel.userBanStatus.description}
                  </div>
                </div>
              )}
            </div>
          </section>

          {showAppealForm && (
            <>
              {!formIsOpen && !data?.channel?.userBanStatus.appeal ? (
                <Button
                  onClick={() => {
                    setFormIsOpen(true);
                  }}
                >
                  Request Unban
                </Button>
              ) : (
                <div className={styles.banAppealWrapper}>
                  <h2 className={styles.banAppealHeading}>Why should you be unbanned?</h2>
                  <div>
                    <ChannelBanAppealForm
                      appeal={data?.channel?.userBanStatus.appeal || null}
                      channelId={channelId}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </DialogContent>
    </DialogOverlay>
  );
}
