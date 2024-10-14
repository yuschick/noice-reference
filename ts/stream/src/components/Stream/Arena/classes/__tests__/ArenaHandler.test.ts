/* eslint-disable @typescript-eslint/no-non-null-assertion */
jest.mock('@noice-com/web-renderer');

import { CrowdMode } from '@noice-com/common-ui/src/types/rendering';
import { AnimationCategory } from '@noice-com/schemas/avatar/animation.pb';
import { Rarity } from '@noice-com/schemas/rarity/rarity.pb';
// eslint-disable-next-line no-restricted-imports
import { Graphics, PlayerV3 } from '@noice-com/web-renderer/src/legacy';

import {
  createArenaConfig,
  createAvatarConfig,
  createGroupConfig,
  createRemoteAvatarConfig,
} from '../__testdata__/arena-handler-data';
import { ArenaHandler, getAvatarId, getTeamIndex } from '../ArenaHandler';

const LOCAL_GROUP_ID = 'group-1';

describe('ArenaStreamEventHandler', () => {
  const createInitializedHandler = async () => {
    const handler = new ArenaHandler({
      graphics: new Graphics(),
      animations: [],
      localGroupId: LOCAL_GROUP_ID,
    });

    const { onArenaEvent, onAvatarsEvent } = handler.getHandlers();

    onArenaEvent!(createArenaConfig('TestArena', [createGroupConfig(1, true)]));

    await onAvatarsEvent!(
      {
        avatars: [
          createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0),
          createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1),
        ],
      },
      0,
    );

    expect(handler.renderedAvatarCount).toEqual(2);

    for (const avatar of handler.renderedAvatars.values()) {
      (
        avatar.triggerAnimationByCategory as jest.Mock<PlayerV3['triggerAnimationById']>
      ).mockClear();

      (
        avatar.triggerAnimationByCategory as jest.Mock<
          PlayerV3['triggerAnimationByCategory']
        >
      ).mockClear();
    }

    return handler;
  };

  describe('Utils', () => {
    it('getAvatarId should return the ID for the given team and slot', () => {
      const slot1 = createAvatarConfig(0);
      const slot4 = createAvatarConfig(3);

      const group1 = createGroupConfig(0);
      const group2 = createGroupConfig(1);

      expect(getAvatarId(group1, slot1)).toEqual(0);
      expect(getAvatarId(group2, slot4)).toEqual(7);
    });

    it('getTeamIndex should return the index for the given team locator', () => {
      const group1 = createGroupConfig(0);
      const group2 = createGroupConfig(1);

      expect(getTeamIndex(group1)).toEqual(0);
      expect(getTeamIndex(group2)).toEqual(4);
    });
  });

  describe('Event Handling', () => {
    describe('onArenaEvent', () => {
      it('should create an arena and a crowd', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent } = handler.getHandlers();

        expect(handler.arenaExists).toEqual(false);
        expect(handler.arena).toBeNull();

        expect(handler.crowdExists).toEqual(false);
        expect(handler.crowd).toBeNull();

        const config = createArenaConfig('TestArena', [createGroupConfig(1, true)]);
        await onArenaEvent!(config);

        expect(handler.arenaExists).toEqual(true);
        expect(handler.arena).not.toBeNull();

        expect(handler.crowdExists).toEqual(true);
        expect(handler.crowd).not.toBeNull();
      });

      it('should wait for onAvatarsEvent before rendering avatars', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent, onAvatarsEvent } = handler.getHandlers();

        expect(handler.initialRenderOccurred).toEqual(false);

        const config = createArenaConfig('TestArena', [createGroupConfig(1, true)]);
        await onArenaEvent!(config);

        expect(handler.crowd).not.toBeNull();

        expect(handler.crowd!.add).toHaveBeenCalledTimes(0);
        expect(handler.initialRenderOccurred).toEqual(false);

        const user1 = createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0);
        const user2 = createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1);
        await onAvatarsEvent!(
          {
            avatars: [user1, user2],
          },
          0,
        );

        expect(handler.crowd!.add).toHaveBeenCalledTimes(2);
        expect(handler.initialRenderOccurred).toEqual(true);
      });

      it('should remove any pre-existing arenas', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent } = handler.getHandlers();

        await onArenaEvent!(createArenaConfig('TestArena', [createGroupConfig(1, true)]));

        const arena = handler.arena;
        await onArenaEvent!(
          createArenaConfig('AnotherArena', [createGroupConfig(1, true)]),
        );

        expect(handler.arena).not.toEqual(arena);
      });

      it('should do nothing if the same arena gets received twice', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent } = handler.getHandlers();

        await onArenaEvent!(createArenaConfig('TestArena', [createGroupConfig(1, true)]));

        const arena = handler.arena;
        await onArenaEvent!(createArenaConfig('TestArena', [createGroupConfig(1, true)]));

        expect(handler.arena).toEqual(arena);
      });
    });

    describe('onAvatarsEvent', () => {
      it('onAvatarsEvent: should recalculate team indices and avatar slots', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onAvatarsEvent } = handler.getHandlers();

        expect(handler.trackedAvatarCount).toEqual(0);
        expect(handler.renderedAvatarCount).toEqual(0);

        expect(handler.initialAvatarsExist).toEqual(false);

        const user1 = createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0);
        const user2 = createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1);

        await onAvatarsEvent!(
          {
            avatars: [user1, user2],
          },
          0,
        );

        expect(handler.trackedAvatarCount).toEqual(2);
        expect(handler.renderedAvatarCount).toEqual(0);

        expect(handler.initialAvatarsExist).toEqual(true);
      });

      it('should wait for onArenaEvent before rendering avatars', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent, onAvatarsEvent } = handler.getHandlers();

        expect(handler.trackedAvatarCount).toEqual(0);
        expect(handler.renderedAvatarCount).toEqual(0);

        expect(handler.initialRenderOccurred).toEqual(false);

        const user1 = createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0);
        const user2 = createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1);

        await onAvatarsEvent!(
          {
            avatars: [user1, user2],
          },
          0,
        );

        expect(handler.trackedAvatarCount).toEqual(2);
        expect(handler.renderedAvatarCount).toEqual(0);

        expect(handler.initialRenderOccurred).toEqual(false);

        const config = createArenaConfig('TestArena', [createGroupConfig(1, true)]);
        await onArenaEvent!(config);

        expect(handler.trackedAvatarCount).toEqual(2);
        expect(handler.renderedAvatarCount).toEqual(2);

        expect(handler.crowd!.add).toHaveBeenCalledTimes(2);

        expect(handler.initialRenderOccurred).toEqual(true);
      });

      it('should trigger the idle animation on existing avatars and player join on new avatars', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent, onAvatarsEvent } = handler.getHandlers();

        await onArenaEvent!(createArenaConfig('TestArena', [createGroupConfig(1, true)]));

        await onAvatarsEvent!(
          {
            avatars: [
              createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0),
              createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1),
            ],
          },
          0,
        );

        for (const avatar of handler.renderedAvatars.values()) {
          expect(avatar.triggerAnimationByCategory).toHaveBeenCalledWith(
            AnimationCategory.CATEGORY_IDLE,
          );
        }

        await onAvatarsEvent!(
          {
            avatars: [
              createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0),
              createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1),
              createRemoteAvatarConfig('user-3', LOCAL_GROUP_ID, 2),
            ],
          },
          0,
        );

        const newlyAddedAvatar = handler.renderedAvatars.get('user-3');
        expect(newlyAddedAvatar).toBeDefined();

        expect(newlyAddedAvatar!.triggerAnimationByCategory).toHaveBeenCalledWith(
          AnimationCategory.CATEGORY_PLAYER_JOIN,
        );
      });

      it('should remove avatars not in the local group if crowd mode is change into CrowdMode.LocalGroup', async () => {
        const handler = new ArenaHandler({
          graphics: new Graphics(),
          animations: [],
          localGroupId: LOCAL_GROUP_ID,
        });

        const { onArenaEvent, onAvatarsEvent } = handler.getHandlers();

        await onArenaEvent!(
          createArenaConfig('TestArena', [
            createGroupConfig(1, true),
            createGroupConfig(2, false),
          ]),
        );

        await onAvatarsEvent!(
          {
            avatars: [
              createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0),
              createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1),
              createRemoteAvatarConfig('user-3', 'group-2', 2),
            ],
          },
          0,
        );

        expect(handler.crowd!.add).toHaveBeenCalledTimes(3);

        const nonLocalGroupAvatar = handler.renderedAvatars.get('user-3');
        expect(nonLocalGroupAvatar).toBeDefined();

        handler.crowdMode = CrowdMode.LocalGroupOnly;

        expect(nonLocalGroupAvatar!.removeFromParent).toHaveBeenCalledTimes(1);

        handler.crowdMode = CrowdMode.All;

        expect(handler.crowd!.add).toHaveBeenCalledTimes(4);
      });

      it('should remove avatars that have left', async () => {
        const handler = await createInitializedHandler();
        const { onAvatarsEvent } = handler.getHandlers();

        const leavingAvatar = handler.renderedAvatars.get('user-2');
        expect(leavingAvatar).toBeDefined();

        expect(handler.trackedAvatarCount).toEqual(2);
        expect(handler.renderedAvatarCount).toEqual(2);

        await onAvatarsEvent!(
          {
            avatars: [createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0)],
          },
          0,
        );

        expect(leavingAvatar!.removeFromParent).toHaveBeenCalled();

        expect(handler.trackedAvatarCount).toEqual(1);
        expect(handler.renderedAvatarCount).toEqual(1);
      });
    });

    it('onEmoteEvent: should increment emoteCount and play the given animation', async () => {
      const handler = await createInitializedHandler();
      const { onEmoteEvent } = handler.getHandlers();

      const userId = 'user-1';

      const avatar = handler.renderedAvatars.get(userId);
      expect(avatar).toBeDefined();

      expect(handler.emoteCount).toEqual(0);

      await onEmoteEvent!({
        userId,
        animationId: 'emote-1',
      });

      expect(handler.emoteCount).toEqual(1);
      expect(avatar!.triggerAnimationById).toHaveBeenCalledWith('emote-1');
    });

    it('onEmojiEvent: should increment emojiCount and trigger the given emoji', async () => {
      const handler = await createInitializedHandler();
      const { onEmojiEvent } = handler.getHandlers();

      const userId = 'user-1';
      const emoji = ':dogjam:';

      const avatar = handler.renderedAvatars.get(userId);
      expect(avatar).toBeDefined();

      expect(handler.emojiCount).toEqual(0);

      await onEmojiEvent!({
        userId,
        emojiName: emoji,
        emojiUrl: 'http://media/dogjam-id',
      });

      expect(handler.emojiCount).toEqual(1);
      expect(avatar!.triggerEmoji).toHaveBeenCalledWith(
        emoji,
        'http://media/dogjam-id',
        1,
      );
    });

    it('onCardSetActiveEvent: should trigger the card select animation for the given avatar', async () => {
      const handler = await createInitializedHandler();
      const { onCardSetActiveEvent } = handler.getHandlers();

      const userId = 'user-1';
      const rarity = Rarity.RARITY_LEGENDARY;

      const avatar = handler.renderedAvatars.get(userId);
      expect(avatar).toBeDefined();

      await onCardSetActiveEvent!({
        userId,
        cardId: 'best-card',
        cardRarity: rarity,
      });

      expect(avatar!.selectCard).toHaveBeenCalledWith(rarity);
    });

    it('onBoosterRequestedEvent: should trigger the booster request animation for the given users', async () => {
      const handler = await createInitializedHandler();
      const { onBoosterRequestedEvent } = handler.getHandlers();

      const userId = 'user-1';
      const targetUserId = 'user-2';
      const boosterId = 4;

      const source = handler.renderedAvatars.get(userId);
      const target = handler.renderedAvatars.get(targetUserId);

      expect(source).toBeDefined();
      expect(target).toBeDefined();

      await onBoosterRequestedEvent!({
        userId,
        targetUserId,
        boosterId,
      });

      expect(source!.requestBooster).toHaveBeenCalledWith(target, boosterId);
    });

    it('onBoosterUsedEvent: should trigger the booster used animation for the given users', async () => {
      const handler = await createInitializedHandler();
      const { onBoosterUsedEvent } = handler.getHandlers();

      const userId = 'user-1';
      const targetUserId = 'user-2';
      const boosterId = 4;

      const source = handler.renderedAvatars.get(userId);
      const target = handler.renderedAvatars.get(targetUserId);

      expect(source).toBeDefined();
      expect(target).toBeDefined();

      await onBoosterUsedEvent!({
        userId,
        targetUserId,
        boosterId,
      });

      expect(source!.useBooster).toHaveBeenCalledWith(target, boosterId);
    });

    it('onChatMessageSentEvent: should trigger the sent message animation', async () => {
      const handler = await createInitializedHandler();
      const { onChatMessageSentEvent } = handler.getHandlers();

      const userId = 'user-1';

      const avatar = handler.renderedAvatars.get(userId);
      expect(avatar).toBeDefined();

      await onChatMessageSentEvent!({
        userId,
      });

      expect(avatar!.triggerAnimationByCategory).toHaveBeenCalledWith(
        AnimationCategory.CATEGORY_CHAT_MESSAGE,
      );
    });

    it('onGroupCheer: should trigger a random cheering animation for the participants', async () => {
      const handler = await createInitializedHandler();
      const { onGroupCheerEvent } = handler.getHandlers();

      const participantIds = ['user-1', 'user-2'];

      await onGroupCheerEvent!({
        participantIds,
      });

      for (const id of participantIds) {
        const avatar = handler.renderedAvatars.get(id);
        expect(avatar).toBeDefined();

        expect(avatar!.triggerAnimationByCategory).toHaveBeenCalledWith(
          AnimationCategory.CATEGORY_CHEER,
        );
      }
    });

    it('onMatchStart: should trigger the excited animation for all avatars', async () => {
      const handler = await createInitializedHandler();
      const { onMatchStartEvent } = handler.getHandlers();

      await onMatchStartEvent!();

      for (const avatar of handler.renderedAvatars.values()) {
        expect(avatar.triggerAnimationByCategory).toHaveBeenCalledWith(
          AnimationCategory.CATEGORY_EXCITED,
        );
      }
    });

    it('onMatchEnd: should trigger the excited animation for the best group', async () => {
      const handler = new ArenaHandler({
        graphics: new Graphics(),
        animations: [],
        localGroupId: LOCAL_GROUP_ID,
      });

      const { onArenaEvent, onAvatarsEvent, onMatchEndEvent } = handler.getHandlers();

      await onArenaEvent!(
        createArenaConfig('TestArena', [
          createGroupConfig(1, true),
          createGroupConfig(2),
        ]),
      );

      const bestGroupId = 'best-group';
      const bestGroupUserIds = ['best-user-1', 'best-user-2'];

      await onAvatarsEvent!(
        {
          avatars: [
            createRemoteAvatarConfig('user-1', LOCAL_GROUP_ID, 0),
            createRemoteAvatarConfig('user-2', LOCAL_GROUP_ID, 1),
            createRemoteAvatarConfig(bestGroupUserIds[0], bestGroupId, 0),
            createRemoteAvatarConfig(bestGroupUserIds[1], bestGroupId, 0),
          ],
        },
        0,
      );

      await onMatchEndEvent!({
        bestGroupId,
      });

      for (const id of bestGroupUserIds) {
        const avatar = handler.renderedAvatars.get(id);
        expect(avatar).toBeDefined();

        expect(avatar!.triggerAnimationByCategory).toHaveBeenCalledWith(
          AnimationCategory.CATEGORY_EXCITED,
        );
      }
    });
  });

  describe('Analytics', () => {
    it('should return and reset the relevant metrics when requested', async () => {
      const handler = await createInitializedHandler();
      const { onEmojiEvent } = handler.getHandlers();

      await onEmojiEvent!({
        userId: 'user-1',
        emojiName: ':dogjam:',
        emojiUrl: 'http://media/dogjam.png',
      });

      expect(handler.emojiCount).toEqual(1);

      const metrics = handler.consumeMetrics();
      expect(metrics).toEqual<typeof metrics>({
        emojiCount: 1,
        emoteCount: 0,
        avatarCount: handler.renderedAvatarCount,
        avatarVersions: {
          unknown: 2,
        },
      });

      expect(handler.emojiCount).toEqual(0);
    });
  });
});
