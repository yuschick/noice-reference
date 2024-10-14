import { ContentValidationErrorDetailsCause } from '@noice-com/schemas/chat/chat.pb';
import { GraphQLError } from 'graphql';

import { hasPlatformErrorCause } from '../error';

describe('Graphql has platform error', () => {
  describe('Should return the correct cause', () => {
    it('Should return cause requires moderation', () => {
      const baseGqlError = new GraphQLError('Graphql failed query', {
        extensions: {
          details: [
            { cause: ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION },
          ],
        },
      });
      expect(
        hasPlatformErrorCause(
          baseGqlError,
          ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION,
        ),
      ).toMatchObject({
        cause: ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION,
      });
    });
    it('Should return undefined', () => {
      const baseGqlError = new GraphQLError('Graphql failed query');
      expect(
        hasPlatformErrorCause(
          baseGqlError,
          ContentValidationErrorDetailsCause.CAUSE_REQUIRES_MODERATION,
        ),
      ).toBe(undefined);
    });
  });
});
