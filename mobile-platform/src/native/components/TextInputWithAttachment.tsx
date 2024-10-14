import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import ReactNative, {
  StyleProp,
  TextStyle,
  UIManager,
  ViewStyle,
  requireNativeComponent,
} from 'react-native';

type ContentSize = {
  width: number;
  height: number;
};

type ContentSizeChangeEvent = {
  nativeEvent: {
    contentSize: ContentSize;
  };
};

interface Props {
  attachmentSources: Record<string, string>;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  placeholderText?: string;
  placeholderTextColor?: string;
  maxCharacterLimit?: number;
  style?: StyleProp<ViewStyle>;
  onTextChange: (text: string) => void;
  onContentSizeChange?: (size: ContentSize) => void;
}

type NativeFunctionName = 'clear' | 'addAttachment' | 'focus' | 'blur';

export type TextInputWithAttachmentsRef = {
  clear: () => void;
  focus: () => void;
  blur: () => void;
  addAttachment: (tag: string) => void;
};

type NativeComponentProps = {
  onContentSizeChange?: (size: ContentSizeChangeEvent) => void;
  onTextChange: (text: { nativeEvent: { text: string } }) => void;
  style?: StyleProp<TextStyle>;
};

const NATIVE_COMPONENT_NAME = 'RNTTextWithAttachmentInput';
const RNTTextWithAttachmentInput =
  requireNativeComponent<NativeComponentProps>(NATIVE_COMPONENT_NAME);

export const TextInputWithAttachments = forwardRef(
  ({ onContentSizeChange, onTextChange, style, ...props }: Props, ref) => {
    const reactTag = useRef<number | null>(null);
    const [contentSize, setContentSize] = useState<ContentSize>();

    const contentChanged = (event: ContentSizeChangeEvent) => {
      setContentSize(event.nativeEvent.contentSize);
      onContentSizeChange?.(event.nativeEvent.contentSize);
    };

    const textChanged = (event: { nativeEvent: { text: string } }) => {
      onTextChange?.(event.nativeEvent.text);
    };

    const runNativeFunc = (functionName: NativeFunctionName, params: unknown[]) => {
      UIManager.dispatchViewManagerCommand(
        ReactNative.findNodeHandle(reactTag.current),
        UIManager.getViewManagerConfig(NATIVE_COMPONENT_NAME).Commands[functionName],
        params,
      );
    };

    const clear = () => {
      runNativeFunc('clear', []);
    };

    const focus = () => {
      runNativeFunc('focus', []);
    };

    const addAttachment = (tag: string) => {
      runNativeFunc('addAttachment', [tag]);
    };

    const blur = () => {
      runNativeFunc('blur', []);
    };

    useImperativeHandle(ref, () => ({
      clear,
      addAttachment,
      focus,
      blur,
    }));

    return (
      <RNTTextWithAttachmentInput
        ref={(nativeRef) => (reactTag.current = ReactNative.findNodeHandle(nativeRef))}
        style={[style, { ...contentSize }]}
        onContentSizeChange={contentChanged}
        onTextChange={textChanged}
        {...props}
      />
    );
  },
);
