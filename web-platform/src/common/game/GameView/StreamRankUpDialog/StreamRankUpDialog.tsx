import { useCardGameAPI } from '@noice-com/card-game';
import { AnalyticsEventClientRankUpDialogType } from '@noice-com/schemas/analytics/analytics.pb';
import { useEffect, useRef, useState } from 'react';

import { useHasUnclaimedSeasonRewards } from '@common/season';
import { SeasonRankUpDialog } from '@common/season/SeasonRankUpDialog';

export function StreamRankUpDialog({
  gameId,
  seasonId,
}: {
  gameId: string;
  seasonId: string;
}) {
  const { events } = useCardGameAPI();
  const [showDialog, setShowDialog] = useState(false);
  const { gamesWithSeasonRewards, loading } = useHasUnclaimedSeasonRewards();
  const initialCheckIsDone = useRef(false);
  const context = useRef(
    AnalyticsEventClientRankUpDialogType.ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_JOIN_STREAM,
  );

  // This effect decides whether to show the dialog to user when joining the stream
  // depending on if the user has unclaimed rewards in that particular game and season.
  // This ensures that the dialog is not shown right after the match ends, but only
  // after the whole match end sequence is completed
  useEffect(() => {
    if (initialCheckIsDone.current || loading) {
      return;
    }

    if (
      gamesWithSeasonRewards.find(
        (game) => game.gameId === gameId && game.seasonId === seasonId,
      )
    ) {
      setShowDialog(true);
    }
    initialCheckIsDone.current = true;
  }, [gamesWithSeasonRewards, gameId, loading, seasonId]);

  useEffect(() => {
    const show = () => {
      context.current =
        AnalyticsEventClientRankUpDialogType.ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_MATCH_END;
      if (
        gamesWithSeasonRewards.find(
          (game) => game.gameId === gameId && game.seasonId === seasonId,
        )
      ) {
        setShowDialog(true);
      }
    };

    events.addListener('onMatchEndSequenceCompleted', show);

    return () => {
      events.removeListener('onMatchEndSequenceCompleted', show);
    };
  }, [events, gameId, gamesWithSeasonRewards, seasonId]);

  const onClose = () => {
    setShowDialog(false);
    context.current =
      AnalyticsEventClientRankUpDialogType.ANALYTICS_EVENT_CLIENT_RANK_UP_DIALOG_TYPE_JOIN_STREAM;
  };

  if (!showDialog) {
    return null;
  }

  return (
    <SeasonRankUpDialog
      context={context.current}
      onClose={onClose}
    />
  );
}
