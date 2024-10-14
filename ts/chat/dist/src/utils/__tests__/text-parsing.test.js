"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_parsing_1 = require("../text-parsing");
describe('Text parsing utils', () => {
    const emojiList = {
        catJAM: {
            label: ':catjam:',
            source: `${NOICE.CDN_URL}/emotes/catjam.gif`,
            itemId: 'emoji-catjam',
        },
        noice: {
            label: ':noice:',
            source: `${NOICE.CDN_URL}/emotes/noice.png`,
            itemId: 'emoji-noice',
        },
    };
    const emojiDefs = Object.values(emojiList);
    describe('parseEmojisFromMessage', () => {
        it('should return an empty array if there are no emojis', () => {
            const result = (0, text_parsing_1.parseEmojisFromMessage)('Hello I do not have any emojis', emojiDefs);
            expect(result).toHaveLength(0);
        });
        it("should ignore messages with single :'s or invalid emojis", () => {
            const singleColon = (0, text_parsing_1.parseEmojisFromMessage)('Hello: I do not have any emojis', emojiDefs);
            expect(singleColon).toHaveLength(0);
            const trailingColon = (0, text_parsing_1.parseEmojisFromMessage)('Hello:', emojiDefs);
            expect(trailingColon).toHaveLength(0);
            const invalidEmoji = (0, text_parsing_1.parseEmojisFromMessage)('Hello :there: I do: not have any :emojis', emojiDefs);
            expect(invalidEmoji).toHaveLength(0);
        });
        it('should return an array of message attachments when there is one emoji', () => {
            const oneEmoji = (0, text_parsing_1.parseEmojisFromMessage)('Hello :noice:!', emojiDefs);
            expect(oneEmoji).toHaveLength(1);
            expect(oneEmoji[0]).toEqual({
                label: emojiList.noice.label,
                source: emojiList.noice.source,
                startIndex: 6,
                endIndex: 12,
                itemId: emojiList.noice.itemId,
            });
            const onlyEmoji = (0, text_parsing_1.parseEmojisFromMessage)(':noice:', emojiDefs);
            expect(onlyEmoji).toHaveLength(1);
            expect(onlyEmoji[0]).toEqual({
                label: emojiList.noice.label,
                source: emojiList.noice.source,
                startIndex: 0,
                endIndex: 6,
                itemId: emojiList.noice.itemId,
            });
        });
        it('should return an array of message attachments when there are many emojis', () => {
            const someEmojis = (0, text_parsing_1.parseEmojisFromMessage)('Lets goooo :catJAM::noice:', emojiDefs);
            expect(someEmojis).toHaveLength(2);
            expect(someEmojis[0].label).toEqual(emojiList.catJAM.label);
            expect(someEmojis[0].source).toEqual(emojiList.catJAM.source);
            expect(someEmojis[0].itemId).toEqual(emojiList.catJAM.itemId);
            expect(someEmojis[1].label).toEqual(emojiList.noice.label);
            expect(someEmojis[1].source).toEqual(emojiList.noice.source);
            expect(someEmojis[1].itemId).toEqual(emojiList.noice.itemId);
            const onlyEmojis = (0, text_parsing_1.parseEmojisFromMessage)(':catJAM: :catjam: :CATJAM:', emojiDefs);
            expect(onlyEmojis).toHaveLength(3);
            expect(onlyEmojis[0].label).toEqual(emojiList.catJAM.label);
            expect(onlyEmojis[0].source).toEqual(emojiList.catJAM.source);
            expect(onlyEmojis[0].itemId).toEqual(emojiList.catJAM.itemId);
            expect(onlyEmojis[1].label).toEqual(emojiList.catJAM.label);
            expect(onlyEmojis[1].source).toEqual(emojiList.catJAM.source);
            expect(onlyEmojis[1].itemId).toEqual(emojiList.catJAM.itemId);
            expect(onlyEmojis[2].label).toEqual(emojiList.catJAM.label);
            expect(onlyEmojis[2].source).toEqual(emojiList.catJAM.source);
            expect(onlyEmojis[2].itemId).toEqual(emojiList.catJAM.itemId);
        });
    });
});
//# sourceMappingURL=text-parsing.test.js.map