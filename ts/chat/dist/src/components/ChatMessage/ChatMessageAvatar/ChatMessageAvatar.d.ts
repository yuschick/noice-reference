import { ProfileImageProfileFragment } from '@chat-gen';
interface Props {
    profile: ProfileImageProfileFragment;
    isOwnMessage: boolean;
    loadingProfile: boolean;
    className: string;
    miniProfileOpen: boolean;
    onAvatarClick: () => void;
}
export declare function ChatMessageAvatar({ className, isOwnMessage, loadingProfile, miniProfileOpen, onAvatarClick, profile, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
