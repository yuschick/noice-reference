import { WithChildren } from '@noice-com/common-ui';
import { RefObject } from 'react';
export interface ChatDrawerProps {
    showDrawer: boolean;
    className?: string;
    onOutsideClick?: () => void;
    outsideClickExemptions?: RefObject<HTMLElement>[];
}
type Props = WithChildren<ChatDrawerProps>;
export declare function ChatDrawer({ children, className, onOutsideClick, outsideClickExemptions, showDrawer, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
