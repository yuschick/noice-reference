import { useNavigate, useParams } from 'react-router';

import { Routes } from '@common/route';
import { StoreItemPage } from '@common/sellable-item';

export function StoreItem() {
  const { storeItemId } = useParams();
  const navigate = useNavigate();

  if (!storeItemId) {
    navigate(Routes.Store, { replace: true });
    return null;
  }

  return <StoreItemPage storeItemId={storeItemId} />;
}
