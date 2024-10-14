// This is the one place where we need to import the common event types
// to extend them to app ui event types.
// eslint-disable-next-line no-restricted-imports
import { CommonUIEvents, CommonUIEventType } from '@noice-com/common-ui';
import { SocialUIEvents, SocialUIEventType } from '@noice-com/social';

enum UIEventType {
  CardActivationAmount = 'cardActivation.amount',
  StartingCardsDialogOpen = 'startingCardDialog.open',
  DGCPromptOpen = 'dgcPrompt.open',
}

export type AppUIEventType = UIEventType | CommonUIEventType | SocialUIEventType;

export const AppUIEventType = {
  ...UIEventType,
  ...CommonUIEventType,
  ...SocialUIEventType,
};

export interface AppUIEvents extends CommonUIEvents, SocialUIEvents {
  [UIEventType.CardActivationAmount]: number;
  [UIEventType.StartingCardsDialogOpen]: boolean;
  [UIEventType.DGCPromptOpen]: boolean;
}
