import { NewCreatorCardButton } from '../../../NewCreatorCardButton/NewCreatorCardButton';

import styles from './NewCreatorCardBlock.module.css';

interface NoCardProps {
  gameName: string;
  type: 'no-cards';
}

interface NoStreamedGamesProps {
  type: 'no-streamed-games';
}

type Props = NoCardProps | NoStreamedGamesProps;

export function NewCreatorCardBlock(props: Props) {
  let sectionText: React.ReactElement = <></>;
  switch (props.type) {
    case 'no-cards':
      sectionText = (
        <>
          You have not added any creator cards yet for {props.gameName} Creators.
          <br />
          <br />
          Start by creating one.
        </>
      );
      break;
    case 'no-streamed-games':
      sectionText = (
        <>
          You have not streamed games that support Noice Predictions yet.
          <br />
          <br />
          Stream a supported game to create your own creator cards.
        </>
      );
      break;
  }

  return (
    <div className={styles.container}>
      <div className={styles.text}>{sectionText}</div>
      {props.type !== 'no-streamed-games' && <NewCreatorCardButton />}
    </div>
  );
}
