import { Image } from '@noice-com/common-ui';

import { CardDetail } from '../CardDetail/CardDetail';

interface Props {
  gameName: string;
  seasonName: string;
  badgeUrl: string;
}

export function CardDetailSeason({ gameName, seasonName, badgeUrl }: Props) {
  return (
    <CardDetail
      description={`For ${gameName} creators`}
      icon={<Image src={badgeUrl} />}
      value={seasonName}
    />
  );
}
