export interface Props {
    emoji: string;
    source: string;
    className?: string;
    /** @todo: if we stay with the title attribute solution, check do we really need to disable it ever */
    disableTooltip?: boolean;
}
export declare function ChatEmoji({ emoji, source, disableTooltip, className }: Props): import("react/jsx-runtime").JSX.Element;
