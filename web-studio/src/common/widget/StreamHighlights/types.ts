export enum StreamHighlightEventType {
  HighScroringCard = 'High Scoring Card',
  MatchStart = 'Match started',
  NewFollower = 'New follower',
  NewViewer = 'New viewer',
  HighScoringCreatorCard = 'Creator Card',
  NewSubscriber = 'New subscriber',
  NewGiftSubscription = 'New Gift Subscription',
}

export type UserStreamHighlightEventType = Extract<
  StreamHighlightEventType,
  | StreamHighlightEventType.NewFollower
  | StreamHighlightEventType.NewSubscriber
  | StreamHighlightEventType.NewGiftSubscription
>;
