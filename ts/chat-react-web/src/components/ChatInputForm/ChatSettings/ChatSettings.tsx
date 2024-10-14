import { CoreAssets } from '@noice-com/assets-core';
import {
  IconButton,
  PopoverMenu,
  Switch,
  useAnalytics,
  useAuthenticatedUser,
  usePopoverMenu,
} from '@noice-com/common-ui';

import { ChatColorSettings } from './ChatColorSettings/ChatColorSettings';
import { ChatFontSizeSettings } from './ChatFontSizeSettings/ChatFontSizeSettings';
import styles from './ChatSettings.module.css';

import { useChatSettings } from '@chat-common/settings';
import { useChatContext } from '@chat-context';
import { ChannelChannelRole } from '@chat-gen';

interface Props {
  className: string;
}

export function ChatSettings({ className }: Props) {
  const { hasRole } = useAuthenticatedUser();
  const { showModerationTools, setShowModerationTools, avatarType, setAvatarType } =
    useChatSettings();
  const { userChannelRoles } = useChatContext();
  const { trackButtonClickEventOnMouseClick } = useAnalytics();

  const store = usePopoverMenu({
    placement: 'top-start',
  });
  const { toggle } = store.actions;

  const isUserNoiceStaff = hasRole('admin') || hasRole('px_agent');

  const hasUserPermissionToModerateChat =
    isUserNoiceStaff ||
    userChannelRoles.some((role) =>
      [
        ChannelChannelRole.ChannelRoleModerator,
        ChannelChannelRole.ChannelRoleStreamer,
      ].includes(role),
    );

  return (
    <div className={className}>
      <IconButton
        icon={CoreAssets.Icons.Settings}
        label="Chat settings"
        ref={store.state.popoverMenuTriggerRef}
        size="sm"
        variant="ghost"
        onClick={(event) => {
          trackButtonClickEventOnMouseClick(event, 'chat-settings');
          toggle();
        }}
      />

      <PopoverMenu store={store}>
        <PopoverMenu.Section className={styles.popoverHeaderWrapper}>
          <span className={styles.popoverTitle}>Chat Settings</span>

          <IconButton
            icon={CoreAssets.Icons.Close}
            label="Close chat settings"
            size="xs"
            variant="ghost"
            onClick={toggle}
          />
        </PopoverMenu.Section>

        {hasUserPermissionToModerateChat && (
          <>
            <PopoverMenu.Section>
              <div className={styles.popoverToggleWrapper}>
                <Switch
                  defaultChecked={showModerationTools}
                  direction="rtl"
                  label="Show moderation tools"
                  onChange={(event) => setShowModerationTools(event.target.checked)}
                />
              </div>
            </PopoverMenu.Section>

            <PopoverMenu.Divider />
          </>
        )}

        <PopoverMenu.Section>
          <ChatColorSettings />
          <PopoverMenu.Divider />
        </PopoverMenu.Section>

        <PopoverMenu.Section>
          <ChatFontSizeSettings />
        </PopoverMenu.Section>

        <PopoverMenu.Section>
          <div className={styles.popoverToggleWrapper}>
            <Switch
              defaultChecked={avatarType === 'visible'}
              direction="rtl"
              label="Show profile pictures"
              onChange={(event) =>
                setAvatarType(event.target.checked ? 'visible' : 'hidden')
              }
            />
          </div>
        </PopoverMenu.Section>
      </PopoverMenu>
    </div>
  );
}
