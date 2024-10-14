import { CardHighlightState } from '../../card/types';

import { AnimatedBoosterScore } from './AnimatedBoosterScore';

interface Props {
  classNames?: {
    boosterScoreClassName?: string;
  };
  highlightState: CardHighlightState;
}

export function AnimatedBoosterScores({ classNames, highlightState }: Props) {
  const { boosters, boosterAnimationTimings } = highlightState;

  if (!boosterAnimationTimings) {
    return null;
  }

  const { highlightBoosterDelay, highlightBoosterDuration } = boosterAnimationTimings;

  return (
    <>
      {boosters.map((booster, index) => {
        // Calculate delay for each booster:
        // 1. Take in account the animation durations of previous boosters
        // 2. Take in account the delays between the boosters.
        //
        // Notice that useAnimatedBoosterScores hook will take care of the inital delay
        // before the first booster label is shown.
        const delay = index * highlightBoosterDuration + index * highlightBoosterDelay;

        return (
          <AnimatedBoosterScore
            booster={booster}
            className={classNames?.boosterScoreClassName}
            delay={delay}
            duration={highlightBoosterDuration}
            key={booster.boosterId}
          />
        );
      })}
    </>
  );
}
