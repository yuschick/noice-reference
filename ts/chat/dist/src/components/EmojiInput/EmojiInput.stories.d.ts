/// <reference types="react" />
import { EmojiInputProps } from './EmojiInput';
declare const _default: {
    title: string;
    component: import("react").ForwardRefExoticComponent<EmojiInputProps & import("react").RefAttributes<import("./EmojiInput").EmojiInputRef>>;
};
export default _default;
export declare const Default: {
    render: import("@storybook/types").AnnotatedStoryFn<import("@storybook/react/dist/types-0a347bb9").R, EmojiInputProps>;
    args: {
        onChange: import("@storybook/addon-actions").HandlerFunction;
        onEnter: import("@storybook/addon-actions").HandlerFunction;
        placeholder: string;
    };
};
