import { ChannelLogo } from '@noice-com/common-ui';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './ChannelLogoLink.module.css';

import { AppSoundKeys, usePlaySound } from '@common/sound';

interface Props extends React.ComponentProps<typeof ChannelLogo> {
  className?: string;
  title?: string;
}

export function ChannelLogoLink({ className, title, ...props }: Props) {
  const [playStreamLinkHoverSound] = usePlaySound(AppSoundKeys.GenericHover);
  const channelPageUrl = `/${props.channel.name.toLowerCase()}`;

  const onMouseEnter = () => {
    playStreamLinkHoverSound();
  };

  return (
    <Link
      aria-hidden={props['aria-hidden']}
      className={classNames(styles.link, className)}
      tabIndex={props.tabIndex}
      title={title}
      to={channelPageUrl}
      onMouseEnter={onMouseEnter}
    >
      <ChannelLogo {...props} />
    </Link>
  );
}
