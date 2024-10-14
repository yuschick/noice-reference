import { ButtonLink, LoadingSpinner } from '@noice-com/common-ui';
import { makeLoggers } from '@noice-com/utils';
import { FaChevronLeft } from 'react-icons/fa';

import { useStreamedGamesContext } from '../../context';
import { useCreatorCardLinks } from '../../hooks';
import { NewCreatorCardButton } from '../../NewCreatorCardButton/NewCreatorCardButton';

import { CreatorCardList } from './CreatorCardList/CreatorCardList';
import styles from './CreatorCards.module.css';
import { GameSelector } from './GameSelector/GameSelector';
import { NewCreatorCardBlock } from './NewCreatorCardBlock/NewCreatorCardBlock';

import { useChannelContext } from '@common/channel';
import { PageHeading } from '@common/layout';

const { logError } = makeLoggers('Creators cards');

function CreatorCardsContent() {
  const { games, gamesLoading, setSelectedGameId, selectedGameId } =
    useStreamedGamesContext();

  if (gamesLoading || (games?.length && !selectedGameId)) {
    return <LoadingSpinner size="lg" />;
  }

  if (!games?.length) {
    return <NewCreatorCardBlock type="no-streamed-games" />;
  }

  const selectedGame = games.find((game) => game.id === selectedGameId);

  if (!selectedGame) {
    logError('Creator card selected game not found');
  }

  return (
    <>
      <GameSelector
        games={games}
        handleSelectGameId={(selectedGameId: string) => setSelectedGameId(selectedGameId)}
        selectedGameId={selectedGameId}
      />
      {selectedGame && <CreatorCardList game={selectedGame} />}
    </>
  );
}

export function CreatorCards() {
  const { toCreatorCardSettings } = useCreatorCardLinks();
  const { games } = useStreamedGamesContext();
  const { monetizationSettings } = useChannelContext();

  return (
    <>
      <header className={styles.header}>
        <ButtonLink
          fit="content"
          iconStart={FaChevronLeft}
          level="secondary"
          shape="circle"
          size="sm"
          to={toCreatorCardSettings}
        />
        <div className={styles.titleWrapper}>
          <PageHeading
            description="Create your own custom cards to show your game highlights to your community"
            title="Creator cards"
          />
        </div>
        {monetizationSettings?.enabled && !!games?.length && <NewCreatorCardButton />}
      </header>

      {!monetizationSettings?.enabled ? (
        <section className={styles.disabledContentContainer}>
          <p>Creator cards are not available when the monetization is disabled.</p>
        </section>
      ) : (
        <CreatorCardsContent />
      )}
    </>
  );
}
