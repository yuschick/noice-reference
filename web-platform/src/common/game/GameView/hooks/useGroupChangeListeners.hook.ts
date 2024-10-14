import { gql } from '@apollo/client';
import { useCardGameAPI } from '@noice-com/card-game';
import { useAnalytics } from '@noice-com/common-ui';
import { AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext } from '@noice-com/schemas/analytics/analytics.pb';
import { useParty } from '@noice-com/social';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Notifications, useNotifications } from '@common/notification';
import { Routes } from '@common/route';
import { StreamViewState, useStreamState, useStreamGame } from '@common/stream';
import { useListenToUIEvent, AppUIEventType } from '@common/ui-event';
import { usePartyInvitationAcceptedPartyLazyQuery } from '@gen';

gql`
  query PartyInvitationAcceptedParty($partyId: ID!) {
    party(partyId: $partyId) {
      streamId
      channel {
        name
      }
    }
  }
`;

export function useGroupChangeListeners(): void {
  const navigate = useNavigate();
  const { trackEvent } = useAnalytics();
  const { streamId: currentStreamId, joinGame, changeTeam, leaveGame } = useStreamGame();
  const { inParty, leaveParty } = useParty();
  const { setStreamViewState } = useStreamState();
  const { events } = useCardGameAPI();
  const {
    actions: { addNotification },
  } = useNotifications();

  const [fetchParty] = usePartyInvitationAcceptedPartyLazyQuery();

  const handlePartyInvitationAccepted = useCallback(
    async (partyId: string) => {
      const { data } = await fetchParty({
        variables: { partyId },
        // @todo this is to make sure we get the latest party data
        // we need to fix this by mutating the cache instead
        fetchPolicy: 'network-only',
      });

      const party = data?.party;

      if (!party) {
        throw new Error(
          'handlePartyInvitationAccepted: party not found with id ' + partyId,
        );
      }

      // If inviter not in a stream, leave current game
      if (!party.streamId || !party.channel) {
        await leaveGame({ forceGroupReset: true });
        navigate(Routes.Home);
        return;
      }

      // Otherwise just join the inviter to game
      await joinGame(party.streamId, { isSolo: false, forceGroupReset: true });
      navigate(`/${party.channel.name.toLowerCase()}`, { state: { joinGame: true } });
      setStreamViewState(StreamViewState.Full);
    },
    [navigate, fetchParty, joinGame, leaveGame, setStreamViewState],
  );

  useListenToUIEvent(
    AppUIEventType.PartyInvitationAccepted,
    handlePartyInvitationAccepted,
  );

  const handlePartyCreated = useCallback(async () => {
    if (!currentStreamId) {
      return;
    }

    await joinGame(currentStreamId, { isSolo: false });
  }, [currentStreamId, joinGame]);

  useListenToUIEvent(AppUIEventType.PartyCreated, handlePartyCreated);

  const handleLeftParty = useCallback(async () => {
    if (!currentStreamId) {
      return;
    }

    await joinGame(currentStreamId, { isSolo: false, forceGroupReset: true });
  }, [currentStreamId, joinGame]);

  useListenToUIEvent(AppUIEventType.PartyLeft, handleLeftParty);

  // Listen to card game API events
  useEffect(() => {
    const onTeamChange = async ({
      isSolo,
      context,
    }: {
      isSolo: boolean;
      context: AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext;
    }) => {
      if (!currentStreamId) {
        return;
      }

      if (!inParty) {
        await changeTeam(currentStreamId, { isSolo });
      } else {
        // We omit the player left event because we dont't want
        // handleLeftParty above to trigger
        await leaveParty({ omitPlayerLeftEvent: true });
        await joinGame(currentStreamId, { isSolo, forceGroupReset: true });
      }

      trackEvent({
        clientSoloPlayToggle: {
          enabled: isSolo,
          context,
        },
      });
    };

    // team menu actions
    const handleTeamChange = () =>
      onTeamChange({
        isSolo: false,
        context:
          AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext.SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU,
      });

    const handlePlaySolo = () =>
      onTeamChange({
        isSolo: true,
        context:
          AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext.SOLO_PLAY_TOGGLE_CONTEXT_TEAM_MENU,
      });

    // solo play menu actions
    const handleJoinTeam = () =>
      onTeamChange({
        isSolo: false,
        context:
          AnalyticsEventClientSoloPlayToggleSoloPlayToggleContext.SOLO_PLAY_TOGGLE_CONTEXT_SOLO_PLAY_MENU,
      });

    // misc
    const handleTeamChangeNoVacantTeams = () => {
      addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'Team change not available',
            subtext: 'There are no vacant teams to join',
          },
        },
      });
    };

    const handleTeamChangeSucceeded = (isSolo: boolean) => {
      addNotification({
        component: {
          type: Notifications.GenericNotificationContent,
          props: {
            description: 'Your team has changed',
            subtext: isSolo
              ? 'You are now playing SOLO'
              : 'You are now playing for a new team',
          },
        },
      });
    };

    events.addListener('onChangeTeamRequested', handleTeamChange);
    events.addListener('onJoinTeamRequested', handleJoinTeam);
    events.addListener('onPlaySoloRequested', handlePlaySolo);
    events.addListener('onChangeTeamResultNoVacantTeams', handleTeamChangeNoVacantTeams);
    events.addListener('onChangeTeamSucceeded', handleTeamChangeSucceeded);

    return () => {
      events.removeListener('onChangeTeamRequested', handleTeamChange);
      events.removeListener('onJoinTeamRequested', handleJoinTeam);
      events.removeListener('onPlaySoloRequested', handlePlaySolo);
      events.removeListener(
        'onChangeTeamResultNoVacantTeams',
        handleTeamChangeNoVacantTeams,
      );
      events.removeListener('onChangeTeamSucceeded', handleTeamChangeSucceeded);
    };
  }, [
    events,
    trackEvent,
    changeTeam,
    joinGame,
    currentStreamId,
    inParty,
    leaveParty,
    addNotification,
  ]);
}
