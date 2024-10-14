import { CoreAssets } from '@noice-com/assets-core';
import { IconButton, PopoverMenu, usePopoverMenu } from '@noice-com/common-ui';

import { WidgetMenuOption } from '@common/widget';

type WidgetMenuProps = {
  options?: WidgetMenuOption[];
  onPopOut: () => void;
  onShowPopOutUrl: () => void;
  onRemove: () => void;
};

export function WidgetMenu({
  options,
  onPopOut,
  onShowPopOutUrl,
  onRemove,
}: WidgetMenuProps) {
  const popover = usePopoverMenu({ placement: 'bottom-end' });
  const { toggle } = popover.actions;

  const commonOptions: WidgetMenuOption[] = [
    {
      icon: CoreAssets.Icons.LinkExternal,
      text: 'Pop out',
      onClick: onPopOut,
    },
    {
      icon: CoreAssets.Icons.Link,
      text: 'Copy link',
      onClick: onShowPopOutUrl,
    },
    {
      icon: CoreAssets.Icons.Clear,
      text: 'Remove widget',
      onClick: onRemove,
    },
  ];

  if (!options?.length && !commonOptions.length) {
    return null;
  }

  return (
    <>
      <IconButton
        icon={CoreAssets.Icons.Menu}
        label="Toggle widget menu"
        ref={popover.state.popoverMenuTriggerRef}
        size="xs"
        variant="ghost"
        onClick={toggle}
      />

      <PopoverMenu store={popover}>
        {!!options?.length && (
          <>
            <PopoverMenu.Section>
              {options.map(({ text, icon, onClick }, index) => (
                <PopoverMenu.Button
                  iconStart={icon}
                  key={index}
                  onClick={onClick}
                >
                  {text}
                </PopoverMenu.Button>
              ))}
            </PopoverMenu.Section>
            <PopoverMenu.Divider />
          </>
        )}

        <PopoverMenu.Section>
          {commonOptions.map(({ text, icon, onClick }, index) => (
            <PopoverMenu.Button
              iconStart={icon}
              key={index}
              onClick={onClick}
            >
              {text}
            </PopoverMenu.Button>
          ))}
        </PopoverMenu.Section>
      </PopoverMenu>
    </>
  );
}
