import { Props, CardGame } from './CardGame';
import { MatchEndProvider } from './MatchEnd';

export function CardGameWrapper(props: Props) {
  // This is done purely because of storybook so that we can have CardGame
  // stories and with mocked MatchEndProvider. Not the best but not
  // easy way to do it better and the benefits of CardGame stories are huge.
  return (
    <MatchEndProvider>
      <CardGame {...props} />
    </MatchEndProvider>
  );
}
