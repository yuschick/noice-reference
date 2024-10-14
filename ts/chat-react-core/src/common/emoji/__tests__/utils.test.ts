import { parseEmojisFromMessage } from '../utils';

import { InventoryEmojiFragment } from 'gen';

describe('Emoji utils', () => {
  const emojiList: InventoryEmojiFragment[] = [
    {
      label: 'catjam',
      image: 'noice-emoji-url/emotes/catjam.gif',
      id: 'emoji-catjam',
      channelId: '',
    },
    {
      label: 'noice',
      image: 'noice-emoji-url/emotes/noice.gif',
      id: 'emoji-noice',
      channelId: '',
    },
  ];

  describe('parseEmojisFromMessage', () => {
    it('should return an empty array if there are no emojis', () => {
      const result = parseEmojisFromMessage('Hello I do not have any emojis', emojiList);
      expect(result).toHaveLength(0);
    });

    it("should ignore messages with single :'s or invalid emojis", () => {
      const singleColon = parseEmojisFromMessage(
        'Hello: I do not have any emojis',
        emojiList,
      );
      expect(singleColon).toHaveLength(0);

      const trailingColon = parseEmojisFromMessage('Hello:', emojiList);
      expect(trailingColon).toHaveLength(0);

      const invalidEmoji = parseEmojisFromMessage(
        'Hello :there: I do: not have any :emojis',
        emojiList,
      );
      expect(invalidEmoji).toHaveLength(0);
    });

    it('should return an array of message attachments when there is one emoji', () => {
      const oneEmoji = parseEmojisFromMessage('Hello :noice:!', emojiList);
      expect(oneEmoji).toHaveLength(1);
      expect(oneEmoji[0]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 6,
        endIndex: 12,
        itemId: emojiList[1].id,
      });

      const onlyEmoji = parseEmojisFromMessage(':noice:', emojiList);
      expect(onlyEmoji).toHaveLength(1);
      expect(onlyEmoji[0]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 0,
        endIndex: 6,
        itemId: emojiList[1].id,
      });

      const emojiAndOldStyleEmoji = parseEmojisFromMessage(':D :noice:', emojiList);
      expect(emojiAndOldStyleEmoji).toHaveLength(1);
      expect(emojiAndOldStyleEmoji[0]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 3,
        endIndex: 9,
        itemId: emojiList[1].id,
      });

      const emojiAndNotRealEmoji = parseEmojisFromMessage(
        ':total-fake-emoji: :noice:',
        emojiList,
      );
      expect(emojiAndNotRealEmoji).toHaveLength(1);
      expect(emojiAndNotRealEmoji[0]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 19,
        endIndex: 25,
        itemId: emojiList[1].id,
      });
    });

    it('should return an array of message attachments when there are many emojis', () => {
      const someEmojis = parseEmojisFromMessage('Lets goooo :catJAM::noice:', emojiList);
      expect(someEmojis).toHaveLength(2);
      expect(someEmojis[0].label).toEqual(`:${emojiList[0].label}:`);
      expect(someEmojis[0].source).toEqual(emojiList[0].image);
      expect(someEmojis[0].itemId).toEqual(emojiList[0].id);
      expect(someEmojis[1].label).toEqual(`:${emojiList[1].label}:`);
      expect(someEmojis[1].source).toEqual(emojiList[1].image);
      expect(someEmojis[1].itemId).toEqual(emojiList[1].id);

      const onlyEmojis = parseEmojisFromMessage(':catJAM: :catjam: :CATJAM:', emojiList);
      expect(onlyEmojis).toHaveLength(3);
      expect(onlyEmojis[0].label).toEqual(`:${emojiList[0].label}:`);
      expect(onlyEmojis[0].source).toEqual(emojiList[0].image);
      expect(onlyEmojis[0].itemId).toEqual(emojiList[0].id);
      expect(onlyEmojis[1].label).toEqual(`:${emojiList[0].label}:`);
      expect(onlyEmojis[1].source).toEqual(emojiList[0].image);
      expect(onlyEmojis[1].itemId).toEqual(emojiList[0].id);
      expect(onlyEmojis[2].label).toEqual(`:${emojiList[0].label}:`);
      expect(onlyEmojis[2].source).toEqual(emojiList[0].image);
      expect(onlyEmojis[2].itemId).toEqual(emojiList[0].id);

      const emojisAndOldStyleEmojis = parseEmojisFromMessage(
        ':noice: :p :noice:',
        emojiList,
      );
      expect(emojisAndOldStyleEmojis).toHaveLength(2);
      expect(emojisAndOldStyleEmojis[0]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 0,
        endIndex: 6,
        itemId: emojiList[1].id,
      });
      expect(emojisAndOldStyleEmojis[1]).toEqual({
        label: `:${emojiList[1].label}:`,
        source: emojiList[1].image,
        startIndex: 11,
        endIndex: 17,
        itemId: emojiList[1].id,
      });
    });
  });
});
