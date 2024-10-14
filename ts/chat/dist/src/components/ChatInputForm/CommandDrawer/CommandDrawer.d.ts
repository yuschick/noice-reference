import { ChatDrawerProps } from '../../ChatDrawer';
import { EmoteAvatarAnimationFragment } from '@chat-gen';
type CommandDrawerProps = Exclude<ChatDrawerProps, 'onOutsideClick'> & {
    commands: EmoteAvatarAnimationFragment[];
    activeCommand?: EmoteAvatarAnimationFragment['id'];
    onMouseEnter(id: string): void;
    onCommandClick(id: string): void;
};
export declare function CommandDrawer({ className, commands, onCommandClick, onMouseEnter, activeCommand, showDrawer, }: CommandDrawerProps): import("react/jsx-runtime").JSX.Element;
export {};
