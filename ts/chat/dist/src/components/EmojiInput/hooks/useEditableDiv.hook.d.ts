import { ClipboardEvent, KeyboardEvent, MutableRefObject, RefObject } from 'react';
interface Props {
    onChange: (message: string) => void;
    onEnter: (evt: KeyboardEvent<HTMLDivElement>) => void;
    allowOutsideEnter?: boolean;
    disallowDroppedContent?: boolean;
    disabled: boolean;
}
interface HookResult {
    handleInput: () => void;
    handlePaste: (event: ClipboardEvent<HTMLDivElement>) => void;
    handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
    updateMessage: () => void;
    addText: (text: string) => void;
    showPlaceholder: boolean;
    inputRef: RefObject<HTMLDivElement>;
    messageLength: MutableRefObject<number>;
    messageRef: MutableRefObject<string>;
}
export declare const INPUT_MAX_LENGTH = 225;
export declare function useEditableDiv({ onChange, onEnter, allowOutsideEnter, disallowDroppedContent, disabled, }: Props): HookResult;
export {};
