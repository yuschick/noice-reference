import { gql } from '@apollo/client';
import { variablesOrSkip } from '@noice-com/apollo-client-utils';
import {
  CommonUtils,
  LoadingSkeleton,
  ProfileImage,
  VisuallyHidden,
  useAuthenticatedUser,
} from '@noice-com/common-ui';
import { UserBadge } from '@noice-com/social';
import { sortBadges } from '@noice-com/social-react-core';
import { CSSProperties } from 'react';

import styles from './ChatColorSettings.module.css';

import { useChatSettings } from '@chat-common/settings';
import {
  ProfileColor,
  useChatSettingsProfileQuery,
  useUpdateChatSettingsProfileMutation,
} from '@chat-gen';

gql`
  mutation UpdateChatSettingsProfile($userId: ID, $preferredColor: ProfileColor!) {
    updateProfile(body: { preferredColor: $preferredColor, userId: $userId }) {
      userId
      preferredColor
    }
  }

  query ChatSettingsProfile($channelId: ID!, $userId: ID!) {
    profile(userId: $userId) {
      avatars {
        avatar2D
      }
      badges(channel_id: $channelId) {
        level
        type
      }
      userId
      preferredColor
      userTag
    }
  }
`;

const hexToColorMap: Record<string, ProfileColor> = {
  '#F69856': ProfileColor.ColorF69856,
  '#F6CE56': ProfileColor.ColorF6Ce56,
  '#F6F656': ProfileColor.ColorF6F656,
  '#C0F656': ProfileColor.ColorC0F656,
  '#63F655': ProfileColor.Color_63F655,
  '#56F6C0': ProfileColor.Color_56F6C0,
  '#6EC9F7': ProfileColor.Color_6Ec9F7,
  '#8686F9': ProfileColor.Color_8686F9,
  '#B26AFB': ProfileColor.ColorB26Afb,
  '#F76EF7': ProfileColor.ColorF76Ef7,
};

export function ChatColorSettings() {
  const { userId } = useAuthenticatedUser();
  const { avatarType, channelId } = useChatSettings();

  const { data } = useChatSettingsProfileQuery({
    ...variablesOrSkip({ channelId, userId }),
  });

  const [updateProfile] = useUpdateChatSettingsProfileMutation({
    update(cache, { data: updateData }) {
      const profile = updateData?.updateProfile;

      if (!profile) {
        return;
      }

      cache.updateFragment(
        {
          id: cache.identify(profile),
          fragment: gql`
            fragment UpdateChatSettingsProfile on ProfileProfile {
              userId
              preferredColor
            }
          `,
        },
        (existing) => ({ ...existing, preferredColor: profile.preferredColor }),
      );
    },
  });

  const usernameColor = data?.profile
    ? CommonUtils.getUserIdColor({
        preferredColor: data?.profile?.preferredColor,
        userId: data.profile.userId,
      })
    : undefined;

  return (
    <section className={styles.chatColorWrapper}>
      <span className={styles.chatColorTitle}>Chat Color</span>

      <ul className={styles.chatColorsList}>
        {CommonUtils.chatUsernameColors.map((color) => (
          <li key={color.name}>
            <button
              aria-current={usernameColor === color.hex}
              className={styles.colorButton}
              style={
                {
                  '--_color-button-color': color.hex,
                } as CSSProperties
              }
              type="button"
              onClick={() =>
                updateProfile({
                  variables: {
                    preferredColor:
                      hexToColorMap[color.hex] ?? ProfileColor.ColorUnspecified,
                    userId,
                  },
                })
              }
            >
              <div className={styles.colorButtonColorBlock}>
                <VisuallyHidden>{color.name}</VisuallyHidden>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <span className={styles.subTitle}>Preview</span>

      {data?.profile ? (
        <>
          <div
            className={styles.messagePreview}
            style={
              {
                '--_chat-preferred-color': usernameColor,
              } as CSSProperties
            }
          >
            {avatarType === 'visible' && (
              <ProfileImage
                profile={data.profile}
                size="xs"
              />
            )}
            <div className={styles.badgesWrapper}>
              {sortBadges(data.profile.badges).map((badge, index) => (
                <UserBadge
                  badge={badge}
                  badgeSize={20}
                  key={badge.type + index}
                />
              ))}
            </div>
            <span>{data.profile.userTag}</span>
          </div>
        </>
      ) : (
        <LoadingSkeleton
          height={24}
          width={200}
        />
      )}
    </section>
  );
}
