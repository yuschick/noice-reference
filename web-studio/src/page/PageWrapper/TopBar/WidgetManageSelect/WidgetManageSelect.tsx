import { CoreAssets } from '@noice-com/assets-core';
import { Button, usePopoverMenu, PopoverMenu } from '@noice-com/common-ui';
import toast from 'react-hot-toast';
import { BiBroadcast, BiShield } from 'react-icons/bi';

import styles from './WidgetManageSelect.module.css';

import { useChannelContext } from '@common/channel';
import { ChannelRole } from '@common/profile';
import { useWidgetLayout } from '@common/widget';

interface Props {
  onWidgetManagementSelect(): void;
}

interface OptionButton {
  type: 'button';
  icon: SvgrComponent;
  label: string;
  value: string;
}

interface OptionDivider {
  type: 'divider';
}

type OptionElement = OptionButton | OptionDivider;

const baseOptions: OptionElement[] = [
  {
    type: 'button',
    icon: CoreAssets.Icons.DuplicatePlus,
    label: 'Select widgets',
    value: 'select',
  },
];

const adminOptions: OptionElement[] = [
  {
    type: 'button',
    icon: BiBroadcast,
    label: 'Creator layout',
    value: 'creator',
  },
  {
    type: 'button',
    icon: BiShield,
    label: 'Moderator layout',
    value: 'moderator',
  },
];

const nonAdminOptions: OptionElement[] = [
  {
    type: 'button',
    icon: CoreAssets.Icons.ClearBox,
    label: 'Reset to default',
    value: 'reset',
  },
];

export function WidgetManageSelect({ onWidgetManagementSelect }: Props) {
  const popoverMenu = usePopoverMenu({ placement: 'bottom-start' });
  const { userChannelRoles } = useChannelContext();
  const { resetToDefault, setToStreamerLayout, setToModeratorLayout } = useWidgetLayout();

  const onSelectWidgetAction = (value: OptionButton['value']) => {
    const action = value;

    switch (action) {
      case 'reset':
        resetToDefault();
        toast.success('Widget layout reset!');
        return;
      case 'creator':
        setToStreamerLayout();
        toast.success('Widget layout reset to creator layout!');
        return;
      case 'moderator':
        setToModeratorLayout();
        toast.success('Widget layout reset to moderator layout!');
        return;
      case 'select':
        onWidgetManagementSelect();
    }
  };

  const options: OptionElement[] = [
    ...baseOptions,
    {
      type: 'divider',
    },
    ...(userChannelRoles.includes(ChannelRole.Admin) ? adminOptions : nonAdminOptions),
  ];

  return (
    <div className={styles.wrapper}>
      <Button
        level="secondary"
        ref={popoverMenu.state.popoverMenuTriggerRef}
        size="xs"
        onClick={popoverMenu.actions.toggle}
      >
        Edit Widgets
      </Button>

      <PopoverMenu store={popoverMenu}>
        <PopoverMenu.Section>
          {options.map((element, index) => {
            if (element.type === 'divider') {
              return <PopoverMenu.Divider key={`divider-${index}`} />;
            }

            if (element.type === 'button') {
              return (
                <PopoverMenu.Button
                  iconStart={element.icon}
                  key={element.value}
                  onClick={() => onSelectWidgetAction(element.value)}
                >
                  {element.label}
                </PopoverMenu.Button>
              );
            }
          })}
        </PopoverMenu.Section>
      </PopoverMenu>
    </div>
  );
}
