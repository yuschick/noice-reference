import { gql } from '@apollo/client';

gql`
  # This is the fragment that contains all data that is needed for the card view
  # and the data is fetched when creating the card
  fragment CreatorCardViewCreatorCard on GameLogicStreamerCard {
    id
    name
    draft
    ...CreatorCardPublishSectionCard
    ...CreatorCardStatusCard
    ...GameStreamerCard
  }

  # This is the fragment that contains all base card data that is needed for the card view,
  # and the data is fetched when getting card options
  fragment CreatorCardViewBaseCard on GameLogicCard {
    id
    name
    season {
      id
      name
      game {
        id
        name
      }
    }
  }
`;
