import { CoreAssets } from '@noice-com/assets-core';
import {
  Breakpoint,
  CommonUtils,
  FTUEActionType,
  IconButton,
  useAuthentication,
  useDialog,
  useMediaQuery,
  useTriggerFTUEAction,
} from '@noice-com/common-ui';
import { Nullable } from '@noice-com/utils';
import classNames from 'classnames';
import { AriaAttributes, useState } from 'react';
import { BiSearch } from 'react-icons/bi';

import { CreateChannelFormDialog } from './CreateChannelFormDialog';
import styles from './PageLayoutHeader.module.css';

import { ImplicitAccountSignupButtons } from '@common/implicit-account';
import { PopNotifications } from '@common/notification';
import { SearchInput } from '@common/search';
import { UserWalletDisplay } from '@common/wallet';
import { PageLayoutHeaderProfileFragment } from '@gen';
import { MenuButtons } from '@page/PageLayout/PageLayoutHeader/MenuButtons';
import { NoiceLogoLink } from '@page/PageLayout/PageLayoutHeader/NoiceLogoLink';
import { ProfileMenu } from '@page/PageLayout/PageLayoutHeader/ProfileMenu';
import { TimedAds } from '@page/PageLayout/PageLayoutHeader/TimedAds';

interface Props {
  profile: Nullable<PageLayoutHeaderProfileFragment>;
  navigationExpandButtonAriaAttributes: AriaAttributes;
  socialExpandButtonAriaAttributes: AriaAttributes;
  contentTheme?: 'gray';
  onExpandedSidebar(sidebar: 'navigation' | 'social'): void;
}

export const PageLayoutHeaderContent = ({
  profile,
  navigationExpandButtonAriaAttributes,
  onExpandedSidebar,
  socialExpandButtonAriaAttributes,
  contentTheme,
}: Props) => {
  const [showFullWidthSearchInput, setShowFullWidthSearchInput] = useState(false);
  const bigScreen = useMediaQuery(`(min-width: ${CommonUtils.getRem(800)})`);
  const triggerFTUEAction = useTriggerFTUEAction();
  const { isFullAccount } = useAuthentication();

  const onSocialExpandClick = () => {
    triggerFTUEAction(FTUEActionType.SidebarFriends);
    onExpandedSidebar('social');
  };

  const createChannelDialogStore = useDialog({
    title: 'Become a creator',
  });

  return (
    <>
      {showFullWidthSearchInput && (
        <div className={styles.searchPanel}>
          <IconButton
            icon={CoreAssets.Icons.ArrowLeft}
            label="Hide search input"
            level="secondary"
            size="sm"
            theme="light"
            variant="ghost"
            onClick={() => setShowFullWidthSearchInput(false)}
          />
          {/* eslint-disable jsx-a11y/no-autofocus */}
          <SearchInput
            theme="gray"
            autoFocus
            onSearchSubmit={() => setShowFullWidthSearchInput(false)}
          />
          {/* eslint-enable jsx-a11y/no-autofocus */}
        </div>
      )}
      <div
        className={classNames(styles.headerContent, {
          [styles.hide]: showFullWidthSearchInput,
        })}
      >
        <section className={styles.container}>
          <IconButton
            {...navigationExpandButtonAriaAttributes}
            icon={CoreAssets.Icons.Hamburger}
            label="Expand"
            level="secondary"
            shape="sharp"
            size="lg"
            onClick={() => onExpandedSidebar('navigation')}
          />

          <div className={styles.searchInputContainer}>
            <NoiceLogoLink />
            {!bigScreen ? (
              <IconButton
                icon={BiSearch}
                label="Channel search"
                level="secondary"
                size="sm"
                theme="light"
                variant="ghost"
                onClick={() => {
                  setShowFullWidthSearchInput(true);
                }}
              />
            ) : (
              <SearchInput theme={contentTheme} />
            )}
          </div>
        </section>

        <section className={styles.container}>
          <section className={styles.menusWrapper}>
            {isFullAccount && <TimedAds />}

            <Breakpoint query={`(min-width: ${CommonUtils.getRem(1100)})`}>
              <UserWalletDisplay />
            </Breakpoint>

            <Breakpoint query={`(min-width: ${CommonUtils.getRem(390)})`}>
              <MenuButtons profile={profile} />
            </Breakpoint>

            {!isFullAccount && (
              <Breakpoint query={`(min-width: ${CommonUtils.getRem(600)})`}>
                <ImplicitAccountSignupButtons section="page-header" />
              </Breakpoint>
            )}

            <ProfileMenu
              createChannelDialogStore={createChannelDialogStore}
              profile={profile}
            />
          </section>

          {isFullAccount ? (
            <IconButton
              {...socialExpandButtonAriaAttributes}
              data-ftue-anchor="friend-list-button"
              icon={CoreAssets.Icons.Friends}
              label="Expand"
              level="secondary"
              shape="sharp"
              size="lg"
              onClick={onSocialExpandClick}
            />
          ) : (
            <>
              {/* this is for the grid */}
              <div />
            </>
          )}
        </section>

        <PopNotifications />

        <CreateChannelFormDialog dialogStore={createChannelDialogStore} />
      </div>
    </>
  );
};
