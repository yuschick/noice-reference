import { gql } from '@apollo/client';

gql`
  subscription StreamChannelStatus($channelId: ID!) {
    channelStreamDetailSubscribe(channelId: $channelId) {
      streamId
      channelId
      noicePredictionsEnabled
      challengesEnabled
      serverRenderingEnabled
    }
  }

  subscription StreamStatus($channelId: ID!, $streamId: ID!) {
    streamStatusSubscribe(channelId: $channelId, streamId: $streamId) {
      liveStatus
      mlStatus
      crStatus
      restreamingStatus
      gameRunnerStatus
    }
  }

  subscription StreamIngestStats($channelId: ID!) {
    ingestStatsSubscribe(channelId: $channelId) {
      ...ChannelIngestStats
    }
  }

  subscription StreamMatchStatusEvents($streamId: ID!) {
    streamEventsSubscribe(streamId: $streamId) {
      content {
        __typename
        ... on GameLogicMatchPauseStateChangedMsg {
          paused
        }
      }
    }
  }

  fragment ChannelIngestStats on ChannelIngestStatsEvent {
    width
    height
    framerate
    bitrate
    bSlices
    audioSampleRate
    audioChannelCnt
  }

  query MatchState($streamId: ID!) {
    matchState(streamId: $streamId) {
      matchState
    }
  }
`;
