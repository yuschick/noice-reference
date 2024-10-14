import { Button } from '@noice-com/common-ui';
import { useNavigate } from 'react-router';

import { useCreatorCardLinks } from '../hooks';

export function NewCreatorCardButton() {
  const navigate = useNavigate();
  const { toCreatorCardCreate } = useCreatorCardLinks();

  return (
    <Button
      fit="content"
      size="sm"
      variant="cta"
      onClick={() => navigate(toCreatorCardCreate)}
    >
      + New Creator Card
    </Button>
  );
}
