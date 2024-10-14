import { StoryHelpers } from '@noice-com/common-ui';

export const getNewParty = () => {
  const partyLeader = StoryHelpers.getNewProfile();
  const member1 = StoryHelpers.getNewProfile();
  const member2 = StoryHelpers.getNewProfile();
  const member3 = StoryHelpers.getNewProfile();

  return {
    id: `${StoryHelpers.getNewId()}`,
    name: 'Party',
    streamId: '123',
    leaderId: partyLeader.userId,
    members: [
      { userId: partyLeader.userId, profile: partyLeader },
      { userId: member1.userId, profile: member1 },
      { userId: member2.userId, profile: member2 },
      { userId: member3.userId, profile: member3 },
    ],
  };
};
