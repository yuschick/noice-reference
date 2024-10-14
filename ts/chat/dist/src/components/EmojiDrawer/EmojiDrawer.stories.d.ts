import { EmojiDrawer, EmojiDrawerProps } from './EmojiDrawer';
declare const _default: {
    title: string;
    component: typeof EmojiDrawer;
};
export default _default;
export declare const Drawer: {
    render: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, EmojiDrawerProps>;
    args: {
        showDrawer: boolean;
        onEmojiClicked: import("@storybook/addon-actions").HandlerFunction;
        onOutsideClick: import("@storybook/addon-actions").HandlerFunction;
    };
};
