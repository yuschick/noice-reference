export type SentChatBoosterRequest = {
  chatItemType: 'SentChatBoosterRequest';
  id: string;
  userId: string;
};

export type ReceivedChatBoosterRequest = {
  chatItemType: 'ReceivedChatBoosterRequest';
  id: string;
  userId: string;
};
