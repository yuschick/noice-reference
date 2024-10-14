import { makeLoggers } from '@noice-com/utils';
import {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  TransitionEventHandler,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

const { logWarn, logInfoVerbose } = makeLoggers('NOTIFICATIONS');

const NOOP = () => {};

export interface NotificationBaseProps {
  key: string;
  ref: (ref: HTMLElement) => void;
  onClose?: () => void;
  onTransitionEnd?: TransitionEventHandler<HTMLDivElement>;
}
export interface NotificationItem<
  P extends NotificationBaseProps = NotificationBaseProps,
> {
  view: ForwardRefExoticComponent<P & RefAttributes<HTMLDivElement>>;
  props?: P;
  duration: number;
  id: number;
}

// Context.
type PushNotificationHandler = <P extends NotificationBaseProps = NotificationBaseProps>(
  view: NotificationItem['view'],
  duration?: number,
  props?: P,
) => void;
type RemoveNotificationHandler = (id: number) => void;
type NotifContext = [
  NotificationItem[],
  PushNotificationHandler,
  RemoveNotificationHandler,
];
const NotificationsContext = createContext<NotifContext>([[], NOOP, NOOP]);

interface Props {
  children: ReactNode;
}

export function NotificationsProvider({ children }: Props) {
  const notifState = useManageNotifications();

  return (
    <NotificationsContext.Provider value={notifState}>
      {children}
    </NotificationsContext.Provider>
  );
}

// Stack reducer.
enum ActionTypes {
  Add = 'add',
  Remove = 'remove',
}

interface AddAction {
  type: ActionTypes.Add;
  value: NotificationItem;
}

interface RemoveAction {
  type: ActionTypes.Remove;
  value: number;
}

type StackActions = AddAction | RemoveAction;

interface NotifStack {
  stack: NotificationItem[];
}

const stackReducer = (state: NotifStack, action: StackActions) => {
  switch (action.type) {
    case ActionTypes.Add:
      return {
        stack: [...state.stack, action.value],
      };
    case ActionTypes.Remove:
      return {
        stack: state.stack.filter((notif) => notif.id !== action.value),
      };
    default:
      logWarn(`Unknown action given!`, action);
      return state;
  }
};

let idCounter = 0;

// Context manager.
function useManageNotifications(): NotifContext {
  const [state, dispatch] = useReducer(stackReducer, {
    stack: [],
  });

  const pushNotification: PushNotificationHandler = useCallback(
    (view, duration = 5000, props) => {
      const notifId = idCounter++;
      logInfoVerbose('Pushing notification to stack with id', notifId);
      dispatch({
        type: ActionTypes.Add,
        value: { view, duration, id: notifId, props },
      });
      return notifId;
    },
    [dispatch],
  );

  const removeNotification: RemoveNotificationHandler = useCallback(
    (id) => {
      logInfoVerbose('Removing notification', id, 'from stack');
      dispatch({
        type: ActionTypes.Remove,
        value: id,
      });
    },
    [dispatch],
  );

  return [state.stack, pushNotification, removeNotification];
}

export const useNotifications = (): NotifContext => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error('Trying to use game notifications without NotificationsProvider');
  }

  return context;
};

export const useSendNotification = (): PushNotificationHandler => {
  const [, pushNotif] = useNotifications();

  return pushNotif;
};
