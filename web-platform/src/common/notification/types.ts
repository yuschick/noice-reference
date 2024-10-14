import { SvgComponent } from '@noice-com/common-ui';

// The notification list type in the provider state
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotificationsList = Notification<any>[];

// The actual notification in the notification list
export interface Notification<
  T extends NotificationComponentBaseProps = NotificationComponentBaseProps,
> {
  id: string;
  component: NotificationProps<T>;
  options?: NotificationOptions;
  events?: {
    onRemoved?(): void;
    onCloseClicked?(): void;
  };
}

// Props for a notification within the notification list
export interface NotificationProps<
  T extends NotificationComponentBaseProps = NotificationComponentBaseProps,
> {
  type: React.ComponentType<T>;
  props: NotificationComponentProps<T>;
}

// Props for the actual notification component
export type NotificationComponentProps<
  T extends NotificationComponentBaseProps = NotificationComponentBaseProps,
> = React.ComponentProps<React.ComponentType<T>>;

// Base props for all notification components
export interface NotificationComponentBaseProps {
  notificationId: string;
  description?: string;
  subtext?: string;
  icon?: SvgComponent;
  theme?: 'light' | 'dark';
}

// Options for a notification
export interface NotificationOptions {
  /** 0 is manual close / "sticky" */
  duration?: number;
}

export interface AddNotificationResult<
  T extends NotificationComponentBaseProps = NotificationComponentBaseProps,
> {
  id: string;
  actions: {
    update: (
      props: Omit<Partial<NotificationComponentProps<T>>, 'notificationId'>,
    ) => void;
    remove: () => void;
  };
}
